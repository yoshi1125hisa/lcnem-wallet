import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';

import * as firebase from 'firebase';
import 'firebase/auth'
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import {
  Account,
  AccountHttp,
  AssetHttp,
  NamespaceHttp,
  TransactionHttp,
  Password,
  SimpleWallet,
  Asset,
  NEMLibrary,
  AssetDefinition,
  NetworkTypes,
  XEM,
  PublicAccount
} from 'nem-library';
import { AssetAdditionalDefinition } from '../../models/asset-additional-definition';
import { nodes } from '../../models/nodes';
import { User } from '../../models/user';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class GlobalDataService {
  private initialized = false;

  public lang = "en";

  public photoUrl = "";

  public account?: Account;

  public definitions?: { [key: string]: AssetDefinition };
  public additionalDefinitions?: { [key: string]: AssetAdditionalDefinition };
  public assets?: Asset[];

  public accountHttp: AccountHttp;
  public assetHttp: AssetHttp;
  public namespaceHttp: NamespaceHttp;
  public transactionHttp: TransactionHttp;

  public buffer: any;

  constructor(
    public auth: AngularFireAuth,
    public firestore: AngularFirestore,
    private http: HttpClient,
    private router: Router
  ) {
    NEMLibrary.bootstrap(NetworkTypes.MAIN_NET);
    const settings = { timestampsInSnapshots: true };
    firestore.firestore.settings(settings);

    this.accountHttp = new AccountHttp(nodes);
    this.assetHttp = new AssetHttp(nodes);
    this.transactionHttp = new TransactionHttp(nodes);
    this.namespaceHttp = new NamespaceHttp(nodes);

    this.lang = window.navigator.language.substr(0, 2) == "ja" ? "ja" : "en";
  }

  public back() {
    if (history.length > 1) {
      history.back();
      return;
    }
    this.router.navigate([""]);
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
    this.photoUrl = this.auth.auth.currentUser!.photoURL!;

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
    this.additionalDefinitions = await this.http.get<{ [key: string]: AssetAdditionalDefinition }>('assets/data/list.json').toPromise();

    this.assets = await this.accountHttp.getAssetsOwnedByAddress(this.account!.address).toPromise().catch(() => { throw new Error() });
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

    for (let i = 0; i < this.assets!.length; i++) {
      if (this.assets![i].assetId.namespaceId == "nem") {
        continue;
      }
      let d = await this.assetHttp.getAssetDefinition(this.assets![i].assetId).toPromise().catch(() => { throw new Error() });
      this.definitions![d.id.namespaceId + ":" + d.id.name] = d;
    }
  }
}
