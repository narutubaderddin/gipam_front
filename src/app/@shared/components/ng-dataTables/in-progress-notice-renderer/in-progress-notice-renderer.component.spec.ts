import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InProgressNoticeRendererComponent } from './in-progress-notice-renderer.component';

describe('InProgressNoticeRendererComponent', () => {
  let component: InProgressNoticeRendererComponent;
  let fixture: ComponentFixture<InProgressNoticeRendererComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [InProgressNoticeRendererComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InProgressNoticeRendererComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
