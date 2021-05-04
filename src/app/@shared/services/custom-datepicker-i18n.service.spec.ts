import { TestBed } from '@angular/core/testing';

import { CustomDatepickerI18nService } from './custom-datepicker-i18n.service';

describe('CustomDatepickerI18nService', () => {
  let service: CustomDatepickerI18nService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CustomDatepickerI18nService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
