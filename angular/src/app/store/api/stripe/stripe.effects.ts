import { Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';


@Injectable()
export class StripeEffects {

  constructor(private actions$: Actions) {}
}
