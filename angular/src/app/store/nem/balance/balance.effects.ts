import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { map, mergeMap, catchError } from 'rxjs/operators';
import { AccountHttp } from 'nem-library';
import { nodes } from '../../../../app/models/nodes';
import { of } from 'rxjs';


@Injectable()
export class BalanceEffects {

  constructor(private actions$: Actions) {}

  @Effect() loadBalances$ = this.actions$.pipe(
    ofType('LOAD_BALANCES'),
    mergeMap(
      action => (new AccountHttp(nodes)).getAssetsOwnedByAddress(action.payload.address).pipe(
        map(data => ({ type: 'LOAD_BALANCES_SUCCESS', payload: data })),
        catchError(() => of({ type: 'LOAD_BALANCES_FAILED' }))
      )
    )
  );
}
