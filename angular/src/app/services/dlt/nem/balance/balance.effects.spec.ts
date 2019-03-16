import { TestBed, inject } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Observable } from 'rxjs';

import { BalanceEffects } from './balance.effects';
/*
describe('BalanceEffects', () => {
  let actions$: Observable<any>;
  let effects: BalanceEffects;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        BalanceEffects,
        provideMockActions(() => actions$)
      ]
    });

    effects = TestBed.get(BalanceEffects);
  });

  it('should be created', () => {
    expect(effects).toBeTruthy();
  });
});
*/