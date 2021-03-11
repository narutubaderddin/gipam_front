import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DepositorComponent } from './depositor.component';

describe('DepositorComponent', () => {
  let component: DepositorComponent;
  let fixture: ComponentFixture<DepositorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DepositorComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DepositorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
