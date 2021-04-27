import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalMvtActionTypesComponent } from './modal-mvt-action-types.component';

describe('ModalMvtActionTypesComponent', () => {
  let component: ModalMvtActionTypesComponent;
  let fixture: ComponentFixture<ModalMvtActionTypesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ModalMvtActionTypesComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalMvtActionTypesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
