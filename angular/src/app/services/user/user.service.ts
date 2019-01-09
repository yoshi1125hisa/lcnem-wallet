import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { SimpleWallet, Password } from 'nem-library';
import { RxEffectiveStateStore, RxEffectiveState } from 'rx-state-store-js';
import { User } from '../../../../../firebase/functions/src/models/user'
import { Wallet } from '../../../../../firebase/functions/src/models/wallet';
import { from } from 'rxjs';

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
        const migration = async () => {
          if (state.user && (state.user as any).wallet) {
            const account = SimpleWallet.readFromWLT((state.user as any).wallet).open(new Password(userId))

            await document.ref.collection("wallets").add(
              {
                name: "1",
                local: false,
                nem: account.address.plain(),
                wallet: (state.user as any).wallet
              } as Wallet
            )
            delete (state.user as any).wallet
            
            await this.firestore.collection("users").doc(userId).set(state.user!)
          }
        }
        migration()
        //レガシー

        this.streamState(state)
      },
      (error) => {
        this.streamErrorState(error)
      }
    )
  }

  public updateUser(userId: string, user: User) {
    if(userId !== this._state.lastUserId) {
      throw Error()
    }
    this.streamLoadingState()

    from(this.firestore.collection("users").doc(userId).set(user)).subscribe(
      () => {
        const state: State = {
          user,
          loading: false
        }

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
