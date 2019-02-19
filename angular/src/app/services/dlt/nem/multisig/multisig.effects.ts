import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { MultisigActionTypes, LoadMultisigsSuccess, LoadMultisigsError, MultisigActions } from './multisig.actions';
import { map, mergeMap, catchError, first } from 'rxjs/operators';
import { of } from 'rxjs';
import { AccountHttp } from 'nem-library';
import { nodes } from '../../../../classes/nodes';
import { State } from '../../../../services/reducer';

@Injectable()
export class MultisigEffects {


  @Effect()
  loadMultisigs$ = this.actions$.pipe(
    ofType(MultisigActionTypes.LoadMultisigs),
    map(action => action.payload),
    mergeMap(
      (payload) => {
        return this.multisig$.pipe(
          first(),
          mergeMap(
            (state) => {
              if (state.lastAddress && state.lastAddress.equals(payload.address) && !payload.refresh) {
                return of(state.addresses)
              }
              const accountHttp = new AccountHttp(nodes)
              return accountHttp.getFromAddress(payload.address).pipe(
                map(data => data.cosignatoryOf.map(cosignatoryOf => cosignatoryOf.publicAccount!.address)),
              )
            }
          )
        )
      }
    ),
    map(addresses => new LoadMultisigsSuccess({ addresses: addresses })),
    catchError(error => of(new LoadMultisigsError({ error: error })))
  );

  public multisig$ = this.store.select(state => state.multisig)

  constructor(
    private actions$: Actions<MultisigActions>,
    private store: Store<State>
  ) { }

}
