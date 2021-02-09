import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddDepositMovableObjectModalComponent } from './add-deposit-movable-object-modal.component';

describe('AddDepositMovableObjectModalComponent', () => {
  let component: AddDepositMovableObjectModalComponent;
  let fixture: ComponentFixture<AddDepositMovableObjectModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AddDepositMovableObjectModalComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddDepositMovableObjectModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
