import { Router } from '@angular/router';
import {Component, HostListener, OnInit, TemplateRef, ViewChild} from '@angular/core';
import { WorkOfArtService } from '@shared/services/work-of-art.service';
import {TreeviewConfig, TreeviewItem} from 'ngx-treeview';
import { LabelType, Options } from '@angular-slider/ngx-slider';
import { FormControl, FormGroup } from '@angular/forms';
import {
  NgbModal,
  ModalDismissReasons,
  NgbDate,
  NgbDateParserFormatter,
  NgbCalendar,
} from '@ng-bootstrap/ng-bootstrap';
import {FieldService} from '@shared/services/field.service';

@Component({
  selector: 'app-portail',
  templateUrl: './portail.component.html',
  styleUrls: ['./portail.component.scss'],
})
export class PortailComponent implements OnInit {
  oeuvres: any[] = [];
  oeuvreToShow: any;
  openType = false;
  filter = false;
  keyword = 'name';
  selectedOeuvre: any[] = [];
  domains : any = [];
  selectedModes : any;
  modes : any = [];

  @ViewChild('contentDeleteOeuvre')
  private modalRefDeleteOeuvre: TemplateRef<any>;

  private modalDeleteOeuvre: any;

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
  page = 1;
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
  nbrElmPerPage = 50;
  pageUp = 0;
  inventoryOptions: Options;
  dynamic: boolean = false;
  formDomainsValues: any[] = [];
  formModesValues: any[] = [];
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
    private calendar: NgbCalendar,
    private fieldService: FieldService,
  ) {
    this.modes = [
      new TreeviewItem({
        text: "Portait",
        value: "Portait",
        collapsed: true,
        children: [],
        checked: false,
      }),
      new TreeviewItem({
        text: "Paysage",
        value: "Paysage",
        collapsed: true,
        children: [],
        checked: false,
      })
    ]
  }

  ngOnInit(): void {
    this.getFields();
    this.getOeuvres();
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
  details(visible: any, source: string,id : string) {
   this.router.navigate(['portail-details',id]);
  }

  onSearchClick() {}

  onToggel(event: any, form: string) {
    switch (form) {
      case 'form1':
        this.firstSearchDrop = event;
        if(!event) {
          this.resetSearch();
          this.getOeuvres();
        }
        break;
      case 'formMode':
        if(!event){
          this.mode = this.selectedMode = this.formModesValues;
          this.resetSearch();
          this.getOeuvres();
        }

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
    this.getOeuvres();
    document.getElementById(id).click();
  }
  resetHeight(id: string) {
    this.highValue = 0;
    this.value = 0;
    this.getOeuvres();
    document.getElementById(id).click();
  }
  resetWidth(id: string) {
    this.highValue1 = 0;
    this.value1 = 0;
    this.getOeuvres();
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
  oeuvreToBeremoved : any;
  removeFromBasket(event: any, item: any) {
    event.stopPropagation();
    this.oeuvreToBeremoved = item;
    this.modalDeleteOeuvre = this.modalService.open(this.modalRefDeleteOeuvre, { centered: true });
  }

  submitDeleteOeuvre() {
    this.oeuvreToBeremoved.isDemanded = false;
    this.selectedOeuvre = this.selectedOeuvre.filter((oeuvre) => {
      return oeuvre.id !== this.oeuvreToBeremoved.id;
    });
    this.modalDeleteOeuvre.close('');
  }
  closeDeleteOeuvre() {
    this.modalDeleteOeuvre.close('');
    this.modalDeleteOeuvre.dismiss('');
  }

  validateInput(currentValue: NgbDate | null, input: string): NgbDate | null {
    const parsed = this.formatter.parse(input);
    return parsed && this.calendar.isValid(NgbDate.from(parsed)) ? NgbDate.from(parsed) : currentValue;
  }
  loading: boolean = false;
  loadingScroll: boolean = false;
  loadingScrollUp: boolean = false;
  errorMessage:any;
  groups: any;
  nbrOeuvre : number = null
  totalOeuvres : number = null
  listOeuvres : any = [];

  private orderOeuvresByDomains(response: any) {
    this.nbrOeuvre = response.filteredQuantity;
    this.totalOeuvres = response.totalQuantity;
    this.listOeuvres = [...this.listOeuvres, ...response.results];
    this.oeuvres=[];
    let results: any = this.listOeuvres.filter((oeuvre:any) => {
      return oeuvre.field !== null;
    });
    this.groups = results.reduce((r: any, a: any) => {
       r[a.field.label] = [...(r[a.field.label] || []), a];
      return r;
    }, {});
    for (let group in this.groups) {
      this.oeuvres.push({
        title: group,
        items: this.groups[group],
      });
    }
    document.getElementById( 'top' ).scrollIntoView();
  }

  searchOeuvre: any;

  uniq(a:any) {
    return Array.from(new Set(a));
  }


  getOeuvres() {
    this.loading = this.page == 1;
    this.loadingScroll = this.page != 1;
    const height = {
      min : this.value,
      max : this.highValue
    }
    const width = {
      min : this.value1,
      max : this.highValue1
    }
    const weight = {
      min : this.value3,
      max : this.highValue3
    }
    let fields :any  = [];
    let denoms :any = [];
    this.formDomainsValues.forEach((elmId:any)=>{
      this.fields.forEach((fld:any)=>{
        if(fld.label == elmId || fld.id == elmId){
          fields.push(fld.id);
        }else {
          fld.denominations.forEach((denom:any)=>{
            if(denom.value === elmId){
              denoms.push(denom.id);
              fields.push(fld.id);
            }
          });
        }

      })
    });
    fields = this.uniq(fields);
    let page = this.page;
    if(this.direction == "up"){
      this.loadingScrollUp = true;
      page = this.pageUp;
    }
    let mode =  null;
    if(this.formModesValues && this.formModesValues.length==1){
      mode = this.formModesValues[0];
    }
    let filter = {
      height:height,
      width:width,
      weight:weight,
      fields:fields,
      denoms:denoms,
      search : this.searchOeuvre,
      mode:mode ,
      page:page
    }
    this.WorkOfArtService.getOeuvres(filter).subscribe(
      (response) => {
        this.orderOeuvresByDomains(response,scroll);
      },
      (error) => {
        //error() callback
        this.loading = this.loadingScroll = this.loadingScrollUp = false;
      },
      () => {
        //complete() callback
        this.loading = this.loadingScroll = this.loadingScrollUp = false;
      }
    );
  }
  initSearch(){
    if(this.searchOeuvre===""){
      this.page = 1;
      this.getOeuvres();
    }
  }

  fields : any = [];
  public getFields() {
    this.errorMessage = '';
    this.fieldService.getFields().subscribe(
      (response) => {
        this.fields = response.results;
        this.fields.forEach((field:any)=>{
          field.denominations = field.denominations.map((denom:any)=>{
            return {id: denom.id, text: denom.label, value: denom.label, checked: false }
          })
          this.domains.push(
            new TreeviewItem({
              text: field.label,
              value: field.label,
              collapsed: true,
              children: field.denominations,
              checked: false,
            })
          )
        })
      },
      (error) => {
        //error() callback
        this.loading = false;
      },
      () => {
        //complete() callback
        this.loading = false;
      }
    );
  }

  mode : string = null;
  selectedMode : string = null;
  changeMode(mode:any){
    this.selectedMode = mode;
  }
  resetMode(){
    this.selectedMode = null;
  }

  throttle = 300;
  scrollDistance = 2;
  scrollUpDistance = 1;
  direction = "";
  modalOpen = false;

  onScrollDown(ev:any) {
    this.page++;
    if(this.listOeuvres.length>=this.nbrElmPerPage) {
      this.getOeuvres();
    }
    this.direction = "down";
  }

  onUp(ev:any) {
    this.direction = "up";
    /*if(this.page >= 1) {
      this.getOeuvres();
    }*/
  }


  toggleModal() {
    this.modalOpen = !this.modalOpen;
  }

  searchQuery(){
    this.resetSearch();
    this.getOeuvres();
  }
  resetSearch(){
    this.oeuvres = this.listOeuvres =[];
    this.page = 1;
  }

}
