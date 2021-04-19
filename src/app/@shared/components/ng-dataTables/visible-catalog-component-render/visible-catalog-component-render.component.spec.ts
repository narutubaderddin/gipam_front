import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VisibleCatalogComponentRenderComponent } from './visible-catalog-component-render.component';

describe('VisibleCatalogComponentRenderComponent', () => {
  let component: VisibleCatalogComponentRenderComponent;
  let fixture: ComponentFixture<VisibleCatalogComponentRenderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [VisibleCatalogComponentRenderComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VisibleCatalogComponentRenderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
