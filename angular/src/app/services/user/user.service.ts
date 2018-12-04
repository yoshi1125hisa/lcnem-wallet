import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';

import * as firebase from 'firebase/app';
import 'firebase/auth';

import { User } from '../../../../../firebase/functions/src/models/user'
import { RxEffectiveStateStore } from '../../classes/rx-effective-state-store';
import { RxEffectiveState } from '../../classes/rx-effective-state';
import { from } from 'rxjs';

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
        loading: false,
        currentUser: auth.auth.currentUser || undefined
      }
    )
  }

  public login() {
    this.load()
    from(this.auth.auth.signInWithPopup(new firebase.auth!.GoogleAuthProvider)).subscribe(
      (user) => {
        const state: State = {
          ...this._state,
          loading: false,
          currentUser: user.user || undefined
        }

        this._subject$.next(state)
      },
      (error) => {
        this.error(error)
      }
    )
  }

  public logout() {
    this.load()
    from(this.auth.auth.signOut()).subscribe(
      () => {
        const state: State = {
          ...this._state,
          loading: false,
          currentUser: undefined
        }
      },
      (error) => {
        this.error(error)
      }
    )
  }

  public loadUser(userId: string, refresh?: boolean) {
    if(userId === this._state.lastUserId && !refresh) {
      return;
    }
    this.load()


    this.firestore.collection("users").doc(userId).get().subscribe(
      (document) => {
        const state: State = {
          loading: false,
          user: document.data() as User,
          lastUserId: userId
        }

        this._subject$.next(state)
      },
      (error) => {
        this.error(error)
      }
    )
  }
}

interface State extends RxEffectiveState {
  currentUser?: firebase.User
  user?: User
  lastUserId?: string
}
