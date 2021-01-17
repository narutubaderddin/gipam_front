import { TestBed } from '@angular/core/testing';

import { WorkOfArtService } from './work-of-art.service';

describe('WorkOfArtService', () => {
  let service: WorkOfArtService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WorkOfArtService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
