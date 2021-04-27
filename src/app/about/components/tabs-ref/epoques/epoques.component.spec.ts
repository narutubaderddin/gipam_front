import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EpoquesComponent } from './epoques.component';

describe('EpoquesComponent', () => {
  let component: EpoquesComponent;
  let fixture: ComponentFixture<EpoquesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EpoquesComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EpoquesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
