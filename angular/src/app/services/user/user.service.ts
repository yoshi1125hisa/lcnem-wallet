import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';

import * as firebase from 'firebase/app';
import 'firebase/auth';

import { User } from '../../../../../firebase/functions/src/models/user'
import { RxEffectiveStateStore } from '../../classes/rx-effective-state-store';
import { RxEffectiveState } from '../../classes/rx-effective-state';
import { Wallet } from '../../../../../firebase/functions/src/models/wallet';
import { SimpleWallet, Password } from 'nem-library';

@Injectable({
  providedIn: 'root'
})
export class UserService extends RxEffectiveStateStore<State> {

  constructor(
    private auth: AngularFireAuth,
    private firestore: AngularFirestore
  ) {
    super(
      {
        loading: false
      }
    )

    this.auth.user.subscribe(
      (user) => {
        if (!user) {
          return
        }
        this.loadUser(user.uid)
      }
    )
  }

  public get user() { return this.auth.auth.currentUser }
  public user$ = this.auth.user

  public login() {
    return this.auth.auth.signInWithPopup(new firebase.auth!.GoogleAuthProvider)
  }

  public logout() {
    this.auth.auth.signOut()
  }

  public loadUser(userId: string, refresh?: boolean) {
    if (userId === this._state.lastUserId && !refresh) {
      return;
    }
    this.streamLoadingState()

    this.firestore.collection("users").doc(userId).get().subscribe(
      (document) => {
        const state: State = {
          loading: false,
          user: document.data() as User,
          lastUserId: userId
        }

        //レガシー
        if (state.user && (state.user as any).wallet) {
          const account = SimpleWallet.readFromWLT((state.user as any).wallet).open(new Password(userId))
          let wait = true;
          document.ref.collection("wallets").add(
            {
              name: "1",
              local: false,
              nem: account.address.plain(),
              wallet: (state.user as any).wallet
            } as Wallet
          ).then(() => { wait = false })
          while (wait) { }

          wait = true
          delete (state.user as any).wallet
          this.firestore.collection("users").doc(userId).update(state.user!).then(() => { wait = false })
          while (wait) { }
        }
        //レガシー

        this.streamState(state)
      },
      (error) => {
        this.streamErrorState(error)
      }
    )
  }
}

interface State extends RxEffectiveState {
  currentUser?: firebase.User
  user?: User
  lastUserId?: string
}
