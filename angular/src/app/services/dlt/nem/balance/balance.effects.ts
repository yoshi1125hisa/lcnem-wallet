import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { BalanceActionTypes, BalanceActions, LoadBalancesSuccess, LoadBalancesError } from './balance.actions';
import { map, mergeMap, catchError, first, concatMap, filter } from 'rxjs/operators';
import { nodes } from '../../../../classes/nodes';
import { AccountHttp } from 'nem-library';
import { of } from 'rxjs';
import { State } from '../../../../services/reducer';
import { Tuple } from '../../../../classes/tuple';

@Injectable()
export class BalanceEffects {


  @Effect()
  loadBalances$ = this.actions$.pipe(
    ofType(BalanceActionTypes.LoadBalances),
    map(action => action.payload),
    concatMap(payload => this.balance$.pipe(
      first(),
      map(state => Tuple(payload, state))
    )),
    filter(([payload, state]) => (!state.lastAddress || !state.lastAddress.equals(payload.address)) || payload.refresh === true),
    map(([payload]) => Tuple(payload, new AccountHttp(nodes))),
    concatMap(([payload, accountHttp]) => accountHttp.getAssetsOwnedByAddress(payload.address).pipe(
      map(assets => new LoadBalancesSuccess({ address: payload.address, assets: assets }))
    )),
    catchError(error => of(new LoadBalancesError({ error: error })))
  );

  public balance$ = this.store.select(state => state.balance)

  constructor(
    private actions$: Actions<BalanceActions>,
    private store: Store<State>
  ) { }

}
