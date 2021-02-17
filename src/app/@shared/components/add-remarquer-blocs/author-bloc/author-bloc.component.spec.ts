import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthorBlocComponent } from './author-bloc.component';

describe('AuthorBlocComponent', () => {
  let component: AuthorBlocComponent;
  let fixture: ComponentFixture<AuthorBlocComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AuthorBlocComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AuthorBlocComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
