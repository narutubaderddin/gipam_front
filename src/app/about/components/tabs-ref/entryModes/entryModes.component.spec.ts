import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EntryModesComponent } from './entryModes.component';

describe('StylesComponent', () => {
  let component: EntryModesComponent;
  let fixture: ComponentFixture<EntryModesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EntryModesComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EntryModesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
