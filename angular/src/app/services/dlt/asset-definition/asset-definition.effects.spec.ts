import { TestBed, inject } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Observable } from 'rxjs';

import { AssetDefinitionEffects } from './asset-definition.effects';
/*
describe('AssetDefinitionEffects', () => {
  let actions$: Observable<any>;
  let effects: AssetDefinitionEffects;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        AssetDefinitionEffects,
        provideMockActions(() => actions$)
      ]
    });

    effects = TestBed.get(AssetDefinitionEffects);
  });

  it('should be created', () => {
    expect(effects).toBeTruthy();
  });
});
*/