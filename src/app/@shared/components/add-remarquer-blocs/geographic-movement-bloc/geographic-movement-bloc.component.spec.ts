import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GeographicMovementBlocComponent } from './geographic-movement-bloc.component';

describe('GeographicMovementBlocComponent', () => {
  let component: GeographicMovementBlocComponent;
  let fixture: ComponentFixture<GeographicMovementBlocComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [GeographicMovementBlocComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GeographicMovementBlocComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
