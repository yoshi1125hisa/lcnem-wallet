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
import { Wallet } from '../../models/wallet';

@Injectable({
  providedIn: 'root'
})
export class GlobalDataService {
  private initialized = false;

  public lang = "en";

  public account = {} as {
    photoUrl: string,
    wallets: Wallet[],
    currentWallet: {
      wallet: SimpleWallet,
      assets: {
        name: string,
        asset: Asset,
        definition: AssetDefinition
      }[]
    }
  };

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

  public async initialize() {
    if (this.initialized) {
      return;
    }

    this.account.photoUrl = this.auth.auth.currentUser!.photoURL!;

    let uid = this.auth.auth.currentUser!.uid;
    let user = await this.firestore.collection("users").doc(uid).ref.get();

    if (!user.exists) {
      await user.ref.set({
        name: this.auth.auth.currentUser!.displayName
      } as User);
    } else {
      //legacy
      let userData = user.data() as any;
      if(userData.wallet) {
        let tempWallet = SimpleWallet.readFromWLT(userData.wallet);
        user.ref.collection("wallets").add({
          nem: tempWallet.address.plain(),
          wallet: userData.wallet
        })
      }
    }
    let wallets = await user.ref.collection("wallets").get();
    this.account.wallets = wallets.docs.map(doc => doc.data() as Wallet);

    await this.refresh();

    this.initialized = true;
  }

  public async refresh() {
    try {
      let assets = await this.accountHttp.getAssetsOwnedByAddress(this.account.currentWallet.wallet.address).toPromise();
      let accountAssets = [];

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
      }

      this.account.currentWallet.assets = accountAssets;
    } catch {
      this.dialog.open(AlertDialogComponent, {
        data: {
          title: this.translation.error[this.lang]
        }
      });
    }
  }

  public translation = {
    error: {
      en: "Error",
      ja: "エラーが発生しました。"
    } as any
  };
}
