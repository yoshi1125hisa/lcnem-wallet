import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { mergeMap, map, catchError } from 'rxjs/operators';
import { AccountHttp } from 'nem-library';
import { nodes } from '../../../../app/models/nodes';
import { forkJoin, of } from 'rxjs';
import {
  HistoryActionTypes,
  LoadHistorys, LoadHistorysSuccess,
  LoadHistorysFailed
} from './history.actions';


@Injectable()
export class HistoryEffects {

  constructor(private actions$: Actions) { }

  @Effect() loadHistory$ = this.actions$.pipe(
    ofType<LoadHistorys>(HistoryActionTypes.LoadHistorys),
    mergeMap(
      action => of(new AccountHttp(nodes)).pipe(
        mergeMap(
          accountHttp => forkJoin(
            accountHttp.unconfirmedTransactions(action.payload.address),
            accountHttp.allTransactions(action.payload.address)
          ).pipe(
            map(data => data[0].concat(data[1])),
            map(data => new LoadHistorysSuccess({ transactions: data })),
            catchError(() => of(new LoadHistorysFailed()))
          )
        )
      )
    )
  );
}
