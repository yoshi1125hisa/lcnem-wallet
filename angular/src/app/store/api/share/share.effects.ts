import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { WebShareApi, ShareActionTypes, CopyToClipboard } from './share.actions';
import { map } from 'rxjs/operators';


@Injectable()
export class ShareEffects {

  constructor(private actions$: Actions) { }

  @Effect({ dispatch: false }) webShareApi$ = this.actions$.pipe(
    ofType<WebShareApi>(ShareActionTypes.WebShareApi),
    map(action => (navigator as any).share(action.payload))
  );

  @Effect({dispatch: false}) CopyToClipboard$ = this.actions$.pipe(
    ofType<CopyToClipboard>(ShareActionTypes.CopyToClipboard),
    map(
      action => {
        let selBox = document.createElement('textarea');
        selBox.style.position = 'fixed';
        selBox.style.left = '0';
        selBox.style.top = '0';
        selBox.style.opacity = '0';
        selBox.value = action.payload.text;
        document.body.appendChild(selBox);
        selBox.focus();
        selBox.select();
        document.execCommand('copy');
        document.body.removeChild(selBox);
      }
    )
  );
}
