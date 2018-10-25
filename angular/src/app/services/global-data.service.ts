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
import { User } from '../../../../firebase/functions/src/models/user';
import { Router } from '@angular/router';
import { Wallet } from '../../../../firebase/functions/src/models/wallet';
import { Plan } from '../../../../firebase/functions/src/models/plan';

@Injectable({
  providedIn: 'root'
})
export class GlobalDataService {
  public lang = "en";

  public refreshed = false;

  public account: {
    photoUrl: string,
    wallets: Wallet[],
    plan?: Plan,
    currentWallet: {
      address: Address,
      wallet?: SimpleWallet,
      assets: {
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
    }
    
    let wallets = await user.ref.collection("wallets").get();
    this.account.wallets = wallets.docs.map(doc => doc.data() as Wallet);

    if(user.exists && wallets.empty) {
      //互換性
      let userData = user.data() as any;
      if (userData.wallet) {
        let tempWallet = SimpleWallet.readFromWLT(userData.wallet);
        let data = {
          name: "1",
          local: false,
          nem: tempWallet.address.plain(),
          wallet: userData.wallet
        } as Wallet;
        user.ref.collection("wallets").add(data);
        this.account.wallets = [data];
      }
    }

    let now = new Date(Date.now());
    let plan = await user.ref.collection("plans").where("year", "==", now.getFullYear()).where("month", "==", now.getMonth() + 1).get();

    if(!plan.empty) {

    }

    let localWallet = localStorage.getItem("wallets");
    if (localWallet) {
      this.account.localWallets = JSON.parse(localWallet) as string[];
    } else {
      this.account.localWallets = [];
    }

    let currentWallet = Number(localStorage.getItem("currentWallet"));
    if (!Number.isNaN(currentWallet)) {
      this.changeWallet(currentWallet);
    }

    this.refreshed = true;
  }

  public async changeWallet(index: number) {
    if(this.account.wallets.length - 1 < index) {
      return;
    }
    let wallet = this.account.wallets[index];

    this.account.currentWallet = {
      address: new Address(wallet.nem),
      assets: [],
      refreshed: false
    };

    if(wallet.wallet) {
      this.account.currentWallet!.wallet = SimpleWallet.readFromWLT(wallet.wallet)
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

    let assets = await this.accountHttp.getAssetsOwnedByAddress(currentWallet.address).toPromise();
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
