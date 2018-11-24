import { TestBed, inject } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Observable } from 'rxjs';

import { ShareEffects } from './share.effects';

describe('ShareEffects', () => {
  let actions$: Observable<any>;
  let effects: ShareEffects;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ShareEffects,
        provideMockActions(() => actions$)
      ]
    });

    effects = TestBed.get(ShareEffects);
  });

  it('should be created', () => {
    expect(effects).toBeTruthy();
  });
});
