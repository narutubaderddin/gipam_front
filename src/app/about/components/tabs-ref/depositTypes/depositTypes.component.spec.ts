import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DepositTypesComponent } from './depositTypes.component';

describe('StylesComponent', () => {
  let component: DepositTypesComponent;
  let fixture: ComponentFixture<DepositTypesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DepositTypesComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DepositTypesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
