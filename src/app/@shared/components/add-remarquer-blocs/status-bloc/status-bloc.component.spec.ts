import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StatusBlocComponent } from './status-bloc.component';

describe('StatusBlocComponent', () => {
  let component: StatusBlocComponent;
  let fixture: ComponentFixture<StatusBlocComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [StatusBlocComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StatusBlocComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
