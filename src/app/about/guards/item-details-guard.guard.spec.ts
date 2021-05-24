import { TestBed } from '@angular/core/testing';

import { ItemDetailsGuardGuard } from './item-details-guard.guard';

describe('ItemDetailsGuardGuard', () => {
  let guard: ItemDetailsGuardGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(ItemDetailsGuardGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
