import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DenominationsComponent } from './denominations.component';

describe('DenominationsComponent', () => {
  let component: DenominationsComponent;
  let fixture: ComponentFixture<DenominationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DenominationsComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DenominationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
