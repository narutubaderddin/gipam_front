import { ActivatedRoute, Router } from '@angular/router';
import { WorkOfArtService } from '@shared/services/work-of-art.service';
import { Component, ElementRef, Input, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ColumnFilterService } from '@shared/services/column-filter.service';
import { forkJoin } from 'rxjs';
import { Options } from '@angular-slider/ngx-slider';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { NgbDate } from '@ng-bootstrap/ng-bootstrap';
import { DatePipe } from '@angular/common';
import { NgDataTableComponent } from '@shared/components/ng-dataTables/ng-data-table/ng-data-table.component';
import { ArtWorkService } from '@app/about/services/art-work.service';
import ArtWorksDataModel from '@app/about/models/art-works-model';
import { FieldsService } from '@shared/services/fields.service';
import { DenominationsService } from '@shared/services/denominations.service';
import { StylesService } from '@shared/services/styles.service';
import { SimpleTabsRefService } from '@shared/services/simple-tabs-ref.service';
import { MaterialTechniqueService } from '@shared/services/material-technique.service';
import { MessageService } from 'primeng/api';
import { map } from 'rxjs/operators';
import { RoomService } from '@shared/services/room.service';
import { PdfGeneratorService } from '@shared/services/pdf-generator.service';
import { RequestService } from '@shared/services/request.service';
import { lastArtOfWorkDetailIndex, searchPageFilter } from '@shared/utils/helpers';

@Component({
  selector: 'app-list-work-of-arts',
  templateUrl: './list-work-of-arts.component.html',
  styleUrls: ['./list-work-of-arts.component.scss'],
  providers: [DatePipe],
})
export class ListWorkOfArtsComponent implements OnInit {
  @ViewChildren('accordionSectionDOM', { read: ElementRef }) accordionsDOM: QueryList<ElementRef>;
  @ViewChild(NgDataTableComponent, { static: false }) dataTableComponent: NgDataTableComponent;
  isCollapsed = true;
  showDatatable = false;
  printingNotice = false;
  exportingNotice = false;
  data = false;
  mode = 'liste';
  filterFormGroup: FormGroup;
  showInventoryRange = false;
  oeuvrePerDomain: any;
  oeuvres = this.WorkOfArtService.oeuvres[0].items;
  frozenCols: any = [];
  columns: any[];
  selectedRows: any;
  selectedRowCount = 0;
  inventoryOptions: Options;
  gridReady = false;
  dataSlider: any = {
    length: { value: 0, heightValue: 0 },
    height: { value: 0, heightValue: 0 },
    width: { value: 0, heightValue: 0 },
    depth: { value: 0, heightValue: 0 },
    weight: { value: 0, heightValue: 0 },
    lengthTotal: { value: 0, heightValue: 0 },
    heightTotal: { value: 0, heightValue: 0 },
    widthtTotal: { value: 0, heightValue: 0 },
  };
  oeuvreToShow: any;
  rowCount = 5;
  domaine: any;
  dropdownSettings: IDropdownSettings;
  title: any;
  form1: FormGroup;
  form1Values: any[] = [];
  showForm1End = false;
  form2: FormGroup;
  form3: FormGroup;
  form4: FormGroup;
  formStatus: FormGroup;
  form2Values: any[] = [];
  form3Values: any[] = [];
  form4Values: any[] = [];
  showForm2End = false;
  showForm3End = false;
  showForm4End = false;
  dynamic: boolean = false;
  modelDate = '2021';
  visibleCol: any[] = [];
  items = ['oeuvre art', 'test'];
  artWorksData: ArtWorksDataModel;
  limit = 5;
  end: number;
  start: number;
  loading: boolean = false;
  firstLoading: boolean = true;
  headerFilter: any = {};
  advancedForm1: FormGroup;
  domainData: any[] = [];
  denominationData: any[] = [];
  styleData: any[] = [];
  authorData: any[] = [];
  categoriesData: any[] = [];
  depositorsData: any[] = [];
  movementTypesData: any[] = [];
  movementActionTypesData: any[] = [];
  reportTypesData: any[] = [];
  reportActionTypesData: any[] = [];
  materialTechniquesData: any[] = [];
  ministryData: any[] = [];
  establishmentData: any[] = [];
  subDivisionData: any[] = [];
  serviceData: any[] = [];
  establishmentTypeData: any[] = [];
  correspondentGeographicData: any[] = [];
  correspondentAdministrativeData: any[] = [];
  locationTypeData: any[] = [];
  regionData: any[] = [];
  departmentsData: any[] = [];
  communesData: any[] = [];
  buildingData: any[] = [];
  entryModesData: any[] = [];
  siteData: any[] = [];
  roomData: any[] = [];
  levelData: any[] = [];
  // correspondant

  depotStatus: boolean = true;
  propStatus: Boolean = true;
  eraData: any[] = [];
  operatorData = [
    { name: 'Et', id: 'and' },
    { name: 'Ou', id: 'or' },
    { name: 'Sauf', id: 'not' },
  ];
  artWorkSelectData = [
    { name: 'Sans oeuvres archivée', id: '' },
    { name: 'Avec oeuvres archivées', id: '' },
    { name: 'Uniquement oeuvres', id: '' },
  ];
  titleData: any[] = [];
  advancedForm3: FormGroup;
  formStatusValue: any[] = [];
  statusFormSearchDrop: any;
  lastFilter = { empty: true };
  filterChanged = false;

  private showFormStatusEnd: boolean = false;

  constructor(
    private fb: FormBuilder,
    public columnFilterService: ColumnFilterService,
    public WorkOfArtService: WorkOfArtService,
    private datePipe: DatePipe,
    private router: Router,
    private artWorkService: ArtWorkService,
    private activatedRoute: ActivatedRoute,
    private fieldService: FieldsService,
    private denominationsService: DenominationsService,
    private styleService: StylesService,
    private simpleTabsRefService: SimpleTabsRefService,
    private messageService: MessageService,
    private materialTechniqueService: MaterialTechniqueService,
    private roomService: RoomService,
    private pdfGeneratorService: PdfGeneratorService,
    private requestService: RequestService
  ) {}

