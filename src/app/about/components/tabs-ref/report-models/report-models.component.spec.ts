import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportModelsComponent } from './report-models.component';

describe('ResponsibleComponent', () => {
  let component: ReportModelsComponent;
  let fixture: ComponentFixture<ReportModelsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ReportModelsComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportModelsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
