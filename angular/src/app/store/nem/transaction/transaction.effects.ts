import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { LoadTransactions, TransactionActionTypes, LoadTransactionsSuccess } from './transaction.actions';
import { mergeMap, catchError, map } from 'rxjs/operators';
import { TransactionHttp, NemAnnounceResult } from 'nem-library';
import { nodes } from 'src/app/models/nodes';
import { of } from 'rxjs';
import { LoadBalancesFailed } from '../balance/balance.actions';


@Injectable()
export class TransactionEffects {

  constructor(private actions$: Actions) { }

  @Effect() loadTransaction$ = this.actions$.pipe(
    ofType<LoadTransactions>(TransactionActionTypes.SendTransferTransaction),
    mergeMap(
      action => (new TransactionHttp(nodes)).announceTransaction(action.payload.signedTransaction).pipe(
        map(data => new LoadTransactionsSuccess({ result: data })),
        catchError(e => of(new LoadBalancesFailed(e)))
      )
    )
  )
}
