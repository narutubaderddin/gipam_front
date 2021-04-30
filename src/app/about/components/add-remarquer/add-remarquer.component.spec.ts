import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddRemarquerComponent } from './add-remarquer.component';

describe('AddRemarquerComponent', () => {
  let component: AddRemarquerComponent;
  let fixture: ComponentFixture<AddRemarquerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AddRemarquerComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddRemarquerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
