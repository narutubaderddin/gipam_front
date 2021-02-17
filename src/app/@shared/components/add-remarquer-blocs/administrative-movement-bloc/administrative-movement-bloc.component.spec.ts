import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdministrativeMovementBlocComponent } from './administrative-movement-bloc.component';

describe('AdministrativeMovementBlocComponent', () => {
  let component: AdministrativeMovementBlocComponent;
  let fixture: ComponentFixture<AdministrativeMovementBlocComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AdministrativeMovementBlocComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdministrativeMovementBlocComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
