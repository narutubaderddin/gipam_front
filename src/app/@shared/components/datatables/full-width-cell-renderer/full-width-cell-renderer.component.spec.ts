import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FullWidthCellRendererComponent } from './full-width-cell-renderer.component';

describe('FullWidthCellRendererComponent', () => {
  let component: FullWidthCellRendererComponent;
  let fixture: ComponentFixture<FullWidthCellRendererComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FullWidthCellRendererComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FullWidthCellRendererComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
