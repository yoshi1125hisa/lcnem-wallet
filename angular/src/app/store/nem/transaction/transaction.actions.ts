import { Action } from '@ngrx/store';
import { Update } from '@ngrx/entity';

export enum TransactionActionTypes {
  SendTransferTransaction = '[Transaction] Send Transfer Transaction'
}

export class LoadTransactions implements Action {
  readonly type = TransactionActionTypes.SendTransferTransaction;

  constructor(
    public payload: {

    }
  ) { }
}

export type TransactionActions =
  LoadTransactions;