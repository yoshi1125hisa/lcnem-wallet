import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { from, Subject, forkJoin } from 'rxjs';
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
        loading: true,
        ids: [],
        entities: {}
      }
    )
  }

  private setLocalWallet(localWallets: { [id: string]: string }) {
    localStorage.setItem("wallets", JSON.stringify(localWallets));
  }

  private loadLocalWallets() {
    const json = localStorage.getItem("wallets") || "";
    try {
      return JSON.parse(json) as { [id: string]: string };
    } catch {
      return {};
    }
  }

  public loadWallets(userId: string, refresh?: boolean) {
    if (userId === this._state.lastUserId && !refresh) {
      return
    }
    this.streamLoadingState()

    this.firestore.collection("users").doc(userId).collection("wallets").get().subscribe(
      (collection) => {
        const local = this.loadLocalWallets()
        const state: State = {
          loading: false,
          ids: collection.docs.map(doc => doc.id),
          entities: {}
        }
        for (const doc of collection.docs) {
          state.entities[doc.id] = doc.data() as Wallet
          if (local[doc.id]) {
            state.entities[doc.id].wallet = local[doc.id]
          }
        }

        this.streamState(state)
      },
      (error) => {
        this.streamErrorState(error)
      }
    )
  }

  public addLocalWallet(id: string, wallet: string) {
    const local = this.loadLocalWallets()
    local[id] = wallet
    this.setLocalWallet(local)
  }

  public addWallet(userId: string, wallet: Wallet) {
    if (userId !== this._state.lastUserId) {
      throw Error()
    }
    this.streamLoadingState()

    const _wallet = { ...wallet }
    const local = _wallet.local ? _wallet.wallet : null
    if (_wallet.local) {
      delete wallet.wallet
    }

    from(this.firestore.collection("users").doc(userId).collection("wallets").add(_wallet)).subscribe(
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
    
    const _wallet = { ...wallet }
    if (_wallet.local && _wallet.wallet) {
      this.addLocalWallet(walletId, _wallet.wallet)
      delete wallet.wallet
    }

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

  public setCurrentWallet(id?: string) {
    if (!id) {
      localStorage.removeItem("currentWallet")
    } else {
      localStorage.setItem("currentWallet", id)
    }
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
