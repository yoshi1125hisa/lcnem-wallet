import { TestBed, inject } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Observable } from 'rxjs';

import { WalletEffects } from './wallet.effects';

describe('WalletEffects', () => {
  let actions$: Observable<any>;
  let effects: WalletEffects;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        WalletEffects,
        provideMockActions(() => actions$)
      ]
    });

    effects = TestBed.get(WalletEffects);
  });

  it('should be created', () => {
    expect(effects).toBeTruthy();
  });
});
