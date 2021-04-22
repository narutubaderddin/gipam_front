import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectButtonRenderComponent } from './select-button-render.component';

describe('SelectButtonRenderComponent', () => {
  let component: SelectButtonRenderComponent;
  let fixture: ComponentFixture<SelectButtonRenderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SelectButtonRenderComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectButtonRenderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
