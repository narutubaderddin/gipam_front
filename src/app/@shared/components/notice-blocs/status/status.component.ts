import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { SimpleTabsRefService } from '@shared/services/simple-tabs-ref.service';

@Component({
  selector: 'app-status',
  templateUrl: './status.component.html',
  styleUrls: ['./status.component.scss'],
})
export class StatusComponent implements OnInit {
  @Input() domains: any;
  @Input() keyword: string;
  @Input() edit = false;
  @Input() addProperty = false;
  @Input() addDeposit = false;
  @Input() propertyStatusForm: FormGroup;
  @Input() depositStatusForm: FormGroup;
  isCollapsed = false;
  categories: any[] = [];
  entryModes: any[] = [];
  params: { limit: number; page: number };
  constructor(private simpleTabsRef: SimpleTabsRefService) {}

  ngOnInit(): void {
    this.getAllEntryModes();
    this.getAllCategories();
  }

  initParams(tabref: string) {
    this.simpleTabsRef.tabRef = tabref;
    this.params = {
      limit: 40,
      page: 1,
    };
  }
  getAllEntryModes() {
    this.initParams('entryModes');
    this.simpleTabsRef.getAllItems(this.params).subscribe(
      (result: any) => {
        this.entryModes = result.results;
      },
      (error: any) => {}
    );
  }
  getAllCategories() {
    this.initParams('propertyStatusCategories');
    this.simpleTabsRef.getAllItems(this.params).subscribe(
      (result: any) => {
        this.categories = result.results;
      },
      (error: any) => {}
    );
  }

  selectEvent(item: any) {}

  onChangeSearch(val: string) {
    // fetch remote data from here
    // And reassign the 'data' which is binded to 'data' property.
  }

  onFocused(e: any) {
    // do something when input is focused
  }
  onCollapse() {
    this.isCollapsed = !this.isCollapsed;
  }
}
