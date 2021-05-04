import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubDivisionsComponent } from './subDivisions.component';

describe('StylesComponent', () => {
  let component: SubDivisionsComponent;
  let fixture: ComponentFixture<SubDivisionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SubDivisionsComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SubDivisionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
