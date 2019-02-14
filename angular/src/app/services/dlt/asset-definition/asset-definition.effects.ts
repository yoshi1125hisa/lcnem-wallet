import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';



import { AssetDefinitionActionTypes } from './asset-definition.actions';

@Injectable()
export class AssetDefinitionEffects {


  @Effect()
  loadAssetDefinitions$ = this.actions$.pipe(ofType(AssetDefinitionActionTypes.LoadAssetDefinitions));


  constructor(private actions$: Actions) {}

}
