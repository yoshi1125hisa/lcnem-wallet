import { TestBed, inject } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Observable } from 'rxjs';

import { DepositEffects } from './deposit.effects';

describe('DepositEffects', () => {
  let actions$: Observable<any>;
  let effects: DepositEffects;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        DepositEffects,
        provideMockActions(() => actions$)
      ]
    });

    effects = TestBed.get(DepositEffects);
  });

  it('should be created', () => {
    expect(effects).toBeTruthy();
  });
});