  initData(filter: any, advancedFilter: any, headerFilters: any = {}, page = 1) {
    let sort = 'desc';
    let sortBy = 'creationDate';
    if (this.dataTableSort.hasOwnProperty('sort')) {
      sort = this.dataTableSort['sort'];
      sortBy = this.dataTableSort['sort_by'];
    }
    const limit = this.mode === 'pictures' ? 20 : 5;
    const filters = {
      mode: this.mode,
      filter,
      advancedFilter,
      headerFilters,
      page,
      limit,
      sortBy,
      sort,
      globalSearch: this.globalSearch,
      searchQuery: this.searchQuery,
    };
    if (!this.isFilterChanged(filters)) {
      return;
    }
    if (this.mode === 'pictures') {
      if (page === 1) {
        console.log('changed');
        this.artWorkResults = [];
        this.firstLoading = true;
      }
    }
    this.loading = true;
    this.artWorkService
      .getArtWorksData(
        filter,
        advancedFilter,
        headerFilters,
        page,
        limit,
        sortBy,
        sort,
        this.searchQuery,
        this.globalSearch
      )
      .subscribe(
        (artWorksData: ArtWorksDataModel) => {
          localStorage.setItem(searchPageFilter, JSON.stringify(filters));
          if (this.mode === 'pictures' && page > 1) {
            artWorksData.results.forEach((oeuvre: any) => {
              this.artWorkResults.push(oeuvre);
            });
          } else {
            this.artWorkResults = artWorksData.results;
            this.artWorksData = artWorksData;
            // to know the index of clicked input
            localStorage.setItem(
              'searchPageFilterLastItemsIds',
              JSON.stringify(this.artWorkResults.map((items) => items.id))
            );
          }
          this.page = this.artWorksData.page;
          this.start = (this.artWorksData.page - 1) * this.artWorksData.size + 1;
          this.end = (this.artWorksData.page - 1) * this.artWorksData.size + this.artWorksData.results.length;
          this.loading = false;
          this.loadingScroll = false;
          this.firstLoading = false;
        },
        (error: any) => {
          this.addSingle('error', '', error.error.message);
        }
      );
  }

  isFilterChanged(newFilter: any): boolean {
    if (JSON.stringify(newFilter) !== JSON.stringify(this.lastFilter)) {
      this.lastFilter = Object.assign({}, newFilter);
      this.filterChanged = true;
      return true;
    }
    this.filterChanged = false;
    return false;
  }

  addSingle(type: string, sum: string, msg: string) {
    this.messageService.add({ severity: type, summary: sum, detail: msg });
  }
  selectedOeuvres: any[] = [];
  artWorkResults: any[] = [];
  @ViewChild('globalSearch') searchButton: Input;
  ngOnInit(): void {
    this.initFilterData();
    this.oeuvreToShow = this.oeuvres;
    this.initFilterFormGroup();
    this.domaine = this.WorkOfArtService.domaine;
    this.dropdownSettings = {
      singleSelection: false,
      idField: 'id',
      textField: 'name',
      selectAllText: 'Sélectionner tout',
      unSelectAllText: 'Supprimer les sélections',
      // itemsShowLimit: 2,
      allowSearchFilter: true,
    };
    this.initForms();
    this.onChanges();
    this.globalSearch = this.activatedRoute.snapshot.queryParams['search'];
    if (this.globalSearch && this.globalSearch.length > 0) {
      this.router.navigate(['.'], { relativeTo: this.activatedRoute, queryParams: {} });
      this.onSearchClick('global');
    }
    this.inventoryOptions = {
      floor: 0,
      ceil: 9999,
    };
  }

  saveArtOfWorkIndex(index: number) {
    localStorage.setItem(lastArtOfWorkDetailIndex, JSON.stringify(index));
    console.log('lastArtOfWorkDetailIndex', JSON.parse(localStorage.getItem(lastArtOfWorkDetailIndex)));
  }

  onHeaderToggle(column: any, event: MouseEvent): void {
    let localColumn = this.columns[column.index];
    // @ts-ignore
    localColumn['isVisible'] = event.target.checked;
    this.columns.splice(column.index, 1);
    this.columns.splice(column.index, 0, localColumn);
    this.dataTableComponent.update(this.columns);
  }

  onDataTableFilterChange(headersFilter: any) {
    const forms = this.formatFormsData({}, [
      this.form1.value,
      this.form2.value,
      this.form3.value,
      this.form4.value,
      this.formStatus.value,
    ]);
    const advancedForms = this.formatAdvancedData({}, [this.advancedForm1.value, this.advancedForm3.value]);
    this.headerFilter = this.formatFormsData({}, [headersFilter], true);
    this.initData(forms, advancedForms, this.headerFilter, 1);
  }

  initFilterFormGroup() {
    this.filterFormGroup = this.fb.group({
      titre: '',
    });
  }

  //validate request value
  inventoryValue = 0;
  hightInventoryValue = 60;
  inventaire: any = '';
  firstSearchDrop = false;
  secondSearchDrop = false;
  thirdSearchDrop = false;
  fourthSearchDrop = false;
  form1Advanced: boolean = false;
  form3Advanced: boolean = false;
  dataTableSort: any = {};

  onSelectAll(items: any) {}

  onDomainSelect(item: any) {}

  onItemSelect($event: any) {}

  onValueChange(event: any) {
    this.inventaire = event.target.value + event.key;
  }

  formatFormsData(data: any, values: any[], header = false) {
    if (header) {
      values.forEach((value) => {
        data = this.getDataFromHeadersForm(data, value);
      });
    } else {
      values.forEach((value) => {
        data = this.getDataFromForm(data, value);
      });
    }

    return data;
  }
  sortEvent(e: any) {
    this.dataTableSort = e;
    let data = this.formatFormsData({}, [
      this.form1.value,
      this.form2.value,
      this.form3.value,
      this.form4.value,
      this.formStatus.value,
    ]);
    let advancedData = this.formatAdvancedData({}, [this.advancedForm1.value, this.advancedForm3.value]);
    this.headerFilter = this.formatFormsData({}, [this.headerFilter], true);
    this.initData(data, advancedData, this.headerFilter, this.artWorksData.page);
  }
  formatAdvancedData(data: any, values: any[]) {
    values.forEach((value) => {
      data = this.getDataFromAdvancedForm(data, value);
    });
    return data;
  }
  getDataFromHeadersForm(data: any, value: any) {
    Object.keys(value).forEach((key) => {
      let result: any[] = [];
      switch (key) {
        case 'domaine':
        case 'denomination':
        case 'materialTechnique':
        case 'style':
        case 'communes':
        case 'era':
        case 'field':
        case 'status':
          if (Array.isArray(value[key]['value'])) {
            value[key]['value'].forEach((item: any) => {
              result.push(item['id']);
            });
          }
          data[key] = result;
          break;
        case 'authors':
          if (Array.isArray(value[key]['value'])) {
            value[key]['value'].forEach((item: any) => {
              result.push(item['id']);
            });
          }
          data['auteurs'] = result;
          break;
        default:
          data[key] = value[key]['value'];
          break;
      }
    });
    return data;
  }

