import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';

import { Observable, from, combineLatest } from 'rxjs';
import { map, filter, first, mergeMap, toArray } from 'rxjs/operators';
import { RxEntityStateStore, RxEntityState } from 'rx-state-store-js';
import { Wallet } from '../../../../../firebase/functions/src/models/wallet';
import { UserService } from '../user/user.service';
import { LanguageService } from '../language/language.service';
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class WalletService extends RxEntityStateStore<State, Wallet> {
  get lang() { return this.language.state.twoLetter }

  public cloudCapacity$ = combineLatest(
    this.user.state$.pipe(
      filter(state => !state.loading),
    ),
    this.state$.pipe(
      map(state => state.ids.map(id => state.entities[id])),
      map(wallets => wallets.filter(wallet => !wallet.local).length)
    )
  ).pipe(
    map(([user, clouds]) => user.user!.plan !== undefined ? 1 : 1 - clouds)
  )

  constructor(
    private firestore: AngularFirestore,
    private language: LanguageService,
    private auth: AuthService,
    private user: UserService,
  ) {
    super(
      {
        loading: true,
        ids: [],
        entities: {}
      }
    )

    this.auth.user$.pipe(
      filter(user => !!user)
    ).subscribe(
      (user) => {
        this.loadWallets(user!.uid)
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
      return {}
    }
  }

  public loadWallets(userId: string, refresh?: boolean) {
    if (userId === this.state.lastUserId && !refresh) {
      return
    }
    this.streamLoadingState()

    this.firestore.collection("users").doc(userId).collection("wallets").get().subscribe(
      (collection) => {
        const localWallets = this.loadLocalWallets()
        const state: State = {
          loading: false,
          ids: collection.docs.map(doc => doc.id),
          entities: {},
          currentWalletId: localStorage.getItem("currentWallet") || undefined,
          lastUserId: userId
        }
        for (const doc of collection.docs) {
          state.entities[doc.id] = doc.data() as Wallet
          if (localWallets[doc.id]) {
            state.entities[doc.id].wallet = localWallets[doc.id]
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
    const localWallets = this.loadLocalWallets()
    localWallets[id] = wallet
    this.setLocalWallet(localWallets)
  }

  public addWallet(userId: string, wallet: Wallet) {
    if (userId !== this.state.lastUserId) {
      throw Error()
    }
    this.streamLoadingState()

    const _wallet = { ...wallet }
    if (_wallet.local) {
      delete _wallet.wallet
    }

    from(this.firestore.collection("users").doc(userId).collection("wallets").add(_wallet)).subscribe(
      (document) => {
        if (wallet.local) {
          this.addLocalWallet(document.id, wallet.wallet || "")
        }
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
    if (userId !== this.state.lastUserId) {
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
    if (userId !== this.state.lastUserId) {
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
      ...this.state,
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
