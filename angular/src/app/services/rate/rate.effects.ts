import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { RateActionTypes, RateActions, LoadRatesSuccess, LoadRatesError } from './rate.actions';
import { map, mergeMap, catchError } from 'rxjs/operators';
import { AngularFirestore } from '@angular/fire/firestore';
import { of } from 'rxjs';
import { Rate } from '../../../../../firebase/functions/src/models/rate';
import { Store } from '@ngrx/store';
import * as fromRate from './rate.reducer';

@Injectable()
export class RateEffects {
  @Effect()
  loadRates$ = this.actions$.pipe(
    ofType(RateActionTypes.LoadRates),
    map(action => action.payload),
    mergeMap(
      (payload) => {
        return this.rate$.pipe(
          mergeMap(
            (state) => {
              const beforeNow = new Date()
              beforeNow.setHours(beforeNow.getHours() - 12)
              if (state.lastLoading && state.lastLoading < beforeNow && !payload.refresh) {
                return of(state.rate)
              }
              return this.firestore.collection("rates").doc("rate").get().pipe(
                map(doc => doc.data() as Rate)
              )
            }
          )
        )
      }
    ),
    map(rate => new LoadRatesSuccess({ rate: rate })),
    catchError(error => of(new LoadRatesError({ error: error })))
  );

  constructor(
    private actions$: Actions<RateActions>,
    private rate$: Store<fromRate.State>,
    private firestore: AngularFirestore
  ) { }

}
