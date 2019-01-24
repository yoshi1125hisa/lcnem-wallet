import { TestBed } from '@angular/core/testing';

import { AssetDefinitionService } from './asset-definition.service';

describe('AssetDefinitionService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AssetDefinitionService = TestBed.get(AssetDefinitionService);
    expect(service).toBeTruthy();
  });
});
