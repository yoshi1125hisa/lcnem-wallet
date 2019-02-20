import { TestBed, inject } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Observable } from 'rxjs';

import { ApplicationEffects } from './application.effects';

describe('ApplicationEffects', () => {
  let actions$: Observable<any>;
  let effects: ApplicationEffects;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ApplicationEffects,
        provideMockActions(() => actions$)
      ]
    });

    effects = TestBed.get(ApplicationEffects);
  });

  it('should be created', () => {
    expect(effects).toBeTruthy();
  });
});
