import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Back, RouterActionTypes, Navigate, NavigateSuccess, NavigateFailed } from './router.actions';
import { from, of } from 'rxjs';
import { mergeMap, map, catchError } from 'rxjs/operators';
import { Router } from '@angular/router';


@Injectable()
export class RouterEffects {

  constructor(
    private actions$: Actions,
    private router: Router
  ) { }

  @Effect() navigate$ = this.actions$.pipe(
    ofType<Navigate>(RouterActionTypes.Navigate),
    mergeMap(action =>
      from(this.router.navigate(action.payload.commands, action.payload.extras)).pipe(
        map(result => result ? new NavigateSuccess() : new NavigateFailed({ error: new Error() })),
        catchError(e => of(new NavigateFailed({ error: e })))
      )
    )
  );

  @Effect() back$ = this.actions$.pipe(
    ofType<Back>(RouterActionTypes.Back),
    mergeMap(action =>
      of(history.length).pipe(
        map(length => length > 1 ? history.back() : new Navigate(action.payload))
      )
    )
  )
}
