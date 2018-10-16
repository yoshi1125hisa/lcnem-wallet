import { Injectable } from '@angular/core';

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
  PublicAccount,
  Address
} from 'nem-library';
import { nodes } from '../../models/nodes';
import { User } from '../../models/user';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material';
import { AlertDialogComponent } from '../components/alert-dialog/alert-dialog.component';

@Injectable({
  providedIn: 'root'
})
export class GlobalDataService {
  private initialized = false;

  public lang = "en";

  public account: {
    photoUrl: string,
    wallet: SimpleWallet,
    nem: Address,
    assets: {
      name: string,
      asset: Asset,
      definition: AssetDefinition
    }[]
  } = {
    photoUrl: "",
    assets: []
  } as any;

  public accountHttp: AccountHttp;
  public assetHttp: AssetHttp;
  public namespaceHttp: NamespaceHttp;
  public transactionHttp: TransactionHttp;

  public buffer: any;

  constructor(
    private auth: AngularFireAuth,
    private firestore: AngularFirestore,
    private router: Router,
    private dialog: MatDialog
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
      nem: wallet.address.plain()
    });
  }

  public async initialize(callback?: (progress: number) => void) {
    if (this.initialized) {
      return;
    }
    if(callback) {
      callback(0);
    }

    this.account.photoUrl = this.auth.auth.currentUser!.photoURL!;

    let uid = this.auth.auth.currentUser!.uid;
    let user = await this.firestore.collection("users").doc(uid).ref.get();

    if (!user.exists) {
      let password = new Password(uid);
      this.account.wallet = SimpleWallet.create(uid, password);
      this.account.nem = this.account.wallet.address;

      await this.createFirestoreDocument(uid, this.account.wallet);
    } else {
      let userData = user.data() as User;
      this.account.wallet = SimpleWallet.readFromWLT(userData.wallet);
      this.account.nem = this.account.wallet.address;
      if (!userData.name) {
        await this.createFirestoreDocument(uid, this.account.wallet);
      }
    }

    await this.refresh();

    this.initialized = true;
  }

  public async refresh(callback?: (progress: number) => void) {
    try {
      if(callback) {
        callback(20);
      }
      let assets = await this.accountHttp.getAssetsOwnedByAddress(this.account.nem).toPromise();
      let accountAssets = [];
  
      if(callback) {
        callback(40);
      }
  
      for (let asset of assets) {
        let name = asset.assetId.namespaceId + ":" + asset.assetId.name;
  
        let definition: AssetDefinition;
        if (asset.assetId.namespaceId == "nem") {
          definition = {
            creator: new PublicAccount(),
            id: XEM.MOSAICID,
            description: "",
            properties: {
              divisibility: XEM.DIVISIBILITY,
              initialSupply: XEM.INITIALSUPPLY,
              supplyMutable: XEM.SUPPLYMUTABLE,
              transferable: XEM.TRANSFERABLE
            }
          }
        } else {
          definition = await this.assetHttp.getAssetDefinition(asset.assetId).toPromise();
        }
  
        accountAssets.push({
          name: name,
          asset: asset,
          definition: definition
        });
  
        if(callback) {
          callback(40 + (60 / assets.length));
        }
      }

      this.account.assets = accountAssets;
    } catch {
      this.dialog.open(AlertDialogComponent, {
        data: {
          title: this.translation.error[this.lang]
        }
      });
    } finally {
      if(callback) {
        callback(100);
      }
    }
  }

  public translation = {
    error: {
      en: "Error",
      ja: "エラーが発生しました。"
    } as any
  };
}
