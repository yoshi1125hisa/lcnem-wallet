import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { MatDialog } from '@angular/material';

import { from } from 'rxjs';
import { map, filter, first, mergeMap, toArray } from 'rxjs/operators';
import { RxEntityStateStore, RxEntityState } from 'rx-state-store-js';
import { Wallet } from '../../../../../firebase/functions/src/models/wallet';
import { AlertDialogComponent } from '../../components/alert-dialog/alert-dialog.component';
import { AuthService } from '../../services/auth/auth.service';
import { UserService } from '../../services/user/user.service';
import { LanguageService } from '../../services/language/language.service';

@Injectable({
  providedIn: 'root'
})
export class WalletService extends RxEntityStateStore<State, Wallet> {
  get lang() { return this.language.state.twoLetter }

  constructor(
    private dialog: MatDialog,
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

  public clouds$ = this.state$.pipe(
    mergeMap(
      (state) => {
        return from(state.ids).pipe(
          map(id => state.entities[id].local),
          toArray(),
          map(array => array.filter(local => !local).length)
        )
      }
    )
  )

  public async checkWallet(refresh?: boolean) {
    if (this.clouds$ !== null) {
      const user = await this.auth.user$.pipe(
        filter(user => user != null),
        first()
      ).toPromise()

      this.user.loadUser(user!.uid, refresh)

      switch (await this.user.state$.pipe(
        filter(state => !state.loading),
        first(),
        map(state => state.user!.plan)
      ).toPromise()) {
        case undefined: {
          return this.dialog.open(
            AlertDialogComponent,
            {
              data: {
                title: this.translation.error[this.lang],
                content: this.translation.errorBody[this.lang]
              }
            }
          )
        }
        case "Standard": {
          return;
        }
      }
    } else {
      return;
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
        if(wallet.local) {
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

  public translation = {
    error: {
      en: "Error",
      ja: "エラー"
    } as any,
    errorBody: {
      en: "Because it is Free Plan now, only one cloud wallet can be created. If you wish to create multiple more cloud wallets, please change to the Standard plan from the setting screen.",
      ja: "現在Freeプランのため、クラウドウォレットを一つのみ作成可能です。クラウドウォレットを複数個作成希望の場合は、設定画面よりStandardプランにご変更ください。"
    } as any
  };

}

interface State extends RxEntityState<Wallet> {
  loading: boolean
  error?: Error
  ids: string[]
  entities: { [id: string]: Wallet }
  currentWalletId?: string
  lastUserId?: string
}
