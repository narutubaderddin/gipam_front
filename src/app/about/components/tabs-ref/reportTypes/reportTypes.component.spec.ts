import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportTypesComponent } from './reportTypes.component';

describe('StylesComponent', () => {
  let component: ReportTypesComponent;
  let fixture: ComponentFixture<ReportTypesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ReportTypesComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportTypesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
