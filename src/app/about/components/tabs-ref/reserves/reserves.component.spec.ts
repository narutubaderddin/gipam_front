import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReservesComponent } from './reserves.component';

describe('StylesComponent', () => {
  let component: ReservesComponent;
  let fixture: ComponentFixture<ReservesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ReservesComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReservesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
