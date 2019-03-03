import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { RateActionTypes, RateActions, LoadRatesSuccess, LoadRatesError } from './rate.actions';
import { map, mergeMap, catchError, concatMap, first, filter } from 'rxjs/operators';
import { AngularFirestore } from '@angular/fire/firestore';
import { of } from 'rxjs';
import { Rate } from '../../../../../firebase/functions/src/models/rate';
import { State } from '../reducer';
import { Tuple } from '../../classes/tuple';

@Injectable()
export class RateEffects {
  @Effect()
  loadRates$ = this.actions$.pipe(
    ofType(RateActionTypes.LoadRates),
    map(action => action.payload),
    concatMap(payload => this.rate$.pipe(
      first(),
      map(state => Tuple(payload, state))
    )),
    map(([payload, state]) => {
      const beforeNow = new Date();
      beforeNow.setHours(beforeNow.getHours() - 12);
      return Tuple(payload, state, beforeNow);
    }),
    filter(([payload, state, beforeNow]) => (!state.lastLoading || state.lastLoading > beforeNow) || payload.refresh!),
    concatMap(() => this.firestore.collection('rates').doc('rate').get().pipe(
      map(doc => doc.data() as Rate)
    )),
    map(rate => new LoadRatesSuccess({ rate: rate })),
    catchError(error => of(new LoadRatesError({ error: error })))
  );

  public rate$ = this.store.select(state => state.rate);

  constructor(
    private actions$: Actions<RateActions>,
    private store: Store<State>,
    private firestore: AngularFirestore
  ) { }

}
