import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { ApplicationActionTypes } from './application.actions';
import * as fromApplication from './application.reducer';
import { Store } from '@ngrx/store';

@Injectable()
export class ApplicationEffects {


  @Effect()
  loadApplications$ = this.actions$.pipe(
    ofType(ApplicationActionTypes.LoadApplications)
  );


  constructor(
    private actions$: Actions,
    private store: Store<fromApplication.State>
  ) {}

}
