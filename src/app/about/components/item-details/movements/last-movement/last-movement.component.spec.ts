import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LastMovementComponent } from './last-movement.component';

describe('LastMovementComponent', () => {
  let component: LastMovementComponent;
  let fixture: ComponentFixture<LastMovementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LastMovementComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LastMovementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
