import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { ContactActionTypes } from './contact.actions';
import * as fromContact from './contact.reducer';
import { Store } from '@ngrx/store';

@Injectable()
export class ContactEffects {


  @Effect()
  loadContacts$ = this.actions$.pipe(
    ofType(ContactActionTypes.LoadContacts)
  );


  constructor(
    private actions$: Actions,
    private store: Store<fromContact.State>
  ) {}

}
