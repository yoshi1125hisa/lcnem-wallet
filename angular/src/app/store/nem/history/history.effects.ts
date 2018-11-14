import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { mergeMap, map, catchError } from 'rxjs/operators';
import { AccountHttp } from 'nem-library';
import { nodes } from '../../../../app/models/nodes';
import { forkJoin, of, from } from 'rxjs';


@Injectable()
export class HistoryEffects {

  constructor(private actions$: Actions) { }

  @Effect() loadHistory$ = this.actions$.pipe(
    ofType('LOAD_HISTORY'),
    mergeMap(
      action => of(new AccountHttp(nodes)).pipe(
        mergeMap(
          accountHttp => forkJoin(
            accountHttp.unconfirmedTransactions(action.payload.address),
            accountHttp.allTransactions(action.payload.address)
          ).pipe(
            map(data => data[0].concat(data[1])),
            map(data => ({ type: 'LOAD_HISTORY_SUCCESS', payload: data })),
            catchError(() => of({ type: 'LOAD_HISTORY_FAILED' }))
          )
        )
      )
    )
  );
}
