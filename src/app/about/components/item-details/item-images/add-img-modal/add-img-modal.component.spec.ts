import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddImgModalComponent } from './add-img-modal.component';

describe('AddImgModalComponent', () => {
  let component: AddImgModalComponent;
  let fixture: ComponentFixture<AddImgModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AddImgModalComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddImgModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
