import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HypertextLinksComponent } from './hypertext-links.component';

describe('HypertextLinksComponent', () => {
  let component: HypertextLinksComponent;
  let fixture: ComponentFixture<HypertextLinksComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HypertextLinksComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HypertextLinksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
