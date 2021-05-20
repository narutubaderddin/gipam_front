import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreationDateNoticeRendererComponent } from './creation-date-notice-renderer.component';

describe('CreationDateNoticeRendererComponent', () => {
  let component: CreationDateNoticeRendererComponent;
  let fixture: ComponentFixture<CreationDateNoticeRendererComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CreationDateNoticeRendererComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreationDateNoticeRendererComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
