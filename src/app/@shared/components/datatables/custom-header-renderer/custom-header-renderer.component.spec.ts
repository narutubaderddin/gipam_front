import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomHeaderRendererComponent } from './custom-header-renderer.component';

describe('CustomHeaderRendererComponent', () => {
  let component: CustomHeaderRendererComponent;
  let fixture: ComponentFixture<CustomHeaderRendererComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CustomHeaderRendererComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomHeaderRendererComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
