import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';



import { RateActionTypes } from './rate.actions';

@Injectable()
export class RateEffects {


  @Effect()
  loadRates$ = this.actions$.pipe(ofType(RateActionTypes.LoadRates));


  constructor(private actions$: Actions) {}

}
