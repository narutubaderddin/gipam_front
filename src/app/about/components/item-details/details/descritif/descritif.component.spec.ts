import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DescritifComponent } from './descritif.component';

describe('DescritifComponent', () => {
  let component: DescritifComponent;
  let fixture: ComponentFixture<DescritifComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DescritifComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DescritifComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
