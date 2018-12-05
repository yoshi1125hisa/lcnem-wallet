import { Injectable } from '@angular/core';
import { RxEntityStateStore } from '../../classes/rx-entity-state-store';
import { RxEntityState } from '../../classes/rx-entity-state';
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
    this.streamLoadingState()

    of(this.loadLocalStorage()).subscribe(
      (localWallets) => {
        const state: State = {
          ...this._state,
          loading: false,
          ids: Object.keys(localWallets),
          entities: localWallets
        }

        this.streamState(state)
      },
      (error) => {
        this.streamErrorState(error)
      }
    )
  }

  public addLocalWallet(id: string, wallet: string) {
    this.streamLoadingState()

    const state: State = {
      ...this.getEntityAddedState(id, wallet),
      loading: false
    }
    
    this.setLocalStorage(state.entities)

    this.streamState(state)
  }

  public deleteLocalWallet(id: string) {
    this.streamLoadingState()

    const state: State = {
      ...this.getEntityDeletedState(id),
      loading: false
    }
    this.setLocalStorage(state.entities)

    this.streamState(state)
  }
}

interface State extends RxEntityState<string> {
}