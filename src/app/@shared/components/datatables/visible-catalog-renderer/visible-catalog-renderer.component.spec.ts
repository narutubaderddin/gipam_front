import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VisibleCatalogRendererComponent } from './visible-catalog-renderer.component';

describe('VisibleCatalogRendererComponent', () => {
  let component: VisibleCatalogRendererComponent;
  let fixture: ComponentFixture<VisibleCatalogRendererComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [VisibleCatalogRendererComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VisibleCatalogRendererComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
