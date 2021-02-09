import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddPropertyMovableObjectModalComponent } from './add-property-movable-object-modal.component';

describe('AddPropertyMovableObjectModalComponent', () => {
  let component: AddPropertyMovableObjectModalComponent;
  let fixture: ComponentFixture<AddPropertyMovableObjectModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AddPropertyMovableObjectModalComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddPropertyMovableObjectModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
