import { RemarquerDetailsLinkRendererComponent } from '@shared/components/datatables/remarquer-details-link-renderer/remarquer-details-link-renderer.component';
import { Router } from '@angular/router';
import { VisibleCatalogRendererComponent } from '@shared/components/datatables/visible-catalog-renderer/visible-catalog-renderer.component';
import { WorkOfArtService } from '@shared/services/work-of-art.service';
import {
  ColDef,
  ColumnApi,
  GridApi,
  ICellEditorParams,
  Column,
  GridOptions,
  CellClickedEvent,
  SelectionChangedEvent,
} from 'ag-grid-community';
import { Component, ElementRef, EventEmitter, OnInit, QueryList, ViewChildren } from '@angular/core';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { ColumnFilterService, OPERATORS, TYPES } from '@shared/services/column-filter.service';
import { ColumnFilterModel } from '@shared/models/column-filter-model';
import { CustomHeaderRendererComponent } from '@app/@shared/components/datatables/custom-header-renderer/custom-header-renderer.component';
import { first } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import { GridActionRendererComponent } from '@app/@shared/components/datatables/grid-action-renderer/grid-action-renderer.component';
import { StatusTypeRenderComponent } from '@shared/components/datatables/status-type-render/status-type-render.component';
import { Options } from '@angular-slider/ngx-slider';
import { IDropdownSettings } from 'ng-multiselect-dropdown';

@Component({
  selector: 'app-list-work-of-arts',
  templateUrl: './list-work-of-arts.component.html',
  styleUrls: ['./list-work-of-arts.component.scss'],
})
export class ListWorkOfArtsComponent implements OnInit {
  @ViewChildren('accordionSectionDOM', { read: ElementRef }) accordionsDOM: QueryList<ElementRef>;
  isCollapsed = true;
  showDatatable = false;
  data = false;
  mode = 'liste';
  filterFormGroup: FormGroup;
  columnDropped = new EventEmitter();
  columnDroppedSubscription: Subscription;
  showInventoryRange = false;
  frameworkComponents = {
    customHeader: CustomHeaderRendererComponent,
    gridActionRenderer: GridActionRendererComponent,
    visibleRenderer: VisibleCatalogRendererComponent,
    detailsLink: RemarquerDetailsLinkRendererComponent,
    statusTypeRender: StatusTypeRenderComponent,
  };
  defaultColDef = {
    headerComponent: 'customHeader',
    sortable: true,
    filter: true,
    resizable: true,
    headerValueGetter: (params: any) => {
      return params.colDef.headerName;
    },
    headerComponentParams: {
      menuIcon: 'fa-filter',
      operator: OPERATORS.like,
      type: TYPES.text,
    },
  };
  gridOptions: GridOptions = {
    suppressLoadingOverlay: false,
    suppressScrollOnNewData: true,
    onDragStopped: () => {
      this.columnDropped.next();
    },
    onColumnMoved: (_) => {
      if (this.columnDroppedSubscription) {
        this.columnDroppedSubscription.unsubscribe();
      }
      this.columnDroppedSubscription = this.columnDropped.pipe(first()).subscribe(() => {
        this.updateColumnsConfiguration();
      });
    },
  };
  oeuvres = this.WorkOfArtService.oeuvres;

  ColDef: ColDef[] = [
    {
      cellClass: 'link',
      headerName: 'N° inventaire',
      field: 'id',
      cellRenderer: 'detailsLink',
      checkboxSelection: true,
      headerCheckboxSelection: true,
      sortable: false,
      filter: false,
      width: 70,
    },
    {
      headerName: 'Titre',
      field: 'titre',
    },
    {
      headerName: 'Date création',
      field: 'creationDate',
      headerComponentParams: {
        ...this.defaultHeaderParams,
        type: TYPES.date,
        operator: OPERATORS.in,
      },
    },
    {
      headerName: 'Domaine',
      field: 'domaine',
      headerComponentParams: {
        ...this.defaultHeaderParams,
        type: TYPES.list,
        list: this.WorkOfArtService.domaine,
        operator: OPERATORS.in,
      },
    },
    {
      headerName: 'Dénomination',
      field: 'denomination',
    },
    {
      headerName: 'Matière',
      field: 'matiere',
    },
    {
      headerName: 'Style',
      field: 'style',
    },
    {
      headerName: 'Epoque',
      field: 'epoque',
    },
    {
      headerName: 'Auteur',
      field: 'author',
    },
    {
      headerName: 'Dernier constat de présence',
      field: 'author',
    },
    {
      headerName: 'Dernière action liée au constat',
      field: 'author',
    },
    {
      headerName: 'Dernier mouvement',
      field: 'author',
    },
    {
      headerName: 'Dernière action liée au mouvement',
      field: 'author',
    },
    {
      headerName: 'Visible catalogue',
      field: 'visible',
      cellRenderer: 'visibleRenderer',
      sortable: false,
      filter: false,
      width: 110,
    },
    {
      headerName: 'Actions',
      field: 'action',
      cellRenderer: 'gridActionRenderer',
      sortable: false,
      filter: false,
      width: 130,
    },
  ];
  pinnedCols: string[] = ['action'];
  leftPinnedCols: string[] = ['id'];
  selectedRowCount = 0;
  gridApi: GridApi;
  gridColumnApi: ColumnApi;
  inventoryOptions: Options;
  gridReady = false;
  currentColumnStates: any;
  columns: any;
  currentFilters: ColumnFilterModel[] = [];
  currentOrderedFields: { column: string; direction: string }[] = [];
  paginatorLoading: boolean;
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
  constructor(
    private fb: FormBuilder,
    public columnFilterService: ColumnFilterService,
    public WorkOfArtService: WorkOfArtService,
    private router: Router
  ) {}

