import { Injectable } from '@angular/core';
import { SimpleWallet, Password } from 'nem-library';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { User } from '../../../../firebase/functions/src/models/user';
import { Wallet } from '../../../../firebase/functions/src/models/wallet';
import { Plan } from '../../../../firebase/functions/src/models/plan';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class WalletsService {
  public wallets?: {
    [id: string]: Wallet
  };
  public plan?: Plan;
  public localWallets: {
    [id: string]: string
  } = {};

  public currentWallet?: string;

  constructor(
    private router: Router,
    private auth: AngularFireAuth,
    private firestore: AngularFirestore
  ) {
  }

  public initialize() {
    this.wallets = undefined;
    this.plan = undefined;
    this.localWallets = {};
    this.deleteCurrentWallet();
  }

  public async checkWallets() {
    await this.readWallets();
    if(!this.currentWallet) {
      this.router.navigate(["accounts", "wallets"]);
    }
  }

  public async createWallet(wallet: Wallet) {
    if(!this.wallets) {
      return;
    }
    
    let wltFile = wallet.wallet;
    if (wallet.local) {
      delete wallet.wallet;
    }

    let uid = this.auth.auth.currentUser!.uid;
    let newWallet = await this.firestore.collection("users").doc(uid).collection("wallets").add(wallet);
    this.wallets[newWallet.id] = wallet;

    if(wallet.local) {
      this.createLocalWallet(newWallet.id, wltFile!);
    }
    
    return newWallet.id;
  }

  public async readWallets(force?: boolean) {
    if(this.wallets && !force) {
      return;
    }
    let uid = this.auth.auth.currentUser!.uid;
    let wallets = await this.firestore.collection("users").doc(uid).collection("wallets").get().toPromise();

    if(wallets.empty) {
      //互換性
      let user = await this.firestore.collection("users").doc(uid).get().toPromise();
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
        wallets = await this.firestore.collection("users").doc(uid).collection("wallets").get().toPromise();

        await user.ref.set({
          name: this.auth.auth.currentUser!.displayName
        } as User);
      }
    }
    this.wallets = {};
    for(let doc of wallets.docs) {
      this.wallets[doc.id] = doc.data() as Wallet;
    }
    this.readLocalWallet();

    for(let id in this.localWallets) {
      if(this.wallets[id]) {
        this.wallets[id].wallet = this.localWallets[id];
      }
    }

    this.currentWallet = localStorage.getItem("currentWallet") || "";
  }

  public async updateWallet(id: string, data: any) {
    if(!this.wallets) {
      return;
    }

    let uid = this.auth.auth.currentUser!.uid;
    await this.firestore.collection("users").doc(uid).collection("wallets").doc(id).set(
      data,
      { merge: true }
    );

    for(let key in data) {
      (this.wallets[id] as any)[key] = data[key];
    }
  }

  public async deleteWallet(id: string) {
    if(!this.wallets) {
      return;
    }
    let uid = this.auth.auth.currentUser!.uid;

    await this.firestore.collection("users").doc(uid).collection("wallets").doc(id).delete();

    if(this.wallets && this.wallets[id]) {
      delete this.wallets[id];
    }
    this.deleteLocalWallet(id);
  }

  public importPrivateKey(id: string, privateKey: string) {
    let uid = this.auth.auth.currentUser!.uid;
    let wallet = SimpleWallet.createWithPrivateKey(uid, new Password(uid), privateKey);
    this.createLocalWallet(id, wallet.writeWLTFile())
  }

  public backupPrivateKey(id: string) {
    if(!this.wallets || !this.wallets[id].wallet) {
      return "";
    }
    let wallet = SimpleWallet.readFromWLT(this.wallets[id].wallet!);
    let account = wallet.open(new Password(this.auth.auth.currentUser!.uid));

    return account.privateKey;
  }

  public createLocalWallet(id: string, wallet: string) {
    this.localWallets[id] = wallet;
    localStorage.setItem("wallets", JSON.stringify(this.localWallets));
  }

  public readLocalWallet() {
    try {
      this.localWallets = JSON.parse(localStorage.getItem("wallets")!);
    } catch {
      this.localWallets = {};
    }
  }

  public deleteLocalWallet(id: string) {
    if(this.localWallets && this.localWallets[id]) {
      delete this.localWallets[id];
      localStorage.setItem("wallets", JSON.stringify(this.localWallets));
    }
  }

  public updateCurrentWallet(id: string) {
    if(!this.wallets || !this.wallets[id].wallet) {
      return;
    }
    this.currentWallet = id;
    localStorage.setItem("currentWallet", id);
  }

  public deleteCurrentWallet() {
    this.currentWallet = undefined;
    localStorage.setItem("currentWallet", "");
  }
}
