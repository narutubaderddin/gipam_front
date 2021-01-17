import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GridActionRendererComponent } from './grid-action-renderer.component';

describe('GridActionRendererComponent', () => {
  let component: GridActionRendererComponent;
  let fixture: ComponentFixture<GridActionRendererComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [GridActionRendererComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GridActionRendererComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
