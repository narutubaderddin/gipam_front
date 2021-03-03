import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InProgressAlertsComponent } from './in-progress-alerts.component';

describe('InProgressAlertsComponent', () => {
  let component: InProgressAlertsComponent;
  let fixture: ComponentFixture<InProgressAlertsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [InProgressAlertsComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InProgressAlertsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
