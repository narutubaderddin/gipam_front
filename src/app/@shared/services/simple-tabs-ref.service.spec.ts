import { TestBed } from '@angular/core/testing';

import { SimpleTabsRefService } from './simple-tabs-ref.service';

describe('SimpleTabsRefService', () => {
  let service: SimpleTabsRefService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SimpleTabsRefService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
