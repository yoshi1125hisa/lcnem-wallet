import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { map, mergeMap, catchError } from 'rxjs/operators';
import { HistoryActionTypes, HistoryActions, LoadHistoriesError, LoadHistoriesSuccess } from './history.actions';
import { AccountHttp } from 'nem-library';
import { nodes } from '../../../../classes/nodes';
import { forkJoin, of } from 'rxjs';

@Injectable()
export class HistoryEffects {


  @Effect()
  loadHistorys$ = this.actions$.pipe(
    ofType(HistoryActionTypes.LoadHistories),
    map(action => action.payload),
    mergeMap(
      (payload) => {
        const accountHttp = new AccountHttp(nodes)
        return forkJoin(
          accountHttp.unconfirmedTransactions(payload.address),
          accountHttp.allTransactions(payload.address)
        ).pipe(
          map(([unconfirmed, all]) => unconfirmed.concat(all)),
        )
      }
    ),
    map(transactions => new LoadHistoriesSuccess({ transactions: transactions })),
    catchError(error => of(new LoadHistoriesError({ error: error })))
  );


  constructor(private actions$: Actions<HistoryActions>) { }

}
