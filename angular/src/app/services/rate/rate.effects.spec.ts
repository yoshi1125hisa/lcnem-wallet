import { TestBed, inject } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Observable } from 'rxjs';

import { RateEffects } from './rate.effects';
/*
describe('RateEffects', () => {
  let actions$: Observable<any>;
  let effects: RateEffects;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        RateEffects,
        provideMockActions(() => actions$)
      ]
    });

    effects = TestBed.get(RateEffects);
  });

  it('should be created', () => {
    expect(effects).toBeTruthy();
  });
});
*/