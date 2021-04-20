import { Component, OnInit, Output, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CustomHeaderRendererComponent } from '@shared/components/datatables/custom-header-renderer/custom-header-renderer.component';
import { OPERATORS, TYPES } from '@shared/services/column-filter.service';
import { ColumnApi, GridApi, GridOptions, ICellEditorParams } from 'ag-grid-community';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { WorkOfArtService } from '@shared/services/work-of-art.service';
import { DenominationsActionsRendererComponent } from '@shared/components/datatables/denominations-actions-renderer/denominations-actions-renderer.component';
import { IDropdownSettings } from 'ng-multiselect-dropdown';

@Component({
  selector: 'app-denominations',
  templateUrl: './denominations.component.html',
  styleUrls: ['./denominations.component.scss'],
})
export class DenominationsComponent implements OnInit {
  @ViewChild('content')
  private modalRef: TemplateRef<any>;

  private myModal: any;
  selectedDenomination: string;
  selectedDomain: any;
  denominationToDelete: string;
  denominationForm: FormGroup;
  editDenomination: boolean = false;
  addDenomination: boolean = false;
  deleteDenomination: boolean = false;
  dropdownSettings: IDropdownSettings;
  domains: any;

  frameworkComponents = {
    customHeader: CustomHeaderRendererComponent,
    gridActionRenderer: DenominationsActionsRendererComponent,
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
  };
  denominations: any;

  columns = [
    {
      header: 'Libellé',
      field: 'name',
      type: 'key',
      filter: true,
      filterType: 'text',
      sortable: true,
    },
    {
      header: 'Actions',
      field: 'action',
      type: 'app-actions-cell',
      sortable: false,
      filter: false,
      width: '300px',
    },
  ];
  pinnedCols: string[] = ['action'];
  leftPinnedCols: string[] = ['id'];

  gridApi: GridApi;
  gridColumnApi: ColumnApi;
  gridReady = false;
  rowCount: any = 5;
  filter: boolean = false;

  constructor(
    private router: Router,
    private modalService: NgbModal,
    private activatedRoute: ActivatedRoute,
    private WorkOfArtService: WorkOfArtService,
    public fb: FormBuilder,
    config: NgbModalConfig
  ) {
    config.backdrop = 'static';
    config.keyboard = false;
  }
  initForm() {
    this.denominationForm = this.fb.group({
      domain: [this.selectedDomain, [Validators.required]],
      denomination: [this.selectedDenomination, [Validators.required]],
    });
  }
  get defaultHeaderParams() {
    return this.defaultColDef.headerComponentParams;
  }
  ngOnInit(): void {
    this.domains = this.WorkOfArtService.domaine;
    this.dropdownSettings = {
      singleSelection: false,
      idField: 'id',
      textField: 'name',
      selectAllText: 'Sélectionner tout',
      unSelectAllText: 'Supprimer les sélections',
      itemsShowLimit: 1,
      allowSearchFilter: true,
    };
    this.initForm();
    this.denominations = this.WorkOfArtService.denominations;
    this.filter =
      this.activatedRoute.snapshot.queryParams['filter'] &&
      this.activatedRoute.snapshot.queryParams['filter'].length > 0;
  }

  onGridReady(params: ICellEditorParams) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    this.gridReady = true;
  }
  onRowCountChange(event: Event) {
    // @ts-ignore
    this.rowCount = event.target.value;
    this.gridApi.paginationSetPageSize(Number(this.rowCount));
  }

  resetFilter() {}

  openModal(domain: any) {
    if (domain) {
      this.editDenomination = true;
    } else {
      this.addDenomination = true;
    }

    console.log(domain);
    this.selectedDenomination = domain.name;
    this.initForm();
    this.myModal = this.modalService.open(this.modalRef, { centered: true });
  }
  submit() {
    console.log(this.denominationForm.value.domain);
  }
  close() {
    this.editDenomination = false;
    this.addDenomination = false;
    this.deleteDenomination = false;
    this.myModal.close('Close click');
    this.myModal.dismiss('Cross click');
  }
  deleteItem(data: any) {
    this.deleteDenomination = true;
    this.denominationToDelete = data.name;
    this.myModal = this.modalService.open(this.modalRef, { centered: true });
  }

  onDomainSelect(item: any) {
    console.log(item);
  }
  onSelectAll(items: any) {}

  actionMethod(e: any) {
    console.log(e);
    switch (e.method) {
      case 'delete':
        this.deleteItem(e.item);
        break;
      case 'edit':
        this.openModal(e.item);
        break;
      default:
        this.close();
    }
  }
}
