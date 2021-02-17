import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PortailItemImageComponent } from './portail-item-image.component';

describe('PortailItemImageComponent', () => {
  let component: PortailItemImageComponent;
  let fixture: ComponentFixture<PortailItemImageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PortailItemImageComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PortailItemImageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
