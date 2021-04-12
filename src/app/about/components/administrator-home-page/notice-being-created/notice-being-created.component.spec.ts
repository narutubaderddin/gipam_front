import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NoticeBeingCreatedComponent } from './notice-being-created.component';

describe('NoticeBeingCreatedComponent', () => {
  let component: NoticeBeingCreatedComponent;
  let fixture: ComponentFixture<NoticeBeingCreatedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NoticeBeingCreatedComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NoticeBeingCreatedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