  get defaultHeaderParams() {
    return this.defaultColDef.headerComponentParams;
  }

  ngOnInit(): void {
    this.oeuvreToShow = this.oeuvres[0].items;
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
    this.form1 = new FormGroup({
      inventory: new FormControl(''),
      title: new FormControl(''),
      domaine: new FormControl(''),
      denomination: new FormControl(''),
      author: new FormControl(''),
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
    this.gridOptions.tooltipShowDelay = 0;
    this.inventoryOptions = {
      floor: 0,
      ceil: 9999,
    };
  }

  onGridReady(params: ICellEditorParams) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    this.gridReady = true;
    this.currentColumnStates = this.gridColumnApi.getColumnState();

    this.columns = this.gridColumnApi.getAllColumns();
    this.columns.splice(0, 2);
  }

  onRowSelected(event: any) {
    if (event.node.selected == true) {
      this.selectedRowCount++;
    }
    if (event.node.selected == false) {
      this.selectedRowCount--;
    }
  }

  onHeaderToggle(column: Column): void {
    // hide column and reset filters
    this.gridColumnApi.setColumnVisible(column.getColId(), !column.isVisible());
    // this.gridApi.sizeColumnsToFit();
    this.gridApi.setFilterModel(null);
    this.updateColumnsConfiguration('visibility');
  }

  initFilterFormGroup() {
    this.filterFormGroup = this.fb.group({
      titre: '',
    });
  }

  updateColumnsConfiguration(type: string = 'position') {
    let successMessage: string;
    let errorMessage: string;
    if (type === 'position') {
      successMessage = 'actions.update_column_order_success';
      errorMessage = 'actions.update_column_order_error';
    } else {
      successMessage = 'actions.update_column_order_visibility_success';
      errorMessage = 'actions.update_column_order_visibility_error';
    }
    this.currentColumnStates = this.gridColumnApi.getColumnState();
  }

  updateFilteredData(columnFilters: ColumnFilterModel[]) {
    this.currentFilters = this.columnFilterService.updateCurrentFilter(this.currentFilters, columnFilters);
    columnFilters.forEach((value: any) => {
      this.oeuvreToShow = this.oeuvreToShow.filter((oeuvre: any) => {
        let column = value.column;
        if (value.value instanceof Array) {
          return oeuvre[column].toUpperCase().includes(value.value[0].toUpperCase());
        } else {
          return oeuvre[column].toUpperCase().includes(value.value.toUpperCase());
        }
      });
    });
  }

  updateSortedData(column: string, direction: string) {
    this.currentOrderedFields = [{ column, direction }];
  }

  getOrdersData(page: number = 1) {
    this.paginatorLoading = true;
    if (this.gridApi) {
      this.gridApi.showLoadingOverlay();
    }
  }

  search(event?: any) {
    if (event.target.value.length > 0) {
      this.oeuvreToShow = this.oeuvres.filter((x: any) =>
        x.titre.toUpperCase().includes(event.target.value.toUpperCase())
      );
    } else {
      this.oeuvreToShow = this.oeuvres;
    }
  }

  resetFilter() {
    this.oeuvreToShow = this.oeuvres;
  }

  openCollapse() {
    this.isCollapsed = !this.isCollapsed;
  }

  onCellClicked(event: any) {
    if (event.column.colId == 'FirstName') {
      // only first column clicked
      // execute the action as you want here in on click of hyperlink
    }
  }

  //add movable objects
  addPropertyMovableObject() {
    this.router.navigate(['add-property-remarquer']);
  }

  addDepositMovableObject() {}

  //validate request value
  inventoryValue = 0;
  hightInventoryValue = 60;
  inventaire: any = '';
  firstSearchDrop = false;
  secondSearchDrop = false;
  thirdSearchDrop = false;
  fourthSearchDrop = false;

  onValidateRequest(value: boolean) {
    if (value) {
      this.showDatatable = true;
      this.isCollapsed = false;
      this.collapse();
    }
  }

  onRowCountChange(event: Event) {
    // @ts-ignore
    this.rowCount = event.target.value;
    this.gridApi.paginationSetPageSize(Number(this.rowCount));
  }

  collapse() {
    this.accordionsDOM.forEach((el) => {
      el.nativeElement.querySelector('.btn-collapse').click();
    });
  }

  onSelectAll(items: any) {}

  onDomainSelect(item: any) {}

  onItemSelect($event: any) {}

  onValueChange(event: any) {
    this.inventaire = event.target.value + event.key;
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
    if (['string', 'boolean'].indexOf(typeof val[key]) == -1) {
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
}
