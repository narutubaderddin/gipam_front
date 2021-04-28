import { TestBed } from '@angular/core/testing';

import { DenominationsService } from './denominations.service';

describe('DenominationsService', () => {
  let service: DenominationsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DenominationsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
