import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';

import { User } from '../../../../../firebase/functions/src/models/user'
import { RxEffectiveStateStore } from '../../classes/rx-effective-state-store';
import { RxEffectiveState } from '../../classes/rx-effective-state';
import { Wallet } from '../../../../../firebase/functions/src/models/wallet';
import { SimpleWallet, Password } from 'nem-library';
import { first } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UserService extends RxEffectiveStateStore<State> {

  constructor(
    
    private firestore: AngularFirestore
  ) {
    super(
      {
        loading: false
      }
    )
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
  user?: User
  lastUserId?: string
}
