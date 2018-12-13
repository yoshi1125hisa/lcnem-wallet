import { Injectable } from '@angular/core';
import { Asset, Address, AccountHttp } from 'nem-library';
import { RxEffectiveStateStore } from 'rx-state-store-js';
import { nodes } from '../../../classes/nodes';

@Injectable({
  providedIn: 'root'
})
export class BalanceService extends RxEffectiveStateStore<State> {

  constructor() {
    super(
      {
        loading: false,
        assets: []
      }
    )
  }

  public loadBalance(address: Address, refresh?: boolean) {
    if(this._state.lastAddress && address.equals(this._state.lastAddress) && !refresh) {
      return;
    }
    this.streamLoadingState()

    const accountHttp = new AccountHttp(nodes);
    accountHttp.getAssetsOwnedByAddress(address).subscribe(
      (assets) => {
        const state = {
          ...this._state,
          loading: false,
          assets: assets,
          lastAddress: address
        }
        
        this.streamState(state)
      },
      (error) => {
        this.streamErrorState(error)
      }
    )
  }
}

interface State {
  loading: boolean
  error?: Error
  assets: Asset[]
  lastAddress?: Address
}