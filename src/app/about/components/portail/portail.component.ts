import { Router } from '@angular/router';
import { Component, HostListener, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { WorkOfArtService } from '@shared/services/work-of-art.service';
import { TreeviewConfig, TreeviewItem } from 'ngx-treeview';
import { LabelType, Options } from '@angular-slider/ngx-slider';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import {
  NgbModal,
  ModalDismissReasons,
  NgbDate,
  NgbDateParserFormatter,
  NgbCalendar,
} from '@ng-bootstrap/ng-bootstrap';
import { FieldService } from '@shared/services/field.service';
import { RequestService } from '@shared/services/request.service';
import { EstablishmentService } from '@shared/services/establishment.service';
import { MessageService } from 'primeng/api';

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
  domains: any = [];
  selectedModes: any;
  modes: any = [];

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
  nbrElmPerPage = 40;
  pageUp = 0;
  inventoryOptions: Options;
  dynamic: boolean = false;
  formDomainsValues: any[] = [];
  formModesValues: any[] = [];
  formHeightValues: any[] = [];
  formWidthValues: any[] = [];
  formWeightValues: any[] = [];
  establishments: any[] = [];
  buildings: any[] = [];
  subDirections: any[] = [];
  piecesNumbers: any[] = [];
  levels: any[] = [];
  form1: FormGroup;
  firstSearchDrop = false;
  showForm1End = false;
  requestForm: any;

  constructor(
    private WorkOfArtService: WorkOfArtService,
    private router: Router,
    private modalService: NgbModal,
    public formatter: NgbDateParserFormatter,
    private calendar: NgbCalendar,
    private fieldService: FieldService,
    private requestService: RequestService,
    private messageService: MessageService,
    private establishmentService: EstablishmentService
  ) {
    this.modes = [
      new TreeviewItem({
        text: 'Portrait',
        value: 'Portrait',
        collapsed: true,
        children: [],
        checked: false,
      }),
      new TreeviewItem({
        text: 'Paysage',
        value: 'Paysage',
        collapsed: true,
        children: [],
        checked: false,
      }),
    ];
    this.selectedOeuvre = this.WorkOfArtService.getSelectedArtWorks();
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
    this.requestForm = new FormGroup({
      firstName: new FormControl('', [Validators.required]),
      lastName: new FormControl('', [Validators.required]),
      pieceNumber: new FormControl('', [Validators.required]),
      phone: new FormControl('', [Validators.required]),
      mail: new FormControl('', [Validators.required, Validators.email]),
      establishement: new FormControl('', [Validators.required]),
      subDivision: new FormControl('', [Validators.required]),
      function: new FormControl('', [Validators.required]),
      building: new FormControl('', [Validators.required]),
      level: new FormControl('', [Validators.required]),
      comment: new FormControl(''),
      phoneApplicant: new FormControl(''),
      firstNameApplicant: new FormControl(''),
      lastNameApplicant: new FormControl(''),
    });
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
  details(item: any) {
    if (item.isInRequest) {
      return false;
    }
    this.router.navigate(['portail-details', item.id]);
  }

  onSearchClick() {}

  onToggel(event: any, form: string) {
    switch (form) {
      case 'form1':
        this.firstSearchDrop = event;
        if (!event) {
          this.resetSearch();
          this.getOeuvres();
        }
        break;
      case 'formMode':
        if (!event) {
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
    //this.getOeuvres();
    document.getElementById(id).click();
  }
  resetHeight(id: string) {
    this.highValue = 0;
    this.value = 0;
    //this.getOeuvres();
    document.getElementById(id).click();
  }
  resetWidth(id: string) {
    this.highValue1 = 0;
    this.value1 = 0;
    //this.getOeuvres();
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
    if (item.isInRequest) {
      return false;
    }
    item.isDemanded = true;
    this.WorkOfArtService.addSelectedArtWorks(item);
  }
  oeuvreToBeremoved: any;
  removeFromBasket(event: any, item: any) {
    event.stopPropagation();
    if (item.isInRequest) {
      return false;
    }
    this.oeuvreToBeremoved = item;
    this.modalDeleteOeuvre = this.modalService.open(this.modalRefDeleteOeuvre, { centered: true });
  }

  submitDeleteOeuvre() {
    this.oeuvreToBeremoved.isDemanded = false;
    this.selectedOeuvre = this.selectedOeuvre.filter((oeuvre) => {
      return oeuvre.id !== this.oeuvreToBeremoved.id;
    });
    this.WorkOfArtService.setSelectedArtWorks(this.selectedOeuvre);
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
  errorMessage: any;
  groups: any;
  nbrOeuvre: number = null;
  totalOeuvres: number = null;
  filteredQuantity: number = null;
  listOeuvres: any = [];

  private orderOeuvresByDomains(response: any) {
    this.totalOeuvres = response.totalQuantity;
    this.filteredQuantity = response.filteredQuantity;
    this.listOeuvres = [...this.listOeuvres, ...response.results];
    this.oeuvres = [];
    let results: any = this.listOeuvres.filter((oeuvre: any) => {
      oeuvre.tooltip = 'Ajouter au panier';
      if (this.selectedOeuvre.find((elm) => elm.id == oeuvre.id)) {
        oeuvre.isDemanded = true;
      }
      if (oeuvre.isInRequest) {
        oeuvre.tooltip = 'Oeuvre réservée';
      }
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
    document.getElementById('top').scrollIntoView();
  }

  searchOeuvre: any;

  uniq(a: any) {
    return Array.from(new Set(a));
  }

  getOeuvres() {
    this.loading = this.page == 1;
    this.loadingScroll = this.page != 1;
    let filter = this.extractedFilterOeuvres();
    this.WorkOfArtService.getOeuvres(filter).subscribe(
      (response) => {
        this.orderOeuvresByDomains(response);
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
  private extractedFilterOeuvres() {
    const height = {
      min: this.value,
      max: this.highValue,
    };
    const width = {
      min: this.value1,
      max: this.highValue1,
    };
    const weight = {
      min: this.value3,
      max: this.highValue3,
    };
    let fields: any = [];
    let denoms: any = [];
    this.formDomainsValues.forEach((elmId: any) => {
      this.fields.forEach((fld: any) => {
        if (fld.label == elmId || fld.id == elmId) {
          fields.push(fld.id);
        } else {
          fld.denominations.forEach((denom: any) => {
            if (denom.value === elmId) {
              denoms.push(denom.id);
              fields.push(fld.id);
            }
          });
        }
      });
    });
    fields = this.uniq(fields);
    let page = this.page;
    if (this.direction == 'up') {
      this.loadingScrollUp = true;
      page = this.pageUp;
    }
    let mode = null;
    if (this.formModesValues && this.formModesValues.length == 1) {
      mode = this.formModesValues[0];
    }
    return {
      height: height,
      width: width,
      weight: weight,
      fields: fields,
      denoms: denoms,
      search: this.searchOeuvre,
      mode: mode,
      page: page,
    };
  }

  initSearch() {
    if (this.searchOeuvre === '') {
      this.page = 1;
      this.getOeuvres();
    }
  }

  fields: any = [];
  public getFields() {
    this.errorMessage = '';
    this.fieldService.getFields().subscribe(
      (response) => {
        this.fields = response.results;
        this.fields.forEach((field: any) => {
          field.denominations = field.denominations.map((denom: any) => {
            return { id: denom.id, text: denom.label, value: denom.label, checked: false };
          });
          this.domains.push(
            new TreeviewItem({
              text: field.label,
              value: field.label,
              collapsed: true,
              children: field.denominations,
              checked: false,
            })
          );
        });
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

  mode: any = null;
  selectedMode: any = null;
  changeMode(mode: any) {
    this.selectedMode = mode;
  }
  resetMode() {
    this.selectedMode = null;
  }

  throttle = 300;
  scrollDistance = 2;
  scrollUpDistance = 1;
  direction = '';
  modalOpen = false;

  onScrollDown(ev: any) {
    this.page++;
    if (this.listOeuvres.length >= this.nbrElmPerPage) {
      this.getOeuvres();
    }
    this.direction = 'down';
  }

  onUp(ev: any) {
    this.direction = 'up';
    /*if(this.page >= 1) {
      this.getOeuvres();
    }*/
  }

  toggleModal() {
    this.modalOpen = !this.modalOpen;
  }

  searchQuery() {
    this.resetSearch();
    this.getOeuvres();
  }
  resetSearch() {
    this.oeuvres = this.listOeuvres = [];
    this.page = 1;
  }
  getEstablishments() {
    this.establishmentService.getEstablishments().subscribe((response) => {
      this.establishments = response.results;
    });
  }
  filterEstablishment(event: any) {
    let filter = event.filter;
    if (filter.length >= 3) {
      let payload: any = {
        label: filter,
      };
      this.establishmentService.getEstablishments(payload).subscribe((response) => {
        this.establishments = response.results;
      });
    }
  }
  filterSubDirection(event: any) {
    let filter = event.filter;
    if (filter.length >= 3) {
      let payload: any = {
        label: filter,
      };
      this.establishmentService.getEstablishments(payload).subscribe((response) => {
        this.establishments = response.results;
      });
    }
  }
  filterBuilding(event: any) {
    let filter = event.filter;
    if (filter.length >= 3) {
      let payload: any = {
        label: filter,
      };
      this.establishmentService.getEstablishments(payload).subscribe((response) => {
        this.establishments = response.results;
      });
    }
  }
  getBuildings() {
    this.requestService.getBuildings().subscribe((response) => {
      this.buildings = response.results;
    });
  }
  request: any;
  onSubmitRequest(request: any) {
    let payload: any = {
      ...this.requestForm.value,
      requestStatus: 'En cours',
    };
    let artWorks: any = [];
    this.selectedOeuvre.forEach((ouvre) => {
      artWorks.push(ouvre.id);
    });
    if (artWorks.length > 0) {
      payload.artWorks = artWorks;
    }
    this.requestService.newRequest(payload).subscribe((response: any) => {
      this.modalService.dismissAll('NgbdModal1Content');
      this.requestForm.reset();
      this.selectedBuilding = this.selectedLevel = this.selectedEstablishment = this.selectedPieceNumber = this.selectedSubDirection = null;
      this.selectedOeuvre.forEach((oeuvre: any) => {
        oeuvre.isInRequest = true;
      });
      this.selectedOeuvre = [];
      this.WorkOfArtService.removeSelectedArtWorks();
      this.messageService.add({
        severity: 'success',
        summary: 'Demande des oeuvres',
        detail: 'Votre demande a été enregistrée avec succès',
      });
    });
  }
  getListSubDirection(estab: any) {
    let payload: any = {
      establishmentId: estab.id,
    };
    this.establishmentService.getSubDirections(payload).subscribe((response: any) => {
      this.subDirections = response.results;
    });
  }
  getLevels(buildingId: any) {
    this.requestService.getLevels(buildingId).subscribe((response: any) => {
      this.levels = response.map((elm: any, index: any) => {
        return {
          id: index,
          label: elm,
        };
      });
    });
  }
  getPiecesNumbers() {
    let filter = {
      level: this.selectedLevel.label,
      building: this.selectedBuilding.id,
    };
    this.requestService.getPiecesNumbers(filter).subscribe((response: any) => {
      this.piecesNumbers = response.map((elm: any, index: any) => {
        return {
          id: index,
          label: elm,
        };
      });
    });
  }
  selectedEstablishment: any;
  selectedSubDirection: any;
  selectedBuilding: any;
  selectedPieceNumber: any;
  selectedLevel: any;

  exportRequests() {
    this.requestService.exportRequest().subscribe((response: Response | any) => {
      this.requestService.manageFileResponseDownload(response, 'test');
    });
  }

  exportArtWorks() {
    let filter: any = {};
    filter = this.extractedFilterOeuvres();
    filter.limit = this.totalOeuvres;
    delete filter['page'];
    this.WorkOfArtService.exportArtWorks(filter).subscribe((response: Response | any) => {
      this.requestService.manageFileResponseDownload(response, 'Oeuvres Graphiques');
    });
  }
}
