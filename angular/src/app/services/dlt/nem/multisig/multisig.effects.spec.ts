import { TestBed, inject } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Observable } from 'rxjs';

import { MultisigEffects } from './multisig.effects';
/*
describe('MultisigEffects', () => {
  let actions$: Observable<any>;
  let effects: MultisigEffects;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        MultisigEffects,
        provideMockActions(() => actions$)
      ]
    });

    effects = TestBed.get(MultisigEffects);
  });

  it('should be created', () => {
    expect(effects).toBeTruthy();
  });
});
*/