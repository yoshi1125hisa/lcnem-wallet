import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { map, mergeMap, catchError } from 'rxjs/operators';
import { HistoryActionTypes, HistoryActions, LoadHistoriesError, LoadHistoriesSuccess } from './history.actions';
import { AccountHttp } from 'nem-library';
import { nodes } from '../../../../classes/nodes';
import { forkJoin, of } from 'rxjs';
import { Store } from '@ngrx/store';
import * as fromNemHistory from './history.reducer';

@Injectable()
export class HistoryEffects {


  @Effect()
  loadHistorys$ = this.actions$.pipe(
    ofType(HistoryActionTypes.LoadHistories),
    map(action => action.payload),
    mergeMap(
      (payload) => {
        return this.store.pipe(
          mergeMap(
            (state) => {
              if (state.lastAddress && state.lastAddress.equals(payload.address) && !payload.refresh) {
                return of(state.transactions)
              }
              const accountHttp = new AccountHttp(nodes)
              return forkJoin(
                accountHttp.unconfirmedTransactions(payload.address),
                accountHttp.allTransactions(payload.address)
              ).pipe(
                map(([unconfirmed, all]) => unconfirmed.concat(all)),
              )
            }
          )
        )
      }
    ),
    map(transactions => new LoadHistoriesSuccess({ transactions: transactions })),
    catchError(error => of(new LoadHistoriesError({ error: error })))
  );


  constructor(
    private actions$: Actions<HistoryActions>,
    private store: Store<fromNemHistory.State>
  ) { }

}
