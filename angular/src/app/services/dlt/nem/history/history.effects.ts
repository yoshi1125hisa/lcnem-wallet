import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';



import { HistoryActionTypes } from './history.actions';

@Injectable()
export class HistoryEffects {


  @Effect()
  loadHistorys$ = this.actions$.pipe(ofType(HistoryActionTypes.LoadHistorys));


  constructor(private actions$: Actions) {}

}
