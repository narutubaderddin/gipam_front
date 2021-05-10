import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AttachmentTypesComponent } from './attachmentTypes.component';

describe('StylesComponent', () => {
  let component: AttachmentTypesComponent;
  let fixture: ComponentFixture<AttachmentTypesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AttachmentTypesComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AttachmentTypesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
