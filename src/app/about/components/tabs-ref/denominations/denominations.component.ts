import { Component, OnInit, Output, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CustomHeaderRendererComponent } from '@shared/components/datatables/custom-header-renderer/custom-header-renderer.component';
import { OPERATORS, TYPES } from '@shared/services/column-filter.service';
import { ColumnApi, GridApi, GridOptions, ICellEditorParams } from 'ag-grid-community';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { DenominationsActionsRendererComponent } from '@shared/components/datatables/denominations-actions-renderer/denominations-actions-renderer.component';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { DenominationsService } from '@shared/services/denominations.service';
import { FieldsService } from '@shared/services/fields.service';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-denominations',
  templateUrl: './denominations.component.html',
  styleUrls: ['./denominations.component.scss'],
})
export class DenominationsComponent implements OnInit {
  @ViewChild('content')
  modalRef: TemplateRef<any>;

  myModal: any;
  selectedDenomination: string;
  selectedDomain: any;
  denominationToEdit: any;
  denominationToDelete: string;
  denominationForm: FormGroup;
  editDenomination = false;
  addDenomination = false;
  deleteDenomination = false;
  dropdownSettings: IDropdownSettings;
  domains: any;
  errors: any = [];
  success: any = [];
  active = true;
  dropdownList: any;
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
      field: 'label',
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
  filter = false;

  constructor(
    private router: Router,
    private modalService: NgbModal,
    private activatedRoute: ActivatedRoute,
    private denominationsService: DenominationsService,
    private fieldsService: FieldsService,
    public fb: FormBuilder,
    config: NgbModalConfig,
    private messageService: MessageService
  ) {
    config.backdrop = 'static';
    config.keyboard = false;
  }
  initForm() {
    this.denominationForm = this.fb.group({
      domain: [this.selectedDomain, [Validators.required]],
      denomination: [this.selectedDenomination, [Validators.required]],
      active: [true],
    });
  }
  get defaultHeaderParams() {
    return this.defaultColDef.headerComponentParams;
  }
  ngOnInit(): void {
    this.dropdownSettings = {
      singleSelection: true,
      idField: 'id',
      textField: 'label',
      selectAllText: 'Sélectionner tout',
      unSelectAllText: 'Supprimer les sélections',
      itemsShowLimit: 1,
      allowSearchFilter: true,
    };
    this.initForm();
    this.getAllDenominations();
    this.domains = this.getAllFields();
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

  openModal(denomination: any) {
    // this.domains = this.getAllFields();
    if (denomination) {
      this.editDenomination = true;
      this.denominationToEdit = denomination;
    } else {
      this.addDenomination = true;
      this.domains = this.getAllFields();
    }

    console.log(denomination);
    this.selectedDenomination = denomination.label;

    this.initForm();
    this.myModal = this.modalService.open(this.modalRef, { centered: true });
  }
  submit() {
    console.log(this.denominationForm.value.domain);
    if (this.addDenomination) {
      const item = {
        field: this.denominationForm.value.domain[0].id,
        label: this.denominationForm.value.denomination,
        active: this.denominationForm.value.active,
      };

      this.addDenominations(item);
    }
    if (this.editDenomination) {
      const item = {
        field: this.denominationForm.value.domain[0].id,
        label: this.denominationForm.value.denomination,
        active: this.denominationForm.value.active,
      };
      this.editField(item, this.denominationToEdit.id);
    }
  }
  close() {
    this.editDenomination = false;
    this.addDenomination = false;
    this.deleteDenomination = false;
    this.errors = [];
    this.success = [];
    // this.myModal.close('Close click');
    this.myModal.dismiss('Cross click');
  }
  deleteItem(data: any) {
    this.deleteDenomination = true;
    this.denominationToDelete = data;
    this.myModal = this.modalService.open(this.modalRef, { centered: true });
  }

  onDomainSelect(item: any) {
    console.log(item);
    this.selectedDomain = item;
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
      case 'visibility':
        this.visibleDenomination(e.item);
        break;
      default:
        this.close();
    }
  }
  getAllFields() {
    this.fieldsService.getAllFields().subscribe(
      (feilds) => {
        this.domains = feilds;
        this.domains = this.domains.results;
      },
      (error) => {
        // this.errors.push(error.error.message);
        console.log(error.error.message);
      }
    );
  }
  getAllDenominations() {
    this.denominationsService.getAllDenominations().subscribe(
      (result) => {
        this.denominations = result;
        this.denominations = this.denominations.results;
        console.log('result', result);
      },
      (error) => {
        this.addSingle('error', '', error.error.message);
      }
    );
  }
  deleteDenominations(item: any) {
    this.denominationsService.deleteDenominations(item).subscribe(
      (result) => {
        this.close();
        this.addSingle('success', 'Suppression', 'Dénomination supprimée avec succés');
        this.getAllDenominations();
      },
      (error) => {
        this.close();
        if (error.error.code === 400) {
          this.addSingle('error', 'Suppression', 'Dénomination admet une relation');
        } else {
          this.addSingle('error', 'Suppression', error.error.message);
        }
      }
    );
  }
  addDenominations(item: any) {
    console.log(item);
    this.denominationsService.addDenominations(item).subscribe(
      (result) => {
        this.close();
        this.addSingle('success', 'Ajout', 'Dénomination ajoutée avec succés');
        this.getAllDenominations();
      },
      (error) => {
        this.addSingle('error', 'Ajout', error.error.message);
      }
    );
  }
  visibleDenomination(data: any) {
    data.active = !data.active;

    this.denominationsService
      .editDenominations(
        {
          label: data.label,
          active: data.active,
        },
        data.id
      )
      .subscribe(
        (result) => {
          if (data.active) {
            this.addSingle('success', 'Activation', 'Dénomination activée avec succés');
          } else {
            this.addSingle('success', 'Activation', 'Dénomination désactivée avec succés');
          }
          this.getAllDenominations();
        },

        (error) => {
          this.addSingle('error', 'Modification', error.error.message);
        }
      );
  }
  editField(item: any, id: number) {
    this.denominationsService.editDenominations(item, id).subscribe(
      (result) => {
        this.close();
        this.addSingle('success', 'Modification', 'Dénomination modifié avec succés');
        this.getAllDenominations();
      },

      (error) => {
        this.addSingle('error', 'Modification', error.error.message);
      }
    );
  }

  addSingle(type: string, sum: string, msg: string) {
    this.messageService.add({ severity: type, summary: sum, detail: msg });
  }
}
