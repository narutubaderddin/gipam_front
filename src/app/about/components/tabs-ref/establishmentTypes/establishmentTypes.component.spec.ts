import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EstablishmentTypesComponent } from './establishmentTypes.component';

describe('StylesComponent', () => {
  let component: EstablishmentTypesComponent;
  let fixture: ComponentFixture<EstablishmentTypesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EstablishmentTypesComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EstablishmentTypesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
