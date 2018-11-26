import { TestBed, inject } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Observable } from 'rxjs';

import { LocalWalletEffects } from './local-wallet.effects';

describe('LocalWalletEffects', () => {
  let actions$: Observable<any>;
  let effects: LocalWalletEffects;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        LocalWalletEffects,
        provideMockActions(() => actions$)
      ]
    });

    effects = TestBed.get(LocalWalletEffects);
  });

  it('should be created', () => {
    expect(effects).toBeTruthy();
  });
});
