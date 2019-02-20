import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { MultisigActionTypes, LoadMultisigsSuccess, LoadMultisigsError, MultisigActions } from './multisig.actions';
import { map, mergeMap, catchError, first, concatMap, filter } from 'rxjs/operators';
import { of } from 'rxjs';
import { AccountHttp } from 'nem-library';
import { nodes } from '../../../../classes/nodes';
import { State } from '../../../../services/reducer';
import { Tuple } from '../../../../classes/tuple';

@Injectable()
export class MultisigEffects {


  @Effect()
  loadMultisigs$ = this.actions$.pipe(
    ofType(MultisigActionTypes.LoadMultisigs),
    map(action => action.payload),
    concatMap(payload => this.multisig$.pipe(
      first(),
      map(state => Tuple(payload, state))
    )),
    filter(([payload, state]) => (!state.lastAddress || !state.lastAddress.equals(payload.address)) || payload.refresh === true),
    map(([payload]) => Tuple(payload, new AccountHttp(nodes))),
    concatMap(([payload, accountHttp]) => accountHttp.getFromAddress(payload.address).pipe(
      map(data => data.cosignatoryOf.map(cosignatoryOf => cosignatoryOf.publicAccount!.address)),
      map(addresses => new LoadMultisigsSuccess({ address: payload.address, addresses: addresses }))
    )),
    catchError(error => of(new LoadMultisigsError({ error: error })))
  );

  public multisig$ = this.store.select(state => state.multisig)

  constructor(
    private actions$: Actions<MultisigActions>,
    private store: Store<State>
  ) { }

}
