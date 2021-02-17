import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExtraNoticeItemsBlocComponent } from './extra-notice-items-bloc.component';

describe('ExtraNoticeItemsBlocComponent', () => {
  let component: ExtraNoticeItemsBlocComponent;
  let fixture: ComponentFixture<ExtraNoticeItemsBlocComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ExtraNoticeItemsBlocComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExtraNoticeItemsBlocComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
