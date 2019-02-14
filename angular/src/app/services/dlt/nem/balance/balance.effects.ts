import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';



import { BalanceActionTypes } from './balance.actions';

@Injectable()
export class BalanceEffects {


  @Effect()
  loadBalances$ = this.actions$.pipe(ofType(BalanceActionTypes.LoadBalances));


  constructor(private actions$: Actions) {}

}
