import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';

import * as firebase from 'firebase/app';
import 'firebase/auth';
import { WalletService } from '../wallet/wallet.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  public get user() { return this.auth.auth.currentUser }
  public get user$() { return this.auth.user }

  constructor(
    private auth: AngularFireAuth,
    private wallet: WalletService
  ) {
    this.user$.subscribe(
      (user) => {
        if (!user) {
          return
        }

        this.wallet.loadWallets(user.uid)
      }
    )
  }

  public login() {
    return this.auth.auth.signInWithPopup(new firebase.auth!.GoogleAuthProvider)
  }

  public logout() {
    this.auth.auth.signOut()
  }
}
