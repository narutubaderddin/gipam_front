import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TabsRefComponent } from './tabs-ref.component';

describe('TabsRefComponent', () => {
  let component: TabsRefComponent;
  let fixture: ComponentFixture<TabsRefComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TabsRefComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TabsRefComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
