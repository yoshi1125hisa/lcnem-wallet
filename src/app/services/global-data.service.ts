import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';

import { firebase } from '@firebase/app';
import '@firebase/auth'
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import {
  Account,
  AccountHttp,
  MosaicHttp,
  NamespaceHttp,
  TransactionHttp,
  Password,
  SimpleWallet,
  Mosaic,
  NEMLibrary,
  MosaicDefinition,
  NetworkTypes,
  XEM,
  PublicAccount
} from 'nem-library';
import { MosaicAdditionalDefinition } from '../../models/mosaic-additional-definition';
import { nodes } from '../../models/nodes';
import { User } from '../../models/user';

@Injectable({
  providedIn: 'root'
})
export class GlobalDataService {
  private initialized = false;

  public lang = "en";

  public account?: Account;

  public definitions?: { [key: string]: MosaicDefinition };
  public additionalDefinitions?: { [key: string]: MosaicAdditionalDefinition };
  public mosaics?: Mosaic[];

  public accountHttp: AccountHttp;
  public mosaicHttp: MosaicHttp;
  public namespaceHttp: NamespaceHttp;
  public transactionHttp: TransactionHttp;

  public buffer: any;

  constructor(
    public auth: AngularFireAuth,
    public firestore: AngularFirestore,
    private http: HttpClient
  ) {
    NEMLibrary.bootstrap(NetworkTypes.MAIN_NET);
    const settings = { timestampsInSnapshots: true };
    firestore.firestore.settings(settings);

    this.accountHttp = new AccountHttp(nodes);
    this.mosaicHttp = new MosaicHttp(nodes);
    this.transactionHttp = new TransactionHttp(nodes);
    this.namespaceHttp = new NamespaceHttp(nodes);

    this.lang = window.navigator.language.substr(0, 2) == "ja" ? "ja" : "en";
  }

  public async login() {
    await this.auth.auth.signInWithPopup(new firebase.auth!.GoogleAuthProvider);
  }

  public async logout() {
    await this.auth.auth.signOut();
    this.initialized = false;
  }

  public async createFirestoreDocument(uid: string, wallet: SimpleWallet) {
    await this.firestore.collection("users").doc(uid).set({
      wallet: wallet.writeWLTFile(),
      name: this.auth.auth.currentUser!.displayName,
      nem: wallet.address.plain(),
      createdAt: Date.now()
    });

    await this.firestore.collection("users").doc(uid).collection("secrets").ref.add({
      password: uid
    });
  }

  public async initialize() {
    if (this.initialized) {
      return;
    }

    let uid = this.auth.auth.currentUser!.uid;
    let user = await this.firestore.collection("users").doc(uid).ref.get();

    if (!user.exists) {
      let password = new Password(uid);
      let wallet = SimpleWallet.create(uid, password);

      await this.createFirestoreDocument(uid, wallet);
      this.account = wallet.open(password);
    } else {
      let userData = user.data() as User;
      let wallet = SimpleWallet.readFromWLT(userData.wallet);
      if(!userData.name) {
        await this.createFirestoreDocument(uid, wallet);
      }

      let secrets = await this.firestore.collection("users").doc(uid).collection("secrets").ref.get();
      let secret = secrets.docs[0].data();
      this.account = wallet.open(new Password(secret.password));
    }

    await this.refresh();

    this.initialized = true;
  }

  public async refresh() {
    this.additionalDefinitions = await this.http.get<{ [key: string]: MosaicAdditionalDefinition }>('assets/data/list.json').toPromise();

    this.mosaics = await this.accountHttp.getMosaicOwnedByAddress(this.account!.address).toPromise().catch(() => { throw new Error() });
    this.definitions = {};
    this.definitions["nem:xem"] = {
      creator: new PublicAccount(),
      id: XEM.MOSAICID,
      description: "",
      properties: {
        divisibility: XEM.DIVISIBILITY,
        initialSupply: XEM.INITIALSUPPLY,
        supplyMutable: XEM.SUPPLYMUTABLE,
        transferable: XEM.TRANSFERABLE
      }
    };

    for (let i = 0; i < this.mosaics!.length; i++) {
      if (this.mosaics![i].mosaicId.namespaceId == "nem") {
        continue;
      }
      let d = await this.mosaicHttp.getMosaicDefinition(this.mosaics![i].mosaicId).toPromise().catch(() => { throw new Error() });
      this.definitions![d.id.namespaceId + ":" + d.id.name] = d;
    }
  }
}
