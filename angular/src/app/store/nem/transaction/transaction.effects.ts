import { Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';


@Injectable()
export class TransactionEffects {

  constructor(private actions$: Actions) {}
}
