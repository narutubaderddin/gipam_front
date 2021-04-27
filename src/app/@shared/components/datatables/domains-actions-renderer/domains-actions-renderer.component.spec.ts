import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DomainsActionsRendererComponent } from './domains-actions-renderer.component';

describe('DomainsActionsRendererComponent', () => {
  let component: DomainsActionsRendererComponent;
  let fixture: ComponentFixture<DomainsActionsRendererComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DomainsActionsRendererComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DomainsActionsRendererComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