  getDataFromAdvancedForm(data: any, value: any) {
    Object.keys(value).forEach((key) => {
      if (!key.includes('Operator')) {
        let keyValue;
        switch (key) {
          case 'style':
          case 'materialTechnique':
          case 'responsible':
          case 'era':
            let result: any[] = [];
            if (Array.isArray(value[key])) {
              value[key].forEach((item: any) => {
                result.push(item['id']);
              });
            }
            keyValue = result;
            break;
          case 'length':
          case 'height':
          case 'width':
          case 'depth':
          case 'weight':
          case 'lengthTotal':
          case 'heightTotal':
          case 'widthTotal':
            if (
              this.dataSlider.hasOwnProperty(key) &&
              this.dataSlider[key]['value'] <= this.dataSlider[key]['heightValue'] &&
              this.dataSlider[key]['heightValue'] > 0
            ) {
              keyValue = [this.dataSlider[key]['value'], this.dataSlider[key]['heightValue']];
            }
            break;
          default:
            keyValue = value[key];
            break;
        }
        if (keyValue) {
          data[key] = { value: keyValue, operator: value[key + 'Operator'] };
        } else {
          data[key] = { value: '', operator: value[key + 'Operator'] };
        }
      }
    });

    return data;
  }

  getDataFromForm(data: any, value: any) {
    Object.keys(value).forEach((key) => {
      let result: any[] = [];
      switch (key) {
        case 'domaine':
        case 'denomination':
        case 'auteurs':
        case 'materialTechnique':
        case 'style':
        case 'era':
        case 'mouvement':
        case 'mouvementAction':
        case 'constat':
        case 'deposant':
        case 'constatAction':
        case 'categorie':
        case 'localType':
        case 'region':
        case 'departement':
        case 'communes':
        case 'batiment':
        case 'sites':
        case 'pieceNumber':
        case 'correspondant':
        case 'etablissement':
        case 'sousDirection':
        case 'entryMode':
        case 'services':
        case 'ministry':
        case 'status':
          if (Array.isArray(value[key])) {
            value[key].forEach((item: any) => {
              result.push(item['id']);
            });
          }
          data[key] = result;
          break;
        case 'field':
          if (Array.isArray(value[key])) {
            value[key].forEach((item: any) => {
              result.push(item['id']);
            });
          }
          data['domaine'] = result;
          break;
        case 'authors':
          if (Array.isArray(value[key])) {
            value[key].forEach((item: any) => {
              result.push(item['id']);
            });
          }
          data['auteurs'] = result;
          break;
        case 'id':
          if (
            this.showInventoryRange &&
            this.inventoryValue <= this.hightInventoryValue &&
            this.hightInventoryValue != 0
          ) {
            data[key] = [this.inventoryValue, this.hightInventoryValue];
          } else {
            data[key] = value[key];
          }
          break;
        default:
          data[key] = value[key];
          break;
      }
    });
    return data;
  }

  onToggel(event: any, form: string) {
    switch (form) {
      case 'form1':
        this.firstSearchDrop = event;
        break;
      case 'form2':
        this.secondSearchDrop = event;
        break;
      case 'form3':
        this.thirdSearchDrop = event;
        break;
      case 'form4':
        this.fourthSearchDrop = event;
        break;
      case 'statusForm':
        this.statusFormSearchDrop = event;
        break;
    }
    if (event == false) {
      let data = this.formatFormsData({}, [
        this.form1.value,
        this.form2.value,
        this.form3.value,
        this.form4.value,
        this.formStatus.value,
      ]);
      let advancedData = this.formatAdvancedData({}, [this.advancedForm1.value, this.advancedForm3.value]);
      this.headerFilter = this.formatFormsData({}, [this.headerFilter], true);
      this.showDatatable = true;
      this.initData(data, advancedData, this.headerFilter, this.page);
    }
  }

  private onChanges() {
    this.onForm1Change();
    this.onForm2Change();
    this.onForm3Change();
    this.onFormStatusChange();
    this.onForm4Change();
  }

  onForm1Change() {
    this.form1.valueChanges.subscribe((val) => {
      let count = 0;
      this.form1Values = [];
      Object.keys(val).forEach((key) => {
        if (val[key] != '') {
          count++;
          let value = this.checkFormvalues(val, key);
          this.form1Values.push(value);
        }
      });
      this.showForm1End = count > 4;
    });
  }
  onFormStatusChange() {
    this.formStatus.valueChanges.subscribe((val) => {
      let count = 0;
      this.formStatusValue = [];
      Object.keys(val).forEach((key: any) => {
        if (val[key] != '') {
          count++;
          let value = this.checkFormvalues(val, key);
          this.formStatusValue.push(value);
        }
      });
      this.showFormStatusEnd = count > 4;
    });
  }
  private checkFormvalues(val: any, key: string) {
    let value = '';
    if (['string', 'boolean', 'object', 'number'].indexOf(typeof val[key]) == -1) {
      val[key].forEach((choice: any) => {
        value += choice['name'] + ',';
      });
      value = value.slice(0, -1);
    } else {
      value = val[key];
    }
    return value;
  }

  onForm2Change() {
    this.form2.valueChanges.subscribe((val) => {
      let count = 0;
      this.form2Values = [];
      Object.keys(val).forEach((key) => {
        if (val[key] != '') {
          count++;
          let value = this.checkFormvalues(val, key);

          this.form2Values.push(value);
        }

        this.showForm2End = count > 4;
      });
    });
  }

  onForm3Change() {
    this.form3.valueChanges.subscribe((val) => {
      let count = 0;
      this.form3Values = [];
      Object.keys(val).forEach((key) => {
        if (val[key] != '') {
          count++;
          let value = this.checkFormvalues(val, key);
          this.form3Values.push(value);
        }

        this.showForm3End = count > 4;
      });
    });
  }

