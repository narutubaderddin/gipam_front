import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MovementActionTypesComponent } from './movement-action-types.component';

describe('MovementActionTypesComponent', () => {
  let component: MovementActionTypesComponent;
  let fixture: ComponentFixture<MovementActionTypesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MovementActionTypesComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MovementActionTypesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
