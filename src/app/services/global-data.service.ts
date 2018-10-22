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
import { User } from '../../../models/user';
import { Router } from '@angular/router';
import { Wallet } from '../../../models/wallet';

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
      assets?: {
        name: string,
        asset: Asset,
        definition: AssetDefinition
      }[],
      refreshed: boolean
    } | null,
    localWallets: string[]
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

  public async refresh(force?: boolean) {
    if (this.refreshed && !force) {
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
      //互換性
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
      this.account.localWallets = JSON.parse(localWallet) as string[];
    }

    let currentWallet = Number(localStorage.getItem("currentWallet"));
    if (!Number.isNaN(currentWallet)) {
      this.changeWallet(currentWallet);
    }

    this.refreshed = true;
  }

  public async changeWallet(index: number) {
    let wallet = this.account.wallets[index].wallet;
    if(!wallet) {
      return;
    }
    this.account.currentWallet = {
      wallet: SimpleWallet.readFromWLT(wallet),
      refreshed: false
    }
    localStorage.setItem("currentWallet", index.toString());
  }

  public async refreshWallet(force?: boolean) {
    await this.refresh();
    
    let currentWallet = this.account.currentWallet;
    if (!currentWallet) {
      this.router.navigate(["accounts", "wallets"]);
      return;
    }
    if(currentWallet.refreshed && !force) {
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
}
