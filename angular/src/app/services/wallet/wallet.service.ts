import { Injectable } from '@angular/core';
import { RxEntityStateService } from 'src/app/classes/rx-entity-state-service';
import { Wallet } from '../../../../../firebase/functions/src/models/wallet';
import { AngularFirestore } from '@angular/fire/firestore';
import { from } from 'rxjs';
import { RxEntityState } from 'src/app/classes/rx-entity-state';

@Injectable({
  providedIn: 'root'
})
export class WalletService extends RxEntityStateService<State, Wallet> {

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
    this.load()

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

        this._subject$.next(state)
      },
      (error) => {
        this.error(error)
      }
    )
  }

  public addWallet(userId: string, wallet: Wallet) {
    if (userId !== this._state.lastUserId) {
      throw Error()
    }
    this.load()
    from(this.firestore.collection("users").doc(userId).collection("wallets").add(wallet)).subscribe(
      (document) => {
        const state: State = {
          ...this.addEntity(document.id, wallet),
          loading: false
        }

        this._subject$.next(state)
      },
      (error) => {
        this.error(error)
      }
    )
  }

  public updateWallet(userId: string, walletId: string, wallet: Wallet) {
    if (userId !== this._state.lastUserId) {
      throw Error()
    }
    this.load()
    from(this.firestore.collection("users").doc(userId).collection("wallets").doc(walletId).set(wallet)).subscribe(
      () => {
        const state: State = {
          ...this.updateEntity(walletId, wallet),
          loading: false
        }

        this._subject$.next(state)
      },
      (error) => {
        this.error(error)
      }
    )
  }

  public deleteWallet(userId: string, walletId: string) {
    if (userId !== this._state.lastUserId) {
      throw Error()
    }
    this.load()

    from(this.firestore.collection("users").doc(userId).collection("wallets").doc(walletId).delete()).subscribe(
      () => {
        const state: State = {
          ...this.deleteEntity(walletId),
          loading: false
        }


        this._subject$.next(state)
      },
      (error) => {
        this.error(error)
      }
    )
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
