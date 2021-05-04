import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CorrespondentsComponent } from './correspondents.component';

describe('CorrespondentsComponent', () => {
  let component: CorrespondentsComponent;
  let fixture: ComponentFixture<CorrespondentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CorrespondentsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CorrespondentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
