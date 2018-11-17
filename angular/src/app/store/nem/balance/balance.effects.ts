import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { map, mergeMap, catchError } from 'rxjs/operators';
import { AccountHttp } from 'nem-library';
import { nodes } from '../../../../app/models/nodes';
import { of } from 'rxjs';
import {
  LoadBalances,
  BalanceActionTypes,
  LoadBalancesSuccess,
  LoadBalancesFailed
} from './balance.actions';


@Injectable()
export class BalanceEffects {

  constructor(private actions$: Actions) { }

  @Effect() loadBalances$ = this.actions$.pipe(
    ofType<LoadBalances>(BalanceActionTypes.LoadBalances),
    mergeMap(
      action => (new AccountHttp(nodes)).getAssetsOwnedByAddress(action.payload.address).pipe(
        map(data => new LoadBalancesSuccess()),
        catchError(() => of(new LoadBalancesFailed()))
      )
    )
  );
}
