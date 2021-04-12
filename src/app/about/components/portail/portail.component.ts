import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { WorkOfArtService } from '@shared/services/work-of-art.service';
import { TreeviewConfig } from 'ngx-treeview';
import { LabelType, Options } from '@angular-slider/ngx-slider';
import { FormControl, FormGroup } from '@angular/forms';
import {
  NgbModal,
  ModalDismissReasons,
  NgbDate,
  NgbDateParserFormatter,
  NgbCalendar,
} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-portail',
  templateUrl: './portail.component.html',
  styleUrls: ['./portail.component.scss'],
})
export class PortailComponent implements OnInit {
  oeuvres = this.WorkOfArtService.oeuvres;
  oeuvreToShow: any;
  openType = false;
  filter = false;
  keyword = 'name';
  selectedOeuvre: any[] = [];
  domains = this.WorkOfArtService.getDomains();

  dropdownEnabled = true;
  values: number[];
  newDomainsvalues: number[];
  config = TreeviewConfig.create({
    hasAllCheckBox: true,
    hasFilter: true,
    hasCollapseExpand: true,
    decoupleChildFromParent: false,
    // maxHeight: 400,
  });
  value: number = 0;
  highValue: number = 0;
  value1: number = 0;
  highValue1: number = 0;
  value2: number = 40;
  highValue2: number = 60;
  value3: number = 0;
  highValue3: number = 0;
  isCollapsed = true;
  optionsCm: Options = {
    floor: 0,
    ceil: 9999,
    translate: (value: number, label: LabelType): string => {
      switch (label) {
        case LabelType.Low:
          return '<b>Min: </b> ' + value + 'cm';
        case LabelType.High:
          return '<b>Max: </b> ' + value + 'cm';
        default:
          return value.toString();
      }
    },
  };
  optionsKg: Options = {
    floor: 0,
    ceil: 9999,
    translate: (value: number, label: LabelType): string => {
      switch (label) {
        case LabelType.Low:
          return '<b>Min: </b> ' + value + 'Kg';
        case LabelType.High:
          return '<b>Max: </b> ' + value + 'Kg';
        default:
          return value.toString();
      }
    },
  };
  inventoryValue = 0;
  hightInventoryValue = 60;
  inventoryOptions: Options;
  dynamic: boolean = false;
  formDomainsValues: any[] = [];
  formHeightValues: any[] = [];
  formWidthValues: any[] = [];
  formWeightValues: any[] = [];
  form1: FormGroup;
  firstSearchDrop = false;
  showForm1End = false;

  constructor(
    private WorkOfArtService: WorkOfArtService,
    private router: Router,
    private modalService: NgbModal,
    public formatter: NgbDateParserFormatter,
    private calendar: NgbCalendar
  ) {}

  ngOnInit(): void {
    this.oeuvreToShow = this.oeuvres;
    this.form1 = new FormGroup({
      inventory: new FormControl(''),
      title: new FormControl(''),
      domaine: new FormControl(''),
      denomination: new FormControl(''),
      author: new FormControl(''),
    });
    this.inventoryOptions = {
      floor: 0,
      ceil: 9999,
    };
  }
  search(event: any) {}

  openFilter() {
    if (!this.filter) {
      return (this.filter = true);
    }
    return (this.filter = false);
  }

  selectEvent(item: any) {
    // do something with selected item
  }

  onChangeSearch(val: string) {
    // fetch remote data from here
    // And reassign the 'data' which is binded to 'data' property.
  }

  onFocused(e: any) {
    // do something when input is focused
  }

  onFilterChange(value: string): void {
    console.log('filter:', value);
  }

  details(visible: any, source: string) {
    this.router.navigate(['portail-details'], { queryParams: { show: visible, source: source } });
  }

  onSearchClick() {}

  onToggel(event: any, form: string) {
    switch (form) {
      case 'form1':
        this.firstSearchDrop = event;
        break;
    }
  }

  resetFilter() {
    this.oeuvreToShow = this.oeuvres;
  }

  showInventoryRange = false;
  onCheckboxChange(event: any) {
    this.showInventoryRange = event.target.checked;
  }
  resetWeight(id: string) {
    this.highValue3 = 0;
    this.value3 = 0;
    document.getElementById(id).click();
  }
  resetHeight(id: string) {
    this.highValue = 0;
    this.value = 0;
    document.getElementById(id).click();
  }
  resetWidth(id: string) {
    this.highValue1 = 0;
    this.value1 = 0;
    document.getElementById(id).click();
  }

  closeResult = '';

  open(content: any) {
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title', size: 'lg' }).result.then(
      (result) => {
        this.closeResult = `Closed with: ${result}`;
      },
      (reason) => {
        this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      }
    );
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

  addToBasket(event: any, item: any) {
    event.stopPropagation();
    item.isDemanded = true;
    this.selectedOeuvre.push(item);
  }
  removeFromBasket(event: any, item: any) {
    event.stopPropagation();
    item.isDemanded = false;
    this.selectedOeuvre = this.selectedOeuvre.filter((oeuvre) => {
      return oeuvre.id !== item.id;
    });
  }

  validateInput(currentValue: NgbDate | null, input: string): NgbDate | null {
    const parsed = this.formatter.parse(input);
    return parsed && this.calendar.isValid(NgbDate.from(parsed)) ? NgbDate.from(parsed) : currentValue;
  }
}
