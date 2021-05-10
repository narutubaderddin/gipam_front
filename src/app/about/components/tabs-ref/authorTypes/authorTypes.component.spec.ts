import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthorTypesComponent } from './authorTypes.component';

describe('StylesComponent', () => {
  let component: AuthorTypesComponent;
  let fixture: ComponentFixture<AuthorTypesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AuthorTypesComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AuthorTypesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
