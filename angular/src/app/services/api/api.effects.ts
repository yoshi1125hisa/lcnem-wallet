import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';



import { ApiActionTypes } from './api.actions';

@Injectable()
export class ApiEffects {


  @Effect()
  loadApis$ = this.actions$.pipe(ofType(ApiActionTypes.LoadApis));


  constructor(private actions$: Actions) {}

}
