import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { mergeMap, map, catchError } from 'rxjs/operators';
import { AccountHttp } from 'nem-library';
import { nodes } from '../../../../app/models/nodes';
import { of } from 'rxjs';
import {
  MultisigActionTypes,
  LoadMultisigsSuccess,
  LoadMultisigs,
  LoadMultisigsFailed
} from './multisig.actions';


@Injectable()
export class MultisigEffects {

  constructor(private actions$: Actions) { }

  @Effect() loadMultisig$ = this.actions$.pipe(
    ofType<LoadMultisigs>(MultisigActionTypes.LoadMultisigs),
    mergeMap(
      action => (new AccountHttp(nodes)).getFromAddress(action.payload.address).pipe(
        map(
          data => data.cosignatoryOf.map(
            cosignatoryOf => cosignatoryOf.publicAccount!.address
          )
        ),
        map(data => (new LoadMultisigsSuccess())),
        catchError(() => of(new LoadMultisigsFailed()))
      )
    )
  );
}
