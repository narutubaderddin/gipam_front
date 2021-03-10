import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecoleRendererComponent } from './recole-renderer.component';

describe('RecoleRendererComponent', () => {
  let component: RecoleRendererComponent;
  let fixture: ComponentFixture<RecoleRendererComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RecoleRendererComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RecoleRendererComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
