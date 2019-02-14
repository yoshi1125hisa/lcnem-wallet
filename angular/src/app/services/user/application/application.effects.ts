import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';



import { ApplicationActionTypes } from './application.actions';

@Injectable()
export class ApplicationEffects {


  @Effect()
  loadApplications$ = this.actions$.pipe(ofType(ApplicationActionTypes.LoadApplications));


  constructor(private actions$: Actions) {}

}
