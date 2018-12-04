import { Injectable } from '@angular/core';
import { Address, AccountHttp } from 'nem-library';
import { RxEffectiveStateStore } from '../../../classes/rx-effective-state-store';
import { nodes } from '../../../classes/nodes';
import { map } from 'rxjs/operators';

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
    if(this._state.lastAddress && address.equals(this._state.lastAddress) && !refresh) {
      return;
    }
    this.load()

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
          loading: false,
          addresses: addresses,
          lastAddress: address
        }

        this._subject$.next(state)
      },
      (error) => {
        this.error(error)
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
