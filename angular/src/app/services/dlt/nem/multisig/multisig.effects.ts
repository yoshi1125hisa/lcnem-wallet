import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';



import { MultisigActionTypes } from './multisig.actions';

@Injectable()
export class MultisigEffects {


  @Effect()
  loadMultisigs$ = this.actions$.pipe(ofType(MultisigActionTypes.LoadMultisigs));


  constructor(private actions$: Actions) {}

}
