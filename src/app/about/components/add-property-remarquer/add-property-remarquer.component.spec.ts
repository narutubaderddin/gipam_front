import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddPropertyRemarquerComponent } from './add-property-remarquer.component';

describe('AddPropertyRemarquerComponent', () => {
  let component: AddPropertyRemarquerComponent;
  let fixture: ComponentFixture<AddPropertyRemarquerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AddPropertyRemarquerComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddPropertyRemarquerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
