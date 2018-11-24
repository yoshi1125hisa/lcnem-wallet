import { TestBed, inject } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Observable } from 'rxjs';

import { StripeEffects } from './stripe.effects';

describe('StripeEffects', () => {
  let actions$: Observable<any>;
  let effects: StripeEffects;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        StripeEffects,
        provideMockActions(() => actions$)
      ]
    });

    effects = TestBed.get(StripeEffects);
  });

  it('should be created', () => {
    expect(effects).toBeTruthy();
  });
});
