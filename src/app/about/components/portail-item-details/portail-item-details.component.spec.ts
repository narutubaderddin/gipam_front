import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PortailItemDetailsComponent } from './portail-item-details.component';

describe('PortailItemDetailsComponent', () => {
  let component: PortailItemDetailsComponent;
  let fixture: ComponentFixture<PortailItemDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PortailItemDetailsComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PortailItemDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
