import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DenominationsActionsRendererComponent } from './denominations-actions-renderer.component';

describe('DenominationsActionsRendererComponent', () => {
  let component: DenominationsActionsRendererComponent;
  let fixture: ComponentFixture<DenominationsActionsRendererComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DenominationsActionsRendererComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DenominationsActionsRendererComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
