import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { WalletsService } from './wallets.service';
import { BalanceService } from './balance.service';
import { AngularFireAuth } from '@angular/fire/auth';

import * as firebase from 'firebase/app';
import 'firebase/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { User } from '../../../../firebase/functions/src/models/user';
import { first } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(
    private router: Router,
    private auth: AngularFireAuth,
    private firestore: AngularFirestore,
    private wallet: WalletsService,
    private balance: BalanceService
  ) { }

  public initialize() {
    this.wallet.initialize();
    this.balance.initialize();
  }

  public async login() {
    await this.auth.auth.signInWithPopup(new firebase.auth!.GoogleAuthProvider);

    let uid = this.auth.auth.currentUser!.uid;
    let user = await this.firestore.collection("users").doc(uid).ref.get();

    if (!user.exists) {
      await user.ref.set({
        name: this.auth.auth.currentUser!.displayName
      } as User);
    }
    await this.router.navigate([""]);
  }

  public async logout() {
    await this.auth.auth.signOut();
    this.initialize();

    await this.router.navigate(["accounts", "login"]);
  }

  public async checkLogin() {
    let user = await this.auth.authState.pipe(first()).toPromise();
    if (user == null) {
      await this.router.navigate(["accounts", "login"]);
    }
  }
}
