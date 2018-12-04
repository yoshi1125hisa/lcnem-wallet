import { Injectable } from '@angular/core';
import { RxEntityStateStore } from 'src/app/classes/rx-entity-state-store';
import { RxEntityState } from 'src/app/classes/rx-entity-state';
import { of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LocalWalletService extends RxEntityStateStore<State, string> {
  constructor() {
    super(
      {
        loading: false,
        ids: [],
        entities: {}
      }
    )
  }


  private loadLocalStorage() {
    const json = localStorage.getItem("wallets") || "";
    try {
      return JSON.parse(json) as { [id: string]: string };
    } catch {
      return {};
    }
  }

  private setLocalStorage(localWallets: { [id: string]: string }) {
    localStorage.setItem("wallets", JSON.stringify(localWallets));
  }


  public loadLocalWallets() {
    this.load()

    of(this.loadLocalStorage()).subscribe(
      (localWallets) => {
        const state: State = {
          ...this._state,
          loading: false,
          ids: Object.keys(localWallets),
          entities: localWallets
        }

        this._subject$.next(state)
      },
      (error) => {
        this.error(error)
      }
    )
  }

  public addLocalWallet(id: string, wallet: string) {
    this.load()

    const state: State = {
      ...this.addEntity(id, wallet),
      loading: false
    }
    
    this.setLocalStorage(state.entities)

    this._subject$.next(state)
  }

  public deleteLocalWallet(id: string) {
    this.load()

    const state: State = {
      ...this.deleteEntity(id),
      loading: false
    }
    this.setLocalStorage(state.entities)

    this._subject$.next(state)
  }
}

interface State extends RxEntityState<string> {
}