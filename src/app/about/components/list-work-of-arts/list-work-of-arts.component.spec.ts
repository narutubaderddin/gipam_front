import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListWorkOfArtsComponent } from './list-work-of-arts.component';

describe('ListWorkOfArtsComponent', () => {
  let component: ListWorkOfArtsComponent;
  let fixture: ComponentFixture<ListWorkOfArtsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ListWorkOfArtsComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListWorkOfArtsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
