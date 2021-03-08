import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StatusTypeRenderComponent } from './status-type-render.component';

describe('StatusTypeRenderComponent', () => {
  let component: StatusTypeRenderComponent;
  let fixture: ComponentFixture<StatusTypeRenderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [StatusTypeRenderComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StatusTypeRenderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
