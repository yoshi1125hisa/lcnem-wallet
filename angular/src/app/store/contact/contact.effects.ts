import { Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';


@Injectable()
export class ContactEffects {

  constructor(private actions$: Actions) {}
}
