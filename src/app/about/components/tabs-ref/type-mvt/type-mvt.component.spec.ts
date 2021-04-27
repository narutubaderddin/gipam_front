import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TypeMvtComponent } from './type-mvt.component';

describe('TypeMvtComponent', () => {
  let component: TypeMvtComponent;
  let fixture: ComponentFixture<TypeMvtComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TypeMvtComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TypeMvtComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
