import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { map, mergeMap, catchError, first } from 'rxjs/operators';
import { HistoryActionTypes, HistoryActions, LoadHistoriesError, LoadHistoriesSuccess } from './history.actions';
import { AccountHttp } from 'nem-library';
import { nodes } from '../../../../classes/nodes';
import { forkJoin, of } from 'rxjs';
import { State } from '../../../../services/reducer';

@Injectable()
export class HistoryEffects {


  @Effect()
  loadHistories$ = this.actions$.pipe(
    ofType(HistoryActionTypes.LoadHistories),
    map(action => action.payload),
    mergeMap(
      (payload) => {
        return this.history$.pipe(
          first(),
          mergeMap(
            (state) => {console.log(state)
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

  public history$ = this.store.select(state => state.history)

  constructor(
    private actions$: Actions<HistoryActions>,
    private store: Store<State>
  ) { }

}
