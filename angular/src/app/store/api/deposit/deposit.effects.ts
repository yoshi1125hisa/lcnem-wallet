import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { mergeMap, catchError, map } from 'rxjs/operators';
import { of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import {
  DepositActionTypes,
  SendDepositRequest,
  SendDepositRequestSuccess,
  SendDepositRequestFailed
} from './deposit.actions';


@Injectable()
export class DepositEffects {

  constructor(
    private actions$: Actions,
    private http: HttpClient
  ) {}

  @Effect() loadTransaction$ = this.actions$.pipe(
    ofType<SendDepositRequest>(DepositActionTypes.SendDepositRequest),
    mergeMap(
      (action) => {
        return this.http.post("/api/deposit", action.payload).pipe(
          map(
            () => {
              return new SendDepositRequestSuccess();
            }
          ),
          catchError(
            (e) => {
              return of(new SendDepositRequestFailed(e));
            }
          )
        )
      }
    )
  )
}
