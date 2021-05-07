import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PhotographyTypesComponent } from './photographyTypes.component';

describe('StylesComponent', () => {
  let component: PhotographyTypesComponent;
  let fixture: ComponentFixture<PhotographyTypesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PhotographyTypesComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PhotographyTypesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
