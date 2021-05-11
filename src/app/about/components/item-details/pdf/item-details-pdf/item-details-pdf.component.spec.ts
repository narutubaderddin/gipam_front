import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemDetailsPdfComponent } from './item-details-pdf.component';

describe('ItemDetailsPdfComponent', () => {
  let component: ItemDetailsPdfComponent;
  let fixture: ComponentFixture<ItemDetailsPdfComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ItemDetailsPdfComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemDetailsPdfComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
