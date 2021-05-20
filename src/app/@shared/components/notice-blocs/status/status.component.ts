import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { SimpleTabsRefService } from '@shared/services/simple-tabs-ref.service';
import { viewDateFormat } from '@shared/utils/helpers';
import { DatePipe } from '@angular/common';
@Component({
  selector: 'app-status',
  templateUrl: './status.component.html',
  styleUrls: ['./status.component.scss'],
  providers: [DatePipe],
})
export class StatusComponent implements OnInit {
  @Input() domains: any;
  @Input() keyword: string;
  @Input() edit = false;
  @Input() addProperty = false;
  @Input() addDeposit = false;
  @Input() propertyStatusForm: FormGroup;
  @Input() depositStatusForm: FormGroup;
  @Input() statusData: any = {};
  isCollapsed = false;
  categories: any[] = [];
  entryModes: any[] = [];
  params: { limit: number; page: number };
  viewDateFormat = viewDateFormat;
  depositors: any[] = [];
  constructor(private simpleTabsRef: SimpleTabsRefService, private datePipe: DatePipe) {}

  ngOnInit(): void {
    this.getAllEntryModes();
    this.getAllCategories();
    this.getAllDepositors();
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
  getAllDepositors() {
    this.initParams('depositors');
    this.simpleTabsRef.getAllItems(this.params).subscribe(
      (result: any) => {
        this.depositors = result.results;
        console.log(this.depositors);
      },
      (error: any) => {
        console.log(error);
      }
    );
  }
  onSelectInsuranceDate(event: any) {
    this.propertyStatusForm.get('insuranceValueDate').setValue(this.datePipe.transform(event, 'yyyy-MM-dd'));
  }
  onSelectEntryDate(event: any) {
    this.propertyStatusForm.get('entryDate').setValue(this.datePipe.transform(event, 'yyyy-MM-dd'));
  }
  onSelectDepositDate(event: any) {
    this.depositStatusForm.get('depositDate').setValue(this.datePipe.transform(event, 'yyyy-MM-dd'));
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

  onSelect(event: any, key: string) {
    console.log('event', event);
    if (this.addDeposit) {
      this.depositStatusForm.get(key).setValue(event.value);
    } else {
      this.propertyStatusForm.get(key).setValue(event.value);
    }
  }
}
