import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { CustomHeaderRendererComponent } from '@shared/components/datatables/custom-header-renderer/custom-header-renderer.component';
import { DomainsActionsRendererComponent } from '@shared/components/datatables/domains-actions-renderer/domains-actions-renderer.component';

import { OPERATORS, TYPES } from '@shared/services/column-filter.service';
import { ColumnApi, GridApi, GridOptions, ICellEditorParams } from 'ag-grid-community';
import { ActivatedRoute, Router } from '@angular/router';
import { WorkOfArtService } from '@shared/services/work-of-art.service';
import { BsModalService, ModalModule } from 'ngx-bootstrap/modal';
import { NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-domains',
  templateUrl: './domains.component.html',
  styleUrls: ['./domains.component.scss'],
})
export class DomainsComponent implements OnInit {
  @ViewChild('content')
  private modalRef: TemplateRef<any>;

  private myModal: any;
  selectedDomain: string;
  domainToDelete: string;
  DomainForm: FormGroup;
  editDomain: boolean = false;
  addDomain: boolean = false;
  deleteDomain: boolean = false;
  active: boolean = true;

  frameworkComponents = {
    customHeader: CustomHeaderRendererComponent,
    gridActionRenderer: DomainsActionsRendererComponent,
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
  domains: any;

  ColDef = [
    {
      headerName: 'Libellé',
      field: 'name',
      headerTooltip: 'Libellé',
    },
    {
      headerName: 'Actions',
      field: 'action',
      cellRenderer: 'gridActionRenderer',
      sortable: false,
      filter: false,
      width: 30,
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
    this.DomainForm = this.fb.group({
      domain: [this.selectedDomain, [Validators.required]],
    });
  }
  get defaultHeaderParams() {
    return this.defaultColDef.headerComponentParams;
  }
  ngOnInit(): void {
    this.initForm();
    this.domains = this.WorkOfArtService.domaine;
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
    // this.editDomain = true;
    // console.log('editDomain',this.editDomain);
    if (domain) {
      this.editDomain = true;
    } else {
      this.addDomain = true;
    }

    console.log(domain);
    this.selectedDomain = domain.name;
    this.initForm();
    this.myModal = this.modalService.open(this.modalRef, { centered: true });
    // }
    // this.modalService.open(content, { centered: true });
  }
  submit() {
    console.log(this.DomainForm.value.domain);
  }
  close() {
    this.editDomain = false;
    this.addDomain = false;
    this.deleteDomain = false;
    this.myModal.close('Close click');
    this.myModal.dismiss('Cross click');
  }
  visibleDomain(data: any) {
    console.log(data.active);
    data.active = !data.active;
    console.log(data.active);
    console.log(data);
  }
  deleteItem(data: any) {
    this.deleteDomain = true;
    this.domainToDelete = data.name;
    this.myModal = this.modalService.open(this.modalRef, { centered: true });
  }
}
