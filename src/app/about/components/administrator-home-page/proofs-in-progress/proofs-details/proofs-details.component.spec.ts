import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProofsDetailsComponent } from './proofs-details.component';

describe('ProofsDetailsComponent', () => {
  let component: ProofsDetailsComponent;
  let fixture: ComponentFixture<ProofsDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ProofsDetailsComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProofsDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
