import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { mergeMap, map, catchError } from 'rxjs/operators';
import { AccountHttp } from 'nem-library';
import { nodes } from '../../../../app/models/nodes';
import { of } from 'rxjs';


@Injectable()
export class MultisigEffects {

  constructor(private actions$: Actions) {}

  @Effect() loadMultisig$ = this.actions$.pipe(
    ofType('LOAD_MULTISIG'),
    mergeMap(
      action => (new AccountHttp(nodes)).getFromAddress(action.payload.address).pipe(
        map(
          data => data.cosignatoryOf.map(
            cosignatoryOf => cosignatoryOf.publicAccount!.address
          )
        ),
        map(data => ({ type: 'LOAD_MULTISIG_SUCCESS', payload: data })),
        catchError(() => of({ type: 'LOAD_BALANCES_FAILED' }))
      )
    )
  );
}
