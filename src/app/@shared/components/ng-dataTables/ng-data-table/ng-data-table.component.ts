import { Component, Input, OnInit } from '@angular/core';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { ListItem } from 'ng-multiselect-dropdown/multiselect.model';

@Component({
  selector: 'app-ng-data-table',
  templateUrl: './ng-data-table.component.html',
  styleUrls: ['./ng-data-table.component.scss'],
})
export class NgDataTableComponent implements OnInit {
  @Input() columns: any[];
  @Input() frozenCols: any[] = [];
  @Input() data: any[] = [];
  @Input() start: number = 1;
  @Input() end: number = 5;
  @Input() totalFiltred: number = 10;
  @Input() total: number = 10;
  @Input() checkBoxSelection: Boolean = false;
  @Input() frozenWidth: string = '250px';
  dropdownSettings: IDropdownSettings;

  calendar_fr: any;

  rangeDates: Date[];
  selectedItems: any;

  selectedRows: any[];

  constructor() {}

  ngOnInit(): void {
    this.data = this.data.slice(0, 5);
    this.dropdownSettings = {
      singleSelection: false,
      idField: 'id',
      textField: 'name',
      selectAllText: 'Sélectionner tout',
      unSelectAllText: 'Supprimer les sélections',
      // itemsShowLimit: 2,
      allowSearchFilter: true,
    };
  }

  onDataChange(event: any) {
    console.log(event);
  }

  loadData($event: any) {}

  filterHeader($event: Event) {
    // @ts-ignore
    console.log($event.target.value);
  }

  onRowSelect(event: any) {
    console.log(this.selectedRows);
  }

  onChange() {}

  onItemSelect($event: ListItem) {}

  onSelectAll($event: Array<ListItem>) {}
}
