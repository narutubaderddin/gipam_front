import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { ListItem } from 'ng-multiselect-dropdown/multiselect.model';
import { NgbCalendar, NgbDate, NgbDatepickerI18n } from '@ng-bootstrap/ng-bootstrap';
import { CustomDatepickerI18nService, I18n } from '@shared/services/custom-datepicker-i18n.service';

@Component({
  selector: 'app-ng-data-table',
  templateUrl: './ng-data-table.component.html',
  styleUrls: ['./ng-data-table.component.scss'],
  providers: [I18n, { provide: NgbDatepickerI18n, useClass: CustomDatepickerI18nService }],
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
  @Input() singleSelect: boolean = true;

  @Output() singleSelectionEvent = new EventEmitter();
  @Output() multipleSelectionEvent = new EventEmitter();

  dropdownSettings: IDropdownSettings;
  key: string;
  rangeDates: Date[];
  hoveredDate: NgbDate | null = null;
  fromDate: NgbDate;
  toDate: NgbDate | null = null;
  selectedRows: any[];

  constructor(calendar: NgbCalendar) {
    this.fromDate = calendar.getToday();
  }

  ngOnInit(): void {
    this.data = this.data.slice(0, 5);
    this.key = this.columns[0]['field'];
    this.columns = this.columns.filter((col) => {
      if (Object.keys(col).indexOf('isVisible') == -1 || col.isVisible) {
        return col;
      }
    });
    console.log(this.columns);
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

  onDateSelection(date: NgbDate) {
    if (!this.fromDate && !this.toDate) {
      this.fromDate = date;
    } else if (this.fromDate && !this.toDate && date.after(this.fromDate)) {
      this.toDate = date;
    } else {
      this.toDate = null;
      this.fromDate = date;
    }
  }
  isHovered(date: NgbDate) {
    return (
      this.fromDate && !this.toDate && this.hoveredDate && date.after(this.fromDate) && date.before(this.hoveredDate)
    );
  }

  isInside(date: NgbDate) {
    return this.toDate && date.after(this.fromDate) && date.before(this.toDate);
  }

  isRange(date: NgbDate) {
    return (
      date.equals(this.fromDate) ||
      (this.toDate && date.equals(this.toDate)) ||
      this.isInside(date) ||
      this.isHovered(date)
    );
  }

  onRadioSelect(event: NgDataTableComponent) {
    this.singleSelectionEvent.emit(event);
  }

  onCheckBoxSelection(event: any) {
    this.multipleSelectionEvent.emit(event);
  }

  update(columns: any[]) {
    this.columns = columns;
    this.ngOnInit();
  }
}
