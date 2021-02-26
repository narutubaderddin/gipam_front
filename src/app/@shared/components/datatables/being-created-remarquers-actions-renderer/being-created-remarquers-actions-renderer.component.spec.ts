import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BeingCreatedRemarquersActionsRendererComponent } from './being-created-remarquers-actions-renderer.component';

describe('BeingCreatedRemarquersActionsRendererComponent', () => {
  let component: BeingCreatedRemarquersActionsRendererComponent;
  let fixture: ComponentFixture<BeingCreatedRemarquersActionsRendererComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BeingCreatedRemarquersActionsRendererComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BeingCreatedRemarquersActionsRendererComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
