import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActionReportTypesComponent } from './actionReportTypes.component';

describe('StylesComponent', () => {
  let component: ActionReportTypesComponent;
  let fixture: ComponentFixture<ActionReportTypesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ActionReportTypesComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ActionReportTypesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
