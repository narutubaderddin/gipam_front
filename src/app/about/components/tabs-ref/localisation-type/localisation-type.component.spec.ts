import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LocalisationTypeComponent } from './localisation-type.component';

describe('LocalisationTypeComponent', () => {
  let component: LocalisationTypeComponent;
  let fixture: ComponentFixture<LocalisationTypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LocalisationTypeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LocalisationTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
