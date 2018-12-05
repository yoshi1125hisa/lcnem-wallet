import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { from } from 'rxjs';
import { RxEntityStateStore } from '../../classes/rx-entity-state-store';
import { Wallet } from '../../../../../firebase/functions/src/models/wallet';
import { RxEntityState } from '../../classes/rx-entity-state';

@Injectable({
  providedIn: 'root'
})
export class WalletService extends RxEntityStateStore<State, Wallet> {

  constructor(
    private firestore: AngularFirestore
  ) {
    super(
      {
        loading: false,
        ids: [],
        entities: {}
      }
    )
  }

  public loadWallets(userId: string, refresh?: boolean) {
    if (userId === this._state.lastUserId && !refresh) {
      return
    }
    this.streamLoadingState()

    this.firestore.collection("users").doc(userId).collection("wallets").get().subscribe(
      (collection) => {
        const state: State = {
          loading: false,
          ids: collection.docs.map(doc => doc.id),
          entities: {},
          currentWalletId: userId
        }
        for (const doc of collection.docs) {
          state.entities[doc.id] = doc.data() as Wallet
        }

        this.streamState(state)
      },
      (error) => {
        this.streamErrorState(error)
      }
    )
  }

  public addWallet(userId: string, wallet: Wallet) {
    if (userId !== this._state.lastUserId) {
      throw Error()
    }
    this.streamLoadingState()
    from(this.firestore.collection("users").doc(userId).collection("wallets").add(wallet)).subscribe(
      (document) => {
        const state: State = {
          ...this.getEntityAddedState(document.id, wallet),
          loading: false
        }

        this.streamState(state)
      },
      (error) => {
        this.streamErrorState(error)
      }
    )
  }

  public updateWallet(userId: string, walletId: string, wallet: Wallet) {
    if (userId !== this._state.lastUserId) {
      throw Error()
    }
    this.streamLoadingState()
    from(this.firestore.collection("users").doc(userId).collection("wallets").doc(walletId).set(wallet)).subscribe(
      () => {
        const state: State = {
          ...this.getEntityUpdatedState(walletId, wallet),
          loading: false
        }

        this.streamState(state)
      },
      (error) => {
        this.streamErrorState(error)
      }
    )
  }

  public deleteWallet(userId: string, walletId: string) {
    if (userId !== this._state.lastUserId) {
      throw Error()
    }
    this.streamLoadingState()

    from(this.firestore.collection("users").doc(userId).collection("wallets").doc(walletId).delete()).subscribe(
      () => {
        const state: State = {
          ...this.getEntityDeletedState(walletId),
          loading: false
        }

        this.streamState(state)
      },
      (error) => {
        this.streamErrorState(error)
      }
    )
  }

  public setCurrentWallet(id: string) {
    const state: State = {
      ...this._state,
      currentWalletId: id
    }

    this.streamState(state)
  }
}

interface State extends RxEntityState<Wallet> {
  loading: boolean
  error?: Error
  ids: string[]
  entities: { [id: string]: Wallet }
  currentWalletId?: string
  lastUserId?: string
}
