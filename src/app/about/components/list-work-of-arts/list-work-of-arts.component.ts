import { RemarquerDetailsLinkRendererComponent } from '@shared/components/datatables/remarquer-details-link-renderer/remarquer-details-link-renderer.component';
import { Router } from '@angular/router';
import { VisibleCatalogRendererComponent } from '@shared/components/datatables/visible-catalog-renderer/visible-catalog-renderer.component';
import { WorkOfArtService } from '@shared/services/work-of-art.service';
import { ColDef, ColumnApi, GridApi, GridOptions, ICellEditorParams } from 'ag-grid-community';
import { Component, ElementRef, EventEmitter, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ColumnFilterService, OPERATORS, TYPES } from '@shared/services/column-filter.service';
import { ColumnFilterModel } from '@shared/models/column-filter-model';
import { CustomHeaderRendererComponent } from '@app/@shared/components/datatables/custom-header-renderer/custom-header-renderer.component';
import { first } from 'rxjs/operators';
import { forkJoin, Subscription } from 'rxjs';
import { GridActionRendererComponent } from '@app/@shared/components/datatables/grid-action-renderer/grid-action-renderer.component';
import { StatusTypeRenderComponent } from '@shared/components/datatables/status-type-render/status-type-render.component';
import { Options } from '@angular-slider/ngx-slider';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { NgbDate } from '@ng-bootstrap/ng-bootstrap';
import { ImageViewerComponent } from '@shared/components/datatables/image-viewer/image-viewer.component';
import { DatePipe } from '@angular/common';
import { NgDataTableComponent } from '@shared/components/ng-dataTables/ng-data-table/ng-data-table.component';
import { ArtWorkService } from '@app/about/services/art-work.service';
import ArtWorksDataModel from '@app/about/models/art-works-model';
import { FieldsService } from '@shared/services/fields.service';
import { DenominationsService } from '@shared/services/denominations.service';
import { StylesService } from '@shared/services/styles.service';
import { SimpleTabsRefService } from '@shared/services/simple-tabs-ref.service';
import { MaterialTechniqueService } from '@shared/services/material-technique.service';

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
  frozenCols: any = [
    {
      header: 'N° inventaire',
      field: 'id',
      sortable: true,
      filter: true,
      filterType: 'text',
      checkBoxSelection: false,
      type: 'app-remarquer-details-link-render',
    },
  ];
  columns: any[] = [
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
      selectData: this.WorkOfArtService.domaine,
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
      selectData: this.WorkOfArtService.denominations,
      type: 'key',
      isVisible: true,
    },
    {
      header: 'Matière',
      field: 'materialTechnique',
      sortable: true,
      width: '150px',
      filter: true,
      filterType: 'text',
      type: 'key',
      isVisible: true,
    },
    {
      header: 'Style',
      field: 'style',
      sortable: true,
      width: '150px',
      filter: true,
      filterType: 'text',
      type: 'key',
      isVisible: true,
    },
    {
      header: 'Epoque',
      field: 'era',
      width: '150px',
      sortable: true,
      filter: true,
      filterType: 'text',
      type: 'key',
      isVisible: true,
    },
    {
      header: 'Auteur',
      field: 'authors',
      width: '150px',
      sortable: true,
      filter: true,
      filterType: 'text',
      type: 'key',
      isVisible: true,
    },
    {
      header: 'Type de Statut',
      field: 'statusType',
      cellRenderer: 'statusTypeRender',
      width: '200px',
      sortable: false,
      filter: true,
      type: 'app-status-component-render',
      filterType: 'select',
      selectData: this.WorkOfArtService.statusType,
      isVisible: true,
    },
    {
      header: 'deposant',
      field: 'depositor',
      width: '150px',
      sortable: true,
      filter: true,
      filterType: 'text',
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
    private materialTechniqueService: MaterialTechniqueService
  ) {}

  initData(filter: any, advancedFilter: any, headerFilters: any = {}) {
    this.artWorkService
      .getArtWorksData(filter, advancedFilter, headerFilters)
      .subscribe((artWorksData: ArtWorksDataModel) => {
        this.artWorksData = artWorksData;
      });
  }

  ngOnInit(): void {
    // this.initData({}, {}, this.headerFilter);
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
    this.initVisibleCols(this.columns);
    this.form1 = new FormGroup({
      id: new FormControl(''),
      titre: new FormControl(''),
      domaine: new FormControl(''),
      denomination: new FormControl(''),
      auteurs: new FormControl(''),
      // date: new FormControl(''),
    });
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
    });
    this.form2 = new FormGroup({
      mouvement: new FormControl(''),
      mouvementAction: new FormControl(''),
      constat: new FormControl(''),
      constatAction: new FormControl(''),
      perseption: new FormControl(false),
    });
    this.form3 = new FormGroup({
      ministry: new FormControl(''),
      etablissement: new FormControl(''),
      direction: new FormControl(''),
      sousDirection: new FormControl(''),
      services: new FormControl(''),
      correspondant: new FormControl(''),
    });
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
    const forms = this.formatFormsData({}, [this.form1.value, this.form2.value, this.form3.value, this.form4.value]);
    const advancedForms = this.formatAdvancedData({}, [this.advancedForm1.value]);
    this.headerFilter = this.formatFormsData({}, [headersFilter]);
    // this.initData(forms, advancedForms, this.headerFilter);
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

  formatFormsData(data: any, values: any[]) {
    values.forEach((value) => {
      data = this.getDataFromForm(data, value);
    });
    return data;
  }

  formatAdvancedData(data: any, values: any[]) {
    values.forEach((value) => {
      data = this.getDataFromAdvancedForm(data, value);
    });
    return data;
  }

  getDataFromAdvancedForm(data: any, value: any) {
    Object.keys(value).forEach((key) => {
      if (!key.includes('Operator')) {
        if (
          value[key] != '' ||
          ['length', 'height', 'width', 'depth', 'weight', 'lengthTotal', 'heightTotal', 'widthtTotal'].includes(key)
        ) {
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
            case 'widthtTotal':
              if (
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
          }
        }
      }
    });
    return data;
  }

  getDataFromForm(data: any, value: any) {
    Object.keys(value).forEach((key) => {
      switch (key) {
        case 'domaine':
        case 'denomination':
        case 'auteurs':
          let result: any[] = [];
          if (Array.isArray(value[key])) {
            value[key].forEach((item: any) => {
              result.push(item['id']);
            });
          }
          data[key] = result;
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
    // console.log(this.advancedForm1.value);
    // return false;
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
      let data = this.formatFormsData({}, [this.form1.value, this.form2.value, this.form3.value, this.form4.value]);
      let advancedData = this.formatAdvancedData({}, [this.advancedForm1.value]);
      this.initData(data, advancedData, this.headerFilter);
    }
  }

  onTitleChange(event: any) {
    this.title = event.target.value + event.key;
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

  private initVisibleCols(columns: any[]) {
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
        console.log(materialApiData);
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
}
