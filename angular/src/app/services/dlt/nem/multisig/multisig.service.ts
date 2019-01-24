import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { Address, AccountHttp } from 'nem-library';
import { RxEffectiveStateStore } from 'rx-state-store-js';
import { nodes } from '../../../classes/nodes';

@Injectable({
  providedIn: 'root'
})
export class MultisigService extends RxEffectiveStateStore<State> {

  constructor() {
    super(
      {
        loading: false,
        addresses: []
      }
    )
  }

  public loadMultisig(address: Address, refresh?: boolean) {
    if(this.state.lastAddress && address.equals(this.state.lastAddress) && !refresh) {
      return;
    }
    this.streamLoadingState()

    const accountHttp = new AccountHttp(nodes);
    accountHttp.getFromAddress(address).pipe(
      map(
        data => data.cosignatoryOf.map(
          cosignatoryOf => cosignatoryOf.publicAccount!.address
        )
      ),
    ).subscribe(
      (addresses) => {
        const state: State = {
          ...this.state,
          loading: false,
          addresses: addresses,
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
  addresses: Address[]
  lastAddress?: Address
}
