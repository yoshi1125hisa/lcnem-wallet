import { Action } from '@ngrx/store';
import { SignedTransaction, NemAnnounceResult } from 'nem-library';

export enum TransactionActionTypes {
  SendTransferTransaction = '[Transaction] Send Transfer Transaction',
  SendTransferTransactionSuccess = '[Transaction] Send Transfer Transaction Success',
  SendTransferTransactionFailed = '[Transaction] Send Transfer Transaction Failed'
}

export class LoadTransactions implements Action {
  readonly type = TransactionActionTypes.SendTransferTransaction;

  constructor(
    public payload: {
      signedTransaction: SignedTransaction
    }
  ) { }
}

export class LoadTransactionsSuccess implements Action {
  readonly type = TransactionActionTypes.SendTransferTransactionSuccess;

  constructor(
    public payload: {
      result: NemAnnounceResult
    }
  ) { }
}

export class LoadTransactionsFailed implements Action {
  readonly type = TransactionActionTypes.SendTransferTransactionFailed;

  constructor(
    error: Error
  ) { }
}

export type TransactionActions =
  LoadTransactions
  | LoadTransactionsSuccess
  | LoadTransactionsFailed
