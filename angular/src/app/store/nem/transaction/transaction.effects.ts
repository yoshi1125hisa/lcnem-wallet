import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import {
  TransactionActionTypes,
  SendTransferTransaction,
  SendTransferTransactionsFailed,
  SendTransferTransactionsSuccess
} from './transaction.actions';
import { mergeMap, catchError, map } from 'rxjs/operators';
import { TransactionHttp } from 'nem-library';
import { nodes } from '../../../models/nodes';
import { of } from 'rxjs';


@Injectable()
export class TransactionEffects {

  constructor(private actions$: Actions) { }

  @Effect() loadTransaction$ = this.actions$.pipe(
    ofType<SendTransferTransaction>(TransactionActionTypes.SendTransferTransaction),
    mergeMap(
      action => (new TransactionHttp(nodes)).announceTransaction(action.payload.signedTransaction).pipe(
        map(data => new SendTransferTransactionsSuccess({ result: data })),
        catchError(e => of(new SendTransferTransactionsFailed(e)))
      )
    )
  )
}
