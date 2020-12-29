import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddActionModalComponent } from './add-action-modal.component';

describe('AddActionModalComponent', () => {
  let component: AddActionModalComponent;
  let fixture: ComponentFixture<AddActionModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AddActionModalComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddActionModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
