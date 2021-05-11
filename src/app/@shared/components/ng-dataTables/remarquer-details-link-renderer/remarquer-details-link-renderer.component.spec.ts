import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RemarquerDetailsLinkRendererComponent } from './remarquer-details-link-renderer.component';

describe('RemarquerDetailsLinkRendererComponent', () => {
  let component: RemarquerDetailsLinkRendererComponent;
  let fixture: ComponentFixture<RemarquerDetailsLinkRendererComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RemarquerDetailsLinkRendererComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RemarquerDetailsLinkRendererComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
