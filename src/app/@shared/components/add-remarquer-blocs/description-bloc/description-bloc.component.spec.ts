import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DescriptionBlocComponent } from './description-bloc.component';

describe('DescriptionBlocComponent', () => {
  let component: DescriptionBlocComponent;
  let fixture: ComponentFixture<DescriptionBlocComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DescriptionBlocComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DescriptionBlocComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
