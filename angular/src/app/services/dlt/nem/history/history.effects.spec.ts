import { TestBed, inject } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Observable } from 'rxjs';

import { HistoryEffects } from './history.effects';
/*
describe('HistoryEffects', () => {
  let actions$: Observable<any>;
  let effects: HistoryEffects;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        HistoryEffects,
        provideMockActions(() => actions$)
      ]
    });

    effects = TestBed.get(HistoryEffects);
  });

  it('should be created', () => {
    expect(effects).toBeTruthy();
  });
});
*/