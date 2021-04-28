import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportSubTypesComponent } from './report-sub-types.component';

describe('ReportSubTypesComponent', () => {
  let component: ReportSubTypesComponent;
  let fixture: ComponentFixture<ReportSubTypesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ReportSubTypesComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportSubTypesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
