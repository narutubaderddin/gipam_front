import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PortailImgDetailsComponent } from './portail-img-details.component';

describe('PortailImgDetailsComponent', () => {
  let component: PortailImgDetailsComponent;
  let fixture: ComponentFixture<PortailImgDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PortailImgDetailsComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PortailImgDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
