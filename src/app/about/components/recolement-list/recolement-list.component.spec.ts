import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecolementListComponent } from './recolement-list.component';

describe('RecolementListComponent', () => {
  let component: RecolementListComponent;
  let fixture: ComponentFixture<RecolementListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RecolementListComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RecolementListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
