import { TestBed, inject } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Observable } from 'rxjs';

import { WithdrawEffects } from './withdraw.effects';

describe('WithdrawEffects', () => {
  let actions$: Observable<any>;
  let effects: WithdrawEffects;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        WithdrawEffects,
        provideMockActions(() => actions$)
      ]
    });

    effects = TestBed.get(WithdrawEffects);
  });

  it('should be created', () => {
    expect(effects).toBeTruthy();
  });
});
