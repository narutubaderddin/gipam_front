import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalTabsRefComponent } from './modal-tabs-ref.component';

describe('ModalTabsRefComponent', () => {
  let component: ModalTabsRefComponent;
  let fixture: ComponentFixture<ModalTabsRefComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ModalTabsRefComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalTabsRefComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
