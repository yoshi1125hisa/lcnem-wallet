import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { map, mergeMap, catchError, first, concatMap, filter } from 'rxjs/operators';
import { HistoryActionTypes, HistoryActions, LoadHistoriesError, LoadHistoriesSuccess } from './history.actions';
import { AccountHttp } from 'nem-library';
import { nodes } from '../../../../classes/nodes';
import { forkJoin, of } from 'rxjs';
import { State } from '../../../../services/reducer';
import { Tuple } from '../../../../classes/tuple';

@Injectable()
export class HistoryEffects {


  @Effect()
  loadHistories$ = this.actions$.pipe(
    ofType(HistoryActionTypes.LoadHistories),
    map(action => action.payload),
    concatMap(payload => this.history$.pipe(
      map(state => Tuple(payload, state))
    )),
    filter(([payload, state]) => (!state.lastAddress || !state.lastAddress.equals(payload.address)) || payload.refresh === true),
    map(([payload]) => Tuple(payload, new AccountHttp(nodes))),
    concatMap(([payload, accountHttp]) => forkJoin(
      accountHttp.unconfirmedTransactions(payload.address),
      accountHttp.allTransactions(payload.address)
    ).pipe(
      map(([unconfirmed, all]) => unconfirmed.concat(all)),
      map(transactions => new LoadHistoriesSuccess({ address: payload.address, transactions: transactions }))
    )),
    catchError(error => of(new LoadHistoriesError({ error: error })))
  );

  public history$ = this.store.select(state => state.history)

  constructor(
    private actions$: Actions<HistoryActions>,
    private store: Store<State>
  ) { }

}
