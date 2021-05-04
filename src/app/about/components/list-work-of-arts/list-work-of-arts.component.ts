import { Router } from '@angular/router';
import { WorkOfArtService } from '@shared/services/work-of-art.service';
import { ColumnApi, GridApi } from 'ag-grid-community';
import { Component, ElementRef, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
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
  showDatatable = true;
  data = false;
  mode = 'liste';
  filterFormGroup: FormGroup;
  showInventoryRange = false;

  oeuvres = this.WorkOfArtService.oeuvres[0].items;
  frozenCols: any = [];
  columns: any[];
  selectedRowCount = 0;
  gridApi: GridApi;
  gridColumnApi: ColumnApi;
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
  correspondentData: any[] = [];
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

  constructor(
    private fb: FormBuilder,
    public columnFilterService: ColumnFilterService,
    public WorkOfArtService: WorkOfArtService,
    private datePipe: DatePipe,
    private router: Router,
    private artWorkService: ArtWorkService,
    private fieldService: FieldsService,
    private denominationsService: DenominationsService,
    private styleService: StylesService,
    private simpleTabsRefService: SimpleTabsRefService,
    private messageService: MessageService,
    private materialTechniqueService: MaterialTechniqueService
  ) {}

  initData(filter: any, advancedFilter: any, headerFilters: any = {}, page = 1) {
    this.loading = true;
    this.artWorkService.getArtWorksData(filter, advancedFilter, headerFilters, page).subscribe(
      (artWorksData: ArtWorksDataModel) => {
        this.artWorksData = artWorksData;
        this.start = (this.artWorksData.page - 1) * this.artWorksData.size + 1;
        this.end = (this.artWorksData.page - 1) * this.artWorksData.size + this.artWorksData.results.length;
        this.loading = false;
      },
      (error: any) => {
        this.addSingle('error', '', error.error.message);
      }
    );
  }

  addSingle(type: string, sum: string, msg: string) {
    this.messageService.add({ severity: type, summary: sum, detail: msg });
  }

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
    this.inventoryOptions = {
      floor: 0,
      ceil: 9999,
    };
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
    const advancedForms = this.formatAdvancedData({}, [this.advancedForm1.value]);
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

  formatAdvancedData(data: any, values: any[]) {
    values.forEach((value) => {
      data = this.getDataFromAdvancedForm(data, value);
    });
    return data;
  }
  getDataFromHeadersForm(data: any, value: any) {
    console.log(value);
    Object.keys(value).forEach((key) => {
      let result: any[] = [];
      switch (key) {
        case 'domaine':
        case 'denomination':
        case 'materialTechnique':
        case 'style':
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
        case 'constatAction':
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
    }
    if (event == false) {
      this.showDatatable = true;
      let data = this.formatFormsData({}, [
        this.form1.value,
        this.form2.value,
        this.form3.value,
        this.form4.value,
        this.formStatus.value,
      ]);
      let advancedData = this.formatAdvancedData({}, [this.advancedForm1.value]);
      this.headerFilter = this.formatFormsData({}, [this.headerFilter], true);
      this.initData(data, advancedData, this.headerFilter);
    }
  }

  private onChanges() {
    this.onForm1Change();
    this.onForm2Change();
    this.onForm3Change();
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

        this.showForm1End = count > 4;
      });
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

  onSearchClick() {
    this.showDatatable = true;
  }

  fromDate: NgbDate | null;
  toDate: NgbDate | null;
  hoveredDate: NgbDate | null = null;
  openImg: boolean = false;
  imageUrl: string;

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
      console.log(this.datePipe.transform(new Date(event.getFullYear()), 'yyyy'));

      this.form1.controls['date'].setValue(event.getFullYear());
      console.log(this.form1.value);
    }
  }

  onRowsSelection(data: any) {
    if (Array.isArray(data)) {
      this.selectedRowCount = data.length;
    }
  }

  private initVisibleCols() {
    this.columns.forEach((data, index) => {
      this.visibleCol.push({
        header: data.header,
        field: data.field,
        isVisible: true,
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
      this.simpleTabsRefService.getAllItems(data, 'materialTechniques'),
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
      this.simpleTabsRefService.getAllItems(data, 'communes'),
      this.simpleTabsRefService.getAllItems(data, 'buildings'),
      this.simpleTabsRefService.getAllItems(data, 'sites'),
      this.simpleTabsRefService.getAllItems(data, 'entryModes'),
    ]).subscribe(
      ([
        fieldsResults,
        denominationResults,
        styleResults,
        materialTechniquesResults,
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
        communesData,
        buildingsData,
        sitesData,
        entryModesData,
      ]) => {
        this.domainData = this.getTabRefData(fieldsResults['results']);
        this.denominationData = this.getTabRefData(denominationResults['results']);
        this.styleData = this.getTabRefData(styleResults['results']);
        this.materialTechniquesData = this.getTabRefData(materialTechniquesResults['results']);
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
        this.communesData = this.getTabRefData(communesData['results']);
        this.buildingData = this.getTabRefData(buildingsData['results']);
        this.siteData = this.getTabRefData(sitesData['results']);
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
        materialApiData['field'] = JSON.stringify(selectedDataId);
        forkJoin([
          this.denominationsService.getAllDenominations(apiData),
          this.materialTechniqueService.getFilteredMaterialTechnique(materialApiData),
        ]).subscribe(([denominationResults, materialTechniquesResults]) => {
          this.denominationData = this.getTabRefData(denominationResults['results']);
          this.materialTechniquesData = this.getTabRefData(materialTechniquesResults['results']);
        });
        break;
      case 'denomination':
        apiData['denomination'] = JSON.stringify(selectedDataId);
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
      direction: new FormControl(''),
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
      pieceNumber: new FormControl(''),
      correspondant: new FormControl(''),
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
        header: 'Date création',
        field: 'creationDate',
        sortable: true,
        width: '150px',
        filter: true,
        type: 'key',
        filterType: 'range-date',
        isVisible: true,
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
        isVisible: true,
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
        isVisible: true,
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
        isVisible: true,
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
        header: 'photographie',
        field: 'property',
        cellRenderer: 'imageViewer',
        width: '150px',
        sortable: true,
        filter: true,
        type: 'key',
        isVisible: true,
      },
      {
        header: 'Dernier constat de présence',
        field: 'author',
        width: '150px',
        sortable: true,
        filter: true,
        filterType: 'text',
        type: 'key',
        isVisible: true,
      },
      {
        header: 'Dernière action liée au constat',
        field: 'author',
        width: '150px',
        isVisible: true,
      },
      {
        header: 'Dernier mouvement',
        field: 'author',
        width: '150px',
        isVisible: true,
      },
      {
        header: 'Dernière action liée au mouvement',
        field: 'author',
        width: '150px',
        isVisible: true,
      },
      {
        header: 'Visible catalogue',
        field: 'visible',
        cellRenderer: 'visibleRenderer',
        sortable: false,
        filter: false,
        type: 'app-visible-catalog-component-render',
        width: '150px',
        isVisible: true,
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
    let advancedData = this.formatAdvancedData({}, [this.advancedForm1.value]);
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
}