  onForm4Change() {
    this.form4.valueChanges.subscribe((val) => {
      let count = 0;
      this.form4Values = [];
      Object.keys(val).forEach((key) => {
        if (val[key] != '') {
          count++;
          let value = this.checkFormvalues(val, key);
          this.form4Values.push(value);
        }

        this.showForm4End = count > 4;
      });
    });
  }

  onCheckboxChange(event: any) {
    this.showInventoryRange = event.target.checked;
  }

  onSearchClick(type = 'local') {
    let data = this.formatFormsData({}, [
      this.form1.value,
      this.form2.value,
      this.form3.value,
      this.form4.value,
      this.formStatus.value,
    ]);
    let advancedData = this.formatAdvancedData({}, [this.advancedForm1.value, this.advancedForm3.value]);
    this.headerFilter = this.formatFormsData({}, [this.headerFilter], true);
    this.initData(data, advancedData, this.headerFilter, 1);
    this.showDatatable = true;
  }

  globalSearch: string = '';
  searchQuery: string = '';
  fromDate: NgbDate | null;
  toDate: NgbDate | null;
  hoveredDate: NgbDate | null = null;
  openImg: boolean = false;
  imageUrl: string;
  descriptionData: any;

  onDateSelection(date: NgbDate) {
    if (!this.fromDate && !this.toDate) {
      this.fromDate = date;
    } else if (this.fromDate && !this.toDate && date && date.after(this.fromDate)) {
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

  showImg(url: string = null) {
    if (url == null) {
      this.openImg = false;
    } else {
      this.imageUrl = url;
      this.openImg = !this.openImg;
    }
  }

  onChange(event: Date) {
    if (event && !isNaN(event.getFullYear())) {
      this.advancedForm1.controls['creationDate'].setValue(event.getFullYear());
    }
  }

  onRowsSelection(data: any) {
    if (Array.isArray(data)) {
      this.selectedRows = data;
      this.selectedRowCount = data.length;
    }
  }

  private initVisibleCols() {
    this.columns.forEach((data, index) => {
      this.visibleCol.push({
        header: data.header,
        field: data.field,
        isVisible: data.isVisible,
        index: index,
      });
    });
  }

  getTabRefData(result: any[]) {
    let items: any[] = [];
    result.forEach((item: any) => {
      if (item.hasOwnProperty('label')) {
        items.push({ id: item.id, name: item.label });
      } else {
        items.push({ id: item.id, name: item.name });
      }
    });
    return items;
  }

  initFilterData() {
    const data = {
      page: 1,
      'active[eq]': 1,
      serializer_group: JSON.stringify(['response', 'short']),
    };
    forkJoin([
      this.fieldService.getAllFields(data),
      this.denominationsService.getAllDenominations(data),
      this.styleService.getAllItems(data),
      this.simpleTabsRefService.getAllItems(data, 'eras'),
      this.simpleTabsRefService.getAllItems(data, 'authors'),
      this.simpleTabsRefService.getAllItems(data, 'propertyStatusCategories'),
      this.simpleTabsRefService.getAllItems(data, 'depositors'),
      this.simpleTabsRefService.getAllItems(data, 'movementTypes'),
      this.simpleTabsRefService.getAllItems(data, 'movementActionTypes'),
      this.simpleTabsRefService.getAllItems(data, 'reportTypes'),
      this.simpleTabsRefService.getAllItems(data, 'actionReportTypes'),
      this.simpleTabsRefService.getAllItems(data, 'ministries'),
      this.simpleTabsRefService.getAllItems(data, 'establishments'),
      this.simpleTabsRefService.getAllItems(data, 'subDivisions'),
      this.simpleTabsRefService.getAllItems(data, 'services'),
      this.simpleTabsRefService.getAllItems(data, 'establishmentTypes'),
      this.simpleTabsRefService.getAllItems(data, 'locationTypes'),
      this.simpleTabsRefService.getAllItems(data, 'regions'),
      this.simpleTabsRefService.getAllItems(data, 'departments'),
      this.simpleTabsRefService.getAllItems(data, 'correspondents'),
      this.simpleTabsRefService.getAllItems(data, 'responsibles'),
      this.simpleTabsRefService.getAllItems(data, 'entryModes'),
    ]).subscribe(
      ([
        fieldsResults,
        denominationResults,
        styleResults,
        // materialTechniquesResults,
        eraResults,
        authorResults,
        categoriesResults,
        depositorsResults,
        movementTypesResults,
        movementActionTypesResults,
        reportTypesResults,
        actionReportTypesResults,
        ministriesResults,
        establishmentsResults,
        subDivisionsResults,
        servicesResults,
        establishmentTypesData,
        locationTypesData,
        regionsData,
        departmentData,
        correspondentsData,
        responsibleData,
        entryModesData,
      ]) => {
        this.domainData = this.getTabRefData(fieldsResults['results']);
        this.denominationData = this.getTabRefData(denominationResults['results']);
        this.styleData = this.getTabRefData(styleResults['results']);
        // this.materialTechniquesData = this.getTabRefData(materialTechniquesResults['results']);
        this.authorData = this.getTabRefData(authorResults['results']);
        this.categoriesData = this.getTabRefData(categoriesResults['results']);
        this.depositorsData = this.getTabRefData(depositorsResults['results']);
        this.eraData = this.getTabRefData(eraResults['results']);
        this.movementTypesData = this.getTabRefData(movementTypesResults['results']);
        this.movementActionTypesData = this.getTabRefData(movementActionTypesResults['results']);
        this.reportTypesData = this.getTabRefData(reportTypesResults['results']);
        this.reportActionTypesData = this.getTabRefData(actionReportTypesResults['results']);
        this.ministryData = this.getTabRefData(ministriesResults['results']);
        this.establishmentData = this.getTabRefData(establishmentsResults['results']);
        this.subDivisionData = this.getTabRefData(subDivisionsResults['results']);
        this.serviceData = this.getTabRefData(servicesResults['results']);
        this.establishmentTypeData = this.getTabRefData(establishmentTypesData['results']);
        this.locationTypeData = this.getTabRefData(locationTypesData['results']);
        this.regionData = this.getTabRefData(regionsData['results']);
        this.departmentsData = this.getTabRefData(departmentData['results']);
        this.correspondentGeographicData = this.getTabRefData(correspondentsData['results']);
        this.correspondentAdministrativeData = this.getTabRefData(responsibleData['results']);
        this.entryModesData = this.getTabRefData(entryModesData['results']);
        this.initColumnsDefinition();
        this.initVisibleCols();
      }
    );
  }

  resetFilter() {}

  search(event: any) {}

  onMultiselectChange(key = 'domaine') {
    let selectedData = this.form1.get(key).value;
    let selectedDataId: any[] = [];
    if (Array.isArray(selectedData)) {
      selectedData.forEach((selectedDataValue: any) => {
        selectedDataId.push(selectedDataValue.id);
      });
    }

    const apiData = {
      page: 1,
      'active[eq]': 1,
    };
    switch (key) {
      case 'domaine':
        let materialApiData = Object.assign({}, apiData);
        apiData['field[in]'] = JSON.stringify(selectedDataId);
        materialApiData['fields'] = JSON.stringify(selectedDataId);
        forkJoin([
          this.denominationsService.getAllDenominations(apiData),
          this.materialTechniqueService.getFilteredMaterialTechnique(materialApiData),
        ]).subscribe(([denominationResults, materialTechniquesResults]) => {
          this.denominationData = this.getTabRefData(denominationResults['results']);
          this.materialTechniquesData = this.getTabRefData(materialTechniquesResults['results']);
        });
        break;
      case 'denomination':
        apiData['denominations'] = JSON.stringify(selectedDataId);
        selectedData = this.form1.get('domaine').value;
        selectedDataId = [];
        if (Array.isArray(selectedData)) {
          selectedData.forEach((selectedDataValue: any) => {
            selectedDataId.push(selectedDataValue.id);
          });
        }

        apiData['field'] = JSON.stringify(selectedDataId);
        this.materialTechniqueService.getFilteredMaterialTechnique(apiData).subscribe((materialTechniquesResults) => {
          this.materialTechniquesData = this.getTabRefData(materialTechniquesResults['results']);
        });

        break;
    }
  }

  onStatusChange(event: any) {
    if (event.value.length == 0) {
      this.depotStatus = true;
      this.propStatus = true;
    } else {
      this.depotStatus = false;
      this.propStatus = false;
      event.value.forEach((item: any) => {
        if (item.id == 'depot') {
          this.depotStatus = true;
        }
        if (item.id == 'propriete') {
          this.propStatus = true;
        }
      });
    }
  }

  initForms() {
    this.initIdentificationForm();
    this.initOperationForm();
    this.initAdministrativeLocationForm();
    this.initGeographicLocationForm();
    this.initIdentificationAdvancedForm();
    this.initStatusForm();
    this.initAdminAdvancedForm();
  }

  initStatusForm() {
    this.formStatus = new FormGroup({
      status: new FormControl(''),
      deposant: new FormControl(''),
      entryDate: new FormControl(''),
      categorie: new FormControl(''),
      entryMode: new FormControl(''),
      arretNumber: new FormControl(''),
      depotDate: new FormControl(''),
    });
  }
  initIdentificationForm() {
    this.form1 = new FormGroup({
      id: new FormControl(''),
      titre: new FormControl(''),
      domaine: new FormControl(''),
      denomination: new FormControl(''),
      auteurs: new FormControl(''),
    });
  }

  initOperationForm() {
    this.form2 = new FormGroup({
      mouvement: new FormControl(''),
      mouvementAction: new FormControl(''),
      constat: new FormControl(''),
      constatAction: new FormControl(''),
      perseption: new FormControl(false),
    });
  }

  initAdministrativeLocationForm() {
    this.form3 = new FormGroup({
      ministry: new FormControl(''),
      etablissement: new FormControl(''),
      sousDirection: new FormControl(''),
      services: new FormControl(''),
      correspondant: new FormControl(''),
    });
  }

  initGeographicLocationForm() {
    this.form4 = new FormGroup({
      localType: new FormControl(''),
      region: new FormControl(''),
      departement: new FormControl(''),
      communes: new FormControl(''),
      batiment: new FormControl(''),
      sites: new FormControl(''),
      level: new FormControl(''),
      pieceNumber: new FormControl(''),
      correspondant: new FormControl(''),
    });
  }
  initAdminAdvancedForm() {
    this.advancedForm3 = new FormGroup({
      establishementType: new FormControl(''),
      establishementTypeOperator: new FormControl('and'),
      responsible: new FormControl(''),
      responsibleOperator: new FormControl('and'),
    });
  }
  initIdentificationAdvancedForm() {
    this.advancedForm1 = new FormGroup({
      materialTechnique: new FormControl(''),
      materialTechniqueOperator: new FormControl('and'),
      style: new FormControl(''),
      styleOperator: new FormControl('and'),
      length: new FormControl(''),
      lengthOperator: new FormControl('and'),
      lengthTotal: new FormControl(''),
      lengthTotalOperator: new FormControl('and'),
      heightTotal: new FormControl(''),
      heightTotalOperator: new FormControl('and'),
      widthTotal: new FormControl(''),
      widthTotalOperator: new FormControl('and'),
      depth: new FormControl(''),
      depthOperator: new FormControl('and'),
      weight: new FormControl(''),
      weightOperator: new FormControl('and'),
      height: new FormControl(''),
      heightOperator: new FormControl('and'),
      width: new FormControl(''),
      widthOperator: new FormControl('and'),
      era: new FormControl(''),
      eraOperator: new FormControl('and'),
      unitNumber: new FormControl(''),
      unitNumberOperator: new FormControl('and'),
      description: new FormControl(''),
      descriptionOperator: new FormControl('and'),
      creationDate: new FormControl(''),
      creationDateOperator: new FormControl('and'),
    });
  }

  initColumnsDefinition() {
    this.frozenCols.push({
      header: 'N° inventaire',
      field: 'id',
      sortable: true,
      filter: true,
      filterType: 'text',
      checkBoxSelection: false,
      type: 'app-remarquer-details-link-render',
    });
    this.columns = [
      {
        header: 'Titre',
        field: 'titre',
        type: 'key',
        width: '150px',
        filter: true,
        filterType: 'text',
        sortable: true,
        isVisible: true,
      },
      {
        header: 'Auteur',
        field: 'authors',
        width: '150px',
        sortable: true,
        filter: true,
        filterType: 'multiselect',
        selectData: this.authorData,
        type: 'key',
        isVisible: true,
      },
      {
        header: 'Date création',
        field: 'creationDate',
        sortable: true,
        width: '150px',
        filter: true,
        type: 'key',
        filterType: 'range-date',
        isVisible: false,
      },
      {
        header: 'Domaine',
        field: 'field',
        sortable: true,
        width: '150px',
        filter: true,
        filterType: 'multiselect',
        placeholder: 'Choisir des Domaine',
        selectData: this.domainData,
        type: 'key',
        isVisible: true,
      },
      {
        header: 'Dénomination',
        field: 'denomination',
        sortable: true,
        width: '150px',
        filter: true,
        filterType: 'multiselect',
        selectData: this.denominationData,
        type: 'key',
        isVisible: false,
      },
      {
        header: 'Matière',
        field: 'materialTechnique',
        sortable: true,
        width: '150px',
        filter: true,
        filterType: 'multiselect',
        selectData: this.materialTechniquesData,
        type: 'key',
        isVisible: false,
      },
      {
        header: 'Style',
        field: 'style',
        sortable: true,
        width: '150px',
        filter: true,
        filterType: 'multiselect',
        selectData: this.styleData,
        type: 'key',
        isVisible: false,
      },
      {
        header: 'Epoque',
        field: 'era',
        width: '150px',
        sortable: true,
        filter: true,
        filterType: 'multiselect',
        selectData: this.eraData,
        type: 'key',
        isVisible: false,
      },

      {
        header: 'Type de Statut',
        field: 'status',
        cellRenderer: 'statusTypeRender',
        width: '200px',
        sortable: false,
        filter: true,
        type: 'app-status-component-render',
        filterType: 'multiselect',
        selectData: this.WorkOfArtService.statusType,
        isVisible: true,
      },
      {
        header: 'deposant',
        field: 'depositor',
        width: '150px',
        sortable: true,
        filter: true,
        filterType: 'multiselect',
        selectData: this.depositorsData,
        type: 'key',
        isVisible: true,
      },
      {
        header: 'Commune',
        field: 'communes',
        width: '150px',
        sortable: true,
        filter: true,
        filterType: 'autoComplete',
        filterTab: 'communes',
        selectData: this.communesData,
        type: 'key',
        isVisible: true,
      },

      {
        header: 'Bâtiment',
        field: 'buildings',
        width: '150px',
        sortable: true,
        filter: true,
        filterType: 'multiselect',
        selectData: this.buildingData,
        type: 'key',
        isVisible: true,
      },
      {
        header: 'photographie',
        field: 'property',
        cellRenderer: 'imageViewer',
        width: '150px',
        sortable: true,
        filter: true,
        type: 'key',
        isVisible: false,
      },
      {
        header: 'Dernier constat de présence',
        field: 'author',
        width: '150px',
        sortable: true,
        filter: true,
        filterType: 'text',
        type: 'key',
        isVisible: false,
      },
      {
        header: 'Dernière action liée au constat',
        field: 'author',
        width: '150px',
        isVisible: false,
      },
      {
        header: 'Dernier mouvement',
        field: 'author',
        width: '150px',
        isVisible: false,
      },
      {
        header: 'Dernière action liée au mouvement',
        field: 'author',
        width: '150px',
        isVisible: false,
      },
      {
        header: 'Visible catalogue',
        field: 'visible',
        cellRenderer: 'visibleRenderer',
        sortable: false,
        filter: false,
        type: 'app-visible-catalog-component-render',
        width: '150px',
        isVisible: false,
      },
    ];
  }

  pagination(e: any) {
    if (e.page < this.artWorksData.totalQuantity / parseInt(this.artWorksData.size.toString(), 0)) {
      this.artWorksData.page = e.page + 1;
    } else {
      this.artWorksData.page = this.artWorksData.totalQuantity / parseInt(this.artWorksData.size.toString(), 0);
    }
    let data = this.formatFormsData({}, [
      this.form1.value,
      this.form2.value,
      this.form3.value,
      this.form4.value,
      this.formStatus.value,
    ]);
    let advancedData = this.formatAdvancedData({}, [this.advancedForm1.value, this.advancedForm3.value]);
    this.headerFilter = this.formatFormsData({}, [this.headerFilter], true);
    this.initData(data, advancedData, this.headerFilter, this.artWorksData.page);
  }

  onAdministratifMultiSelectChange(key: string) {
    let selectedDataId: any[] = [];
    switch (key) {
      case 'ministry':
        let ministriesSelectedData = this.form3.get('ministry').value;
        if (Array.isArray(ministriesSelectedData)) {
          ministriesSelectedData.forEach((selectedDataValue: any) => {
            selectedDataId.push(selectedDataValue.id);
          });
        }
        if (selectedDataId.length > 0) {
          const apiData = {
            page: 1,
            'active[eq]': 1,
          };
          let subDivisionApiData = Object.assign({}, apiData);
          apiData['ministry[in]'] = JSON.stringify(selectedDataId);
          subDivisionApiData['ministry'] = JSON.stringify(selectedDataId);
          forkJoin([
            this.simpleTabsRefService.getAllItems(apiData, 'establishments'),
            this.simpleTabsRefService.getItemsByCriteria(subDivisionApiData, 'subDivisions'),
          ]).subscribe(([establishmentsResults, subDivisionsResults]) => {
            this.establishmentData = this.getTabRefData(establishmentsResults['results']);
            this.subDivisionData = this.getTabRefData(subDivisionsResults['results']);
          });
        }
        break;
      case 'etablissement':
        let establishmentSelectedData = this.form3.get('etablissement').value;
        if (Array.isArray(establishmentSelectedData)) {
          establishmentSelectedData.forEach((selectedDataValue: any) => {
            selectedDataId.push(selectedDataValue.id);
          });
        }
        if (selectedDataId.length > 0) {
          const apiData = {
            page: 1,
            'active[eq]': 1,
          };
          apiData['establishment[in]'] = JSON.stringify(selectedDataId);
          forkJoin([this.simpleTabsRefService.getAllItems(apiData, 'subDivisions')]).subscribe(
            ([subDivisionsResults]) => {
              this.subDivisionData = this.getTabRefData(subDivisionsResults['results']);
            }
          );
        }
        break;
      case 'sousDirection':
        let subDirectionSelectedData = this.form3.get('sousDirection').value;
        if (Array.isArray(subDirectionSelectedData)) {
          subDirectionSelectedData.forEach((selectedDataValue: any) => {
            selectedDataId.push(selectedDataValue.id);
          });
        }
        if (selectedDataId.length > 0) {
          const apiData = {
            page: 1,
            'active[eq]': 1,
          };
          apiData['subDivision[in]'] = JSON.stringify(selectedDataId);
          forkJoin([this.simpleTabsRefService.getAllItems(apiData, 'services')]).subscribe(([servicesResults]) => {
            this.serviceData = this.getTabRefData(servicesResults['results']);
          });
        }
        break;
    }
  }

  filterCommune(event: any) {
    let data = {
      page: 1,
      'active[eq]': 1,
      serializer_group: JSON.stringify(['response', 'short']),
    };
    let query = event.target.value;
    if (query.length >= 2 || event.inputType == 'deleteContentBackward') {
      data['name'] = query;
      data = this.getAPisItems(data, this.form4, 'departement');
      data = this.getAPisItems(data, this.form4, 'region');
      this.simpleTabsRefService.getItemsByCriteria(data, 'communes').subscribe((communesData) => {
        this.communesData = this.getTabRefData(communesData['results']);
      });
    }
  }

  filterDescription(event: any) {
    console.log(event);
    return false;
    // if (event.query.length >= 3 || event.originalEvent.inputType == 'deleteContentBackward') {
    //   this.artWorkService.getAutocompleteData(event.query).subscribe((data) => {
    //     this.descriptionData = data;
    //   });
    // }
  }

  onGeographicLocationChange(event: any, key: string) {
    if (event.query.length > 2) {
      let data = {
        page: 1,
        'active[eq]': 1,
        serializer_group: JSON.stringify(['response', 'short']),
        search: event.query,
      };

      let keys = [];
      switch (key) {
        case 'departement':
          keys = [{ formKey: 'region', tabName: 'departments' }];
          let departementDataApi = Object.assign({}, data);
          keys.forEach((keysData) => {
            departementDataApi = this.getAPisItems(departementDataApi, this.form4, keysData.formKey);
          });
          this.simpleTabsRefService
            .getItemsByCriteria(departementDataApi, 'departments')
            .subscribe((departementData) => {
              this.departmentsData = this.getTabRefData(departementData['results']);
            });
          break;
        case 'communes':
          keys = [
            { formKey: 'departement', tabName: 'communes' },
            { formKey: 'region', tabName: 'departments' },
          ];
          let communeDataApi = Object.assign({}, data);
          keys.forEach((keysData) => {
            communeDataApi = this.getAPisItems(communeDataApi, this.form4, keysData.formKey);
          });
          this.simpleTabsRefService.getItemsByCriteria(communeDataApi, 'communes').subscribe((communeData) => {
            this.communesData = this.getTabRefData(communeData['results']);
          });
          break;
        case 'batiment':
          keys = [
            { formKey: 'departement', tabName: 'communes' },
            { formKey: 'region', tabName: 'departments' },
            { formKey: 'communes', tabName: 'sites' },
          ];
          let buildingDataApi = Object.assign({}, data);
          keys.forEach((keysData) => {
            buildingDataApi = this.getAPisItems(buildingDataApi, this.form4, keysData.formKey);
          });
          this.simpleTabsRefService.getItemsByCriteria(buildingDataApi, 'buildings').subscribe((buildingData) => {
            this.buildingData = this.getTabRefData(buildingData['results']);
          });
          break;
        case 'sites':
          keys = [
            { formKey: 'departement', tabName: 'communes' },
            { formKey: 'region', tabName: 'departments' },
            { formKey: 'communes', tabName: 'sites' },
            { formKey: 'batiment', tabName: 'buildings' },
          ];
          let siteDataApi = Object.assign({}, data);
          keys.forEach((keysData) => {
            siteDataApi = this.getAPisItems(siteDataApi, this.form4, keysData.formKey);
          });
          this.simpleTabsRefService.getItemsByCriteria(siteDataApi, 'sites').subscribe((siteDataApi) => {
            this.siteData = this.getTabRefData(siteDataApi['results']);
          });
          break;
      }
    }
  }

  private getAPisItems(data: any, form: FormGroup, key: string) {
    let itemData = form.value[key];
    let result: any[] = [];
    if (Array.isArray(itemData)) {
      itemData.forEach((item) => {
        result.push(item.id);
      });
    }
    if (result.length > 0) {
      data[key] = JSON.stringify(result);
    }
    return data;
  }
  public requestAutocompleteItems = (text: string) => {
    return this.artWorkService.getAutocompleteData(text, 'description').pipe(map((data) => data));
  };

  onSelectBatiment(event: any) {
    let data = this.getAPisItems({}, this.form4, 'batiment');
    this.roomService.getLevelByBuildings(data['batiment']).subscribe((levelResult) => {
      levelResult.forEach((item) => {
        this.levelData.push({ id: 0, name: item });
      });
    });
  }

  onTitreChange(event: any) {
    this.artWorkService.getAutocompleteData(event.query, 'title').subscribe((titleResult) => {
      this.titleData = titleResult;
    });
  }

  onMaterialTechniqueComplete($event: any) {
    let selectedDomaineData = this.form1.get('domaine').value;
    let selectedDenominationData = this.form1.get('denomination').value;
    const apiData = {
      page: 1,
      'active[eq]': 1,
    };
    let selectedDataId: any[] = [];
    if (Array.isArray(selectedDomaineData)) {
      selectedDomaineData.forEach((selectedDataValue: any) => {
        selectedDataId.push(selectedDataValue.id);
      });
      apiData['fields'] = JSON.stringify(selectedDataId);
    }
    selectedDataId = [];
    if (Array.isArray(selectedDenominationData)) {
      selectedDenominationData.forEach((selectedDataValue: any) => {
        selectedDataId.push(selectedDataValue.id);
      });
      apiData['denominations'] = JSON.stringify(selectedDataId);
    }
    this.materialTechniqueService.getFilteredMaterialTechnique(apiData).subscribe((materialTechniquesResults) => {
      this.materialTechniquesData = this.getTabRefData(materialTechniquesResults['results']);
    });
  }

  //Print notice to pdf
  PrinNoticePDF() {
    this.printingNotice = true;
    let title: string = 'Détails_notices.pdf';
    if (this.selectedRowCount == 1) {
      title = this.selectedRows[0].titre;
    }
    const element = document.getElementById('printNoticesPDF');
    this.pdfGeneratorService.downloadPDFFromHTML(element, title);
    this.printingNotice = false;
  }

  onSelectEtage() {
    let selectedLevelData = this.form4.get('level').value;
    let selectedBuildingData = this.form4.get('batiment').value;
    let selectedLevelId: any[] = [];
    let selectedBuildingId: any[] = [];
    if (Array.isArray(selectedLevelData)) {
      selectedLevelData.forEach((selectedDataValue: any) => {
        selectedLevelId.push(selectedDataValue.name);
      });
    }
    if (Array.isArray(selectedBuildingData)) {
      selectedBuildingData.forEach((selectedDataValue: any) => {
        selectedBuildingId.push(selectedDataValue.id);
      });
    }
    console.log(selectedLevelId, selectedBuildingId);
    this.requestService
      .getPiecesNumbers({
        building: selectedBuildingId,
        level: selectedLevelId,
      })
      .subscribe((roomData) => {
        let resultData: any[] = [];
        roomData.forEach((room: any, index: any) => {
          resultData.push({ id: index + 1, name: room });
        });
        this.roomData = resultData;
      });
  }

  changeMode(mode: string) {
    this.mode = mode;
    this.selectedRows = [];
    this.selectedRowCount = 0;
    if (this.showDatatable) {
      let data = this.formatFormsData({}, [
        this.form1.value,
        this.form2.value,
        this.form3.value,
        this.form4.value,
        this.formStatus.value,
      ]);
      let advancedData = this.formatAdvancedData({}, [this.advancedForm1.value, this.advancedForm3.value]);
      this.headerFilter = this.formatFormsData({}, [this.headerFilter], true);
      this.loading = true;
      this.firstLoading = true;
      this.initData(data, advancedData, this.headerFilter, 1);
      this.showDatatable = true;
    }
  }
  selectedValues: string[] = [];
  selectOeuvre(item: any, index: number) {
    item.active = !item.active;
    if (item.active) {
      this.selectedRows.push(item);
    } else {
      this.selectedRows = this.selectedOeuvres.filter((oeuvre) => {
        return oeuvre.id !== item.id;
      });
    }
    this.selectedRowCount = this.selectedRows.length;
  }

  throttle = 300;
  scrollDistance = 2;
  scrollUpDistance = 1;
  direction = '';
  page = 1;
  loadingScroll: boolean = false;
  onScrollDown() {
    this.page++;
    let data = this.formatFormsData({}, [
      this.form1.value,
      this.form2.value,
      this.form3.value,
      this.form4.value,
      this.formStatus.value,
    ]);
    let advancedData = this.formatAdvancedData({}, [this.advancedForm1.value, this.advancedForm3.value]);
    this.headerFilter = this.formatFormsData({}, [this.headerFilter], true);
    this.loadingScroll = true;
    this.initData(data, advancedData, this.headerFilter, this.page);
    this.showDatatable = true;
  }

  exportNotices(type: string) {
    //Show the loader.
    this.firstLoading = true;
    this.loading = true;

    //get artwork's to get theire PDF.
    let artWorkids = [];
    if (this.selectedRowCount) {
      artWorkids = this.artWorkService.getArtWorkIds(this.selectedRows);
    } else {
      artWorkids = this.artWorkService.getArtWorkIds(this.artWorkResults);
    }

    let dataTosend = {
      notices: artWorkids,
      sort: this.dataTableSort.hasOwnProperty('sort') ? this.dataTableSort['sort'] : 'asc',
      sortBy: this.dataTableSort.hasOwnProperty('sort_by') ? this.dataTableSort['sort_by'] : 'id',
    };
    this.requestService.exportNotices(dataTosend, type).subscribe((response: Response | any) => {
      this.requestService.manageFileResponseDownload(response, type);

      this.firstLoading = false;
      this.loading = false;
    });
  }

  duplicate() {
    this.exportingNotice = true;
    let artWork = this.selectedRows[0];
    WorkOfArtService;
    this.router.navigate(['creation-notice', artWork.status], { queryParams: { id: artWork.id } });
    this.exportingNotice = false;
  }

  formsReset() {
    this.formStatus.reset({
      status: [],
      deposant: [],
      entryDate: '',
      categorie: [],
      entryMode: [],
      arretNumber: '',
      depotDate: '',
    });
    this.form1.reset({
      id: '',
      titre: '',
      domaine: [],
      denomination: [],
      auteurs: [],
    });
    this.form2.reset({
      mouvement: [],
      mouvementAction: [],
      constat: [],
      constatAction: [],
      perseption: false,
    });
    this.form3.reset({
      ministry: [],
      etablissement: [],
      sousDirection: [],
      services: [],
      correspondant: [],
    });
    this.form4.reset({
      localType: [],
      region: [],
      departement: [],
      communes: [],
      batiment: [],
      sites: [],
      level: [],
      pieceNumber: [],
      correspondant: [],
    });
    this.advancedForm3.reset({
      establishementType: [],
      establishementTypeOperator: [],
      responsible: [],
      responsibleOperator: [],
    });
    this.advancedForm1.reset({
      materialTechnique: [],
      materialTechniqueOperator: 'and',
      style: [],
      styleOperator: 'and',
      length: '',
      lengthOperator: 'and',
      lengthTotal: '',
      lengthTotalOperator: 'and',
      heightTotal: '',
      heightTotalOperator: 'and',
      widthTotal: '',
      widthTotalOperator: 'and',
      depth: '',
      depthOperator: 'and',
      weight: '',
      weightOperator: 'and',
      height: '',
      heightOperator: 'and',
      width: '',
      widthOperator: 'and',
      era: [],
      eraOperator: 'and',
      unitNumber: '',
      unitNumberOperator: 'and',
      description: '',
      descriptionOperator: 'and',
      creationDate: '',
      creationDateOperator: 'and',
    });
    console.log('filter reset');
    const data = this.formatFormsData({}, [
      this.form1.value,
      this.form2.value,
      this.form3.value,
      this.form4.value,
      this.formStatus.value,
    ]);
    this.searchQuery = '';
    this.globalSearch = '';
    const advancedData = this.formatAdvancedData({}, [this.advancedForm1.value, this.advancedForm3.value]);
    if (this.mode === 'pictures') {
      this.firstLoading = true;
    }
    this.initData(data, advancedData, {}, this.page);
  }
}
