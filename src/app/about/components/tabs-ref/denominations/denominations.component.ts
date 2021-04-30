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
import { SimpleTabsRefService } from '@shared/services/simple-tabs-ref.service';

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
  active = true;
  dropdownList: any;
  itemLabel: any;

  filter: any;
  sortBy = '';
  sort: string = 'asc';
  totalFiltred: any;
  total: any;
  limit = 5;
  page = 1;
  end: number;
  start: number;
  loading: boolean = false;

  fieldTraduction = {
    label: 'Libellé',
    domaine: 'Domaine',
  };

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
      header: 'Domaine',
      field: 'field',
      type: 'key-array',
      key_data: ['field', 'label'],
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

  rowCount: any = 5;
  // filter = false;

  constructor(
    private router: Router,
    private modalService: NgbModal,
    private activatedRoute: ActivatedRoute,
    private denominationsService: DenominationsService,
    private fieldsService: FieldsService,
    public fb: FormBuilder,
    config: NgbModalConfig,
    private messageService: MessageService,
    private simpleTabsRef: SimpleTabsRefService
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
    this.simpleTabsRef.tabRef = 'denominations';
    this.initForm();
    this.getAllDenominations();
    this.domains = this.getAllFields();
    this.dropdownSettings = {
      singleSelection: true,
      idField: 'id',
      textField: 'label',
      itemsShowLimit: 1,
      allowSearchFilter: true,
    };
  }

  resetFilter() {}

  openModal(denomination: any) {
    if (denomination) {
      this.editDenomination = true;
      this.denominationToEdit = denomination;
      this.itemLabel = denomination.label;
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
      this.editItem(item, this.denominationToEdit.id);
    }
  }
  close() {
    this.editDenomination = false;
    this.addDenomination = false;
    this.deleteDenomination = false;

    // this.myModal.close('Close click');
    this.myModal.dismiss('Cross click');
  }
  deleteItem(data: any) {
    this.deleteDenomination = true;
    this.denominationToDelete = data;
    this.itemLabel = data.label;
    this.myModal = this.modalService.open(this.modalRef, { centered: true });
  }

  onDomainSelect(item: any) {
    console.log(item);
    this.selectedDomain = item;
  }

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
    this.fieldsService.getAllFields({}).subscribe(
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
    this.loading = true;
    this.simpleTabsRef
      .getAllItems({
        limit: this.limit,
        page: this.page,
        'label[contains]': this.filter,
        sort_by: this.sortBy,
        sort: this.sort,
      })
      .subscribe(
        (result: any) => {
          this.denominations = result.results;
          this.totalFiltred = result.filteredQuantity;
          this.total = result.totalQuantity;
          this.start = (this.page - 1) * this.limit + 1;
          this.end = (this.page - 1) * this.limit + this.denominations.length;
          this.loading = false;
        },
        (error) => {
          this.addSingle('error', '', error.error.message);
        }
      );
  }
  deleteDenominations(item: any) {
    this.simpleTabsRef.deleteItem(item).subscribe(
      (result) => {
        this.close();
        this.addSingle('success', 'Suppression', 'Dénomination ' + item.label + ' supprimée avec succés');
        this.getAllDenominations();
      },
      (error) => {
        this.close();
        if (error.error.code === 400) {
          this.addSingle('error', 'Suppression', 'Dénomination ' + item.label + ' admet une relation');
        } else {
          this.addSingle('error', 'Suppression', error.error.message);
        }
      }
    );
  }
  addDenominations(item: any) {
    console.log(item);
    this.simpleTabsRef.addItem(item).subscribe(
      (result) => {
        this.close();
        this.addSingle('success', 'Ajout', 'Dénomination ' + item.label + ' ajoutée avec succés');
        this.getAllDenominations();
      },
      (error) => {
        this.addSingle('error', 'Ajout', error.error.message);
      }
    );
  }
  visibleDenomination(data: any) {
    data.active = !data.active;

    this.simpleTabsRef.editItem({ label: data.label, active: data.active }, data.id).subscribe(
      (result) => {
        if (data.active) {
          this.addSingle('success', 'Activation', 'Dénomination ' + data.label + ' activée avec succés');
        } else {
          this.addSingle('success', 'Activation', 'Dénomination ' + data.label + ' désactivée avec succés');
        }
        this.getAllDenominations();
      },

      (error) => {
        this.addSingle('error', 'Modification', error.error.message);
      }
    );
  }
  editItem(item: any, id: number) {
    this.simpleTabsRef.editItem(item, id).subscribe(
      (result) => {
        this.close();
        this.addSingle('success', 'Modification', 'Dénomination ' + item.label + ' modifiée avec succés');
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
  pagination(e: any) {
    if (e.page < this.total / parseInt(this.limit.toString(), 0)) {
      this.page = e.page + 1;
    } else {
      this.page = this.total / parseInt(this.limit.toString(), 0);
    }

    this.getAllDenominations();
  }

  filters(e: any) {
    console.log(e);
    this.filter = e.label;
    this.getAllDenominations();
  }
  getKeyByValue(object: any, value: any) {
    return Object.keys(object).find((key) => object[key] === value);
  }
  sortEvent(e: any) {
    console.log(e);
    this.sortBy = this.getKeyByValue(this.fieldTraduction, e.field);

    if (e.order == 1) {
      this.sort = 'asc';
      this.getAllDenominations();
    } else {
      this.sort = 'desc';
      this.getAllDenominations();
    }
  }
}
