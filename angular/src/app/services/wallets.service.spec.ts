import { TestBed } from '@angular/core/testing';

import { WalletsService } from './wallets.service';

describe('WalletsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: WalletsService = TestBed.get(WalletsService);
    expect(service).toBeTruthy();
  });
});
