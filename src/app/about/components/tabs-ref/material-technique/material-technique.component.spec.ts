import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MaterialTechniqueComponent } from './material-technique.component';

describe('MaterialTechniqueComponent', () => {
  let component: MaterialTechniqueComponent;
  let fixture: ComponentFixture<MaterialTechniqueComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MaterialTechniqueComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MaterialTechniqueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
