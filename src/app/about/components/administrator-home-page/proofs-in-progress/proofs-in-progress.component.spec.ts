import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProofsInProgressComponent } from './proofs-in-progress.component';

describe('ProofsInProgressComponent', () => {
  let component: ProofsInProgressComponent;
  let fixture: ComponentFixture<ProofsInProgressComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ProofsInProgressComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProofsInProgressComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
