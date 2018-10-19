import { Injectable } from '@angular/core';

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
import { Wallet } from '../../models/wallet';

@Injectable({
  providedIn: 'root'
})
export class GlobalDataService {
  public lang = "en";

  public refreshed = false;

  public account: {
    photoUrl: string,
    wallets: Wallet[],
    currentWallet: {
      wallet: SimpleWallet,
      assets: {
        name: string,
        asset: Asset,
        definition: AssetDefinition
      }[],
      refreshed: boolean
    } | null,
    localWallets: SimpleWallet[]
  } = {} as any;

  public accountHttp: AccountHttp;
  public assetHttp: AssetHttp;
  public namespaceHttp: NamespaceHttp;
  public transactionHttp: TransactionHttp;

  public buffer: any;

  constructor(
    private auth: AngularFireAuth,
    private firestore: AngularFirestore,
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

  public async refresh() {
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
      if (userData.wallet) {
        let tempWallet = SimpleWallet.readFromWLT(userData.wallet);
        user.ref.collection("wallets").add({
          name: "1",
          nem: tempWallet.address.plain(),
          wallet: userData.wallet
        } as Wallet)
      }
    }
    let wallets = await user.ref.collection("wallets").get();
    this.account.wallets = wallets.docs.map(doc => doc.data() as Wallet);

    let localWallet = localStorage.getItem("wallets");
    if (localWallet) {
      let localWallets = JSON.parse(localWallet) as string[];
      this.account.localWallets = localWallets.map(w => SimpleWallet.readFromWLT(w));
    }

    let currentWallet = localStorage.getItem("currentWallet");
    if(currentWallet) {
      
    }

    this.refreshed = true;
  }

  public async changeWallet() {
    this.account.currentWallet!.refreshed = false;
  }

  public async refreshWallet() {
    let currentWallet = this.account.currentWallet;
    if(!currentWallet) {
      return;
    }

    let assets = await this.accountHttp.getAssetsOwnedByAddress(currentWallet.wallet.address).toPromise();
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

    currentWallet.assets = accountAssets;

    currentWallet.refreshed = true;
  }

  public async checkRefresh() {
    if(!this.refreshed) {
      await this.refresh();
    }
    if(!this.account.currentWallet) {
      this.router.navigate(["accounts", "wallets"]);
      return;
    }
    if(!this.account.currentWallet.refreshed) {
      await this.refreshWallet();
    }
  }
}
