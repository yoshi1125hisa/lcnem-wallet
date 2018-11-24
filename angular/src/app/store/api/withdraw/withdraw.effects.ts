import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { HttpClient } from '@angular/common/http';
import { 
  WithdrawRequestActionTypes,
  SendWithdrawRequest,
  SendWithdrawRequestSuccess,
  SendWithdrawRequestFailed,
} from './withdraw.actions'
import { mergeMap, catchError, map, merge } from 'rxjs/operators';
import { of, from } from 'rxjs';


@Injectable()
export class WithdrawEffects {

  constructor(
    private actions$: Actions,
    private http: HttpClient
  ) {}
   @Effect() loadTransaction$ = this.actions$.pipe(
    ofType<SendWithdrawRequest>(WithdrawRequestActionTypes.SendWithdrawRequest),
    mergeMap(
      action => (this.http.post("/api/Withdraw", action.payload).pipe(
        map(() => new SendWithdrawRequestSuccess({ })),
        catchError(e => of(new SendWithdrawRequestFailed(e)))
        )
      )
    )
  )
}

