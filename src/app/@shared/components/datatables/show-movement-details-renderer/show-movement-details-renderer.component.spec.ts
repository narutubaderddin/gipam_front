import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowMovementDetailsRendererComponent } from './show-movement-details-renderer.component';

describe('ShowMovementDetailsRendererComponent', () => {
  let component: ShowMovementDetailsRendererComponent;
  let fixture: ComponentFixture<ShowMovementDetailsRendererComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShowMovementDetailsRendererComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowMovementDetailsRendererComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
