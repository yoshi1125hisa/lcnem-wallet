import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';

import { BalanceActionTypes, BalanceActions, LoadBalancesSuccess, LoadBalancesError } from './balance.actions';
import { map, mergeMap, catchError, first } from 'rxjs/operators';
import { nodes } from '../../../../classes/nodes';
import { AccountHttp } from 'nem-library';
import { of } from 'rxjs';
import * as fromNemBalance from './balance.reducer';
import { Store } from '@ngrx/store';

@Injectable()
export class BalanceEffects {


  @Effect()
  loadBalances$ = this.actions$.pipe(
    ofType(BalanceActionTypes.LoadBalances),
    map(action => action.payload),
    mergeMap(
      (payload) => {
        return this.store.pipe(
          first(),
          mergeMap(
            (state) => {
              if (state.lastAddress && state.lastAddress.equals(payload.address) && !payload.refresh) {
                return of(state.assets)
              }
              const accountHttp = new AccountHttp(nodes)
              return accountHttp.getAssetsOwnedByAddress(payload.address)
            }
          )
        )

      }
    ),
    map(assets => new LoadBalancesSuccess({ assets: assets })),
    catchError(error => of(new LoadBalancesError({ error: error })))
  );


  constructor(
    private actions$: Actions<BalanceActions>,
    private store: Store<fromNemBalance.State>
  ) { }

}
