import { TestBed, inject } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Observable } from 'rxjs';

import { ApiEffects } from './api.effects';

describe('ApiEffects', () => {
  let actions$: Observable<any>;
  let effects: ApiEffects;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ApiEffects,
        provideMockActions(() => actions$)
      ]
    });

    effects = TestBed.get(ApiEffects);
  });

  it('should be created', () => {
    expect(effects).toBeTruthy();
  });
});
