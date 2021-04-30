import { TestBed } from '@angular/core/testing';

import { MaterialTechniqueService } from './material-technique.service';

describe('MaterialTechniqueService', () => {
  let service: MaterialTechniqueService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MaterialTechniqueService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
