import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalReportSubTypesComponent } from './modal-report-sub-types.component';

describe('ModalReportSubTypesComponent', () => {
  let component: ModalReportSubTypesComponent;
  let fixture: ComponentFixture<ModalReportSubTypesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ModalReportSubTypesComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalReportSubTypesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
