import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StatusTypeComponentRenderComponent } from './status-type-component-render.component';

describe('StatusTypeComponentRenderComponent', () => {
  let component: StatusTypeComponentRenderComponent;
  let fixture: ComponentFixture<StatusTypeComponentRenderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [StatusTypeComponentRenderComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StatusTypeComponentRenderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
