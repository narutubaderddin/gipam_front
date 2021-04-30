import { Component, OnInit } from '@angular/core';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { OPERATORS, TYPES } from '@shared/services/column-filter.service';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal, NgbModalConfig, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { SimpleTabsRefService } from '@shared/services/simple-tabs-ref.service';
import { FieldsService } from '@shared/services/fields.service';
import { MessageService } from 'primeng/api';
import { ModalReportSubTypesComponent } from '@app/about/components/tabs-ref/report-sub-types/modal-report-sub-types/modal-report-sub-types.component';

@Component({
  selector: 'app-report-sub-types',
  templateUrl: './report-sub-types.component.html',
  styleUrls: ['./report-sub-types.component.scss'],
})
export class ReportSubTypesComponent implements OnInit {
  loading = true;
  btnLoading: any = null;
  myModal: any;
  selectedItem: string;
  myForm: any;
  itemToEdit: any;
  itemToDelete: string;

  editItem = false;
  addItem = false;
  deleteItems = false;
  dropdownSettings: IDropdownSettings;

  active = true;
  dropdownList: any;
  itemLabel: any;

  filter: any;
  sortBy = 'label';
  sort = 'asc';
  totalFiltred: any;
  total: any;
  limit = 5;
  page = 1;
  end: number;
  start: number;
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

  items: any;
  fieldTraduction: any = {
    label: 'Libellé',
    reportType: 'Type constat',
  };
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
      header: 'Type constat',
      field: 'reportType',
      type: 'key-array',
      key_data: ['reportType', 'label'],
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

  constructor(
    private router: Router,
    private modalService: NgbModal,
    private activatedRoute: ActivatedRoute,
    private simpleTabsRef: SimpleTabsRefService,
    private fieldsService: FieldsService,

    config: NgbModalConfig,
    private messageService: MessageService
  ) {
    config.backdrop = 'static';
    config.keyboard = false;
  }

  get defaultHeaderParams() {
    return this.defaultColDef.headerComponentParams;
  }

  ngOnInit(): void {
    this.simpleTabsRef.tabRef = 'reportSubTypes';
    this.getAllItems();

    this.filter =
      this.activatedRoute.snapshot.queryParams.filter && this.activatedRoute.snapshot.queryParams.filter.length > 0;
  }

  resetFilter() {}

  openModal(item: any) {
    this.btnLoading = null;
    if (!this.deleteItems) {
      if (item) {
        this.editItem = true;
        this.itemToEdit = item;
        this.itemLabel = item.label;
      } else {
        this.addItem = true;
      }
    }

    this.selectedItem = item.label;
    const ngbModalOptions: NgbModalOptions = {
      backdropClass: 'modal-container',
      centered: true,
    };
    const modalRef = this.modalService.open(ModalReportSubTypesComponent, ngbModalOptions);
    modalRef.componentInstance.fromParent = {
      name: 'sous type constat',
      editItem: this.editItem,
      addItem: this.addItem,
      deleteItems: this.deleteItems,
      itemToDelete: this.itemToDelete,
      itemToEdit: this.itemToEdit,
      selectedItem: this.selectedItem,
      active: this.active,
    };

    modalRef.result.then(
      (result) => {
        if (result === 'delete') {
          return this.deleteItemss(this.itemToDelete);
        }
        if (this.addItem) {
          this.addItems(result);
        }
        if (this.editItem) {
          this.editItems(result, this.itemToEdit.id);
        }
        if (this.deleteItems) {
          this.deleteItem(this.itemToDelete);
        }
      },
      (reason) => {
        this.close();
      }
    );
  }

  submit() {
    this.btnLoading = null;
    const item = {
      label: this.myForm.label,
      active: this.myForm.active,
    };
    if (this.addItem) {
      this.addItems(item);
    }
    if (this.editItem) {
    }
  }

  close() {
    this.editItem = false;
    this.addItem = false;
    this.deleteItems = false;
  }

  deleteItem(data: any) {
    this.btnLoading = null;
    this.deleteItems = true;
    this.itemToDelete = data;
    this.itemLabel = data.label;
    this.openModal(data);
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
        this.visibleItem(e.item);
        break;
      default:
        this.close();
    }
  }

  getAllItems() {
    this.loading = true;
    this.simpleTabsRef.tabRef = 'reportSubTypes';
    const params = {
      limit: this.limit,
      page: this.page,
      'label[contains]': this.filter,
      sort_by: this.sortBy,
      sort: this.sort,
    };

    this.simpleTabsRef.getAllItems(params).subscribe(
      (result: any) => {
        this.items = result.results;
        this.totalFiltred = result.filteredQuantity;
        this.total = result.totalQuantity;
        this.start = (this.page - 1) * this.limit + 1;
        this.end = (this.page - 1) * this.limit + this.items.length;
        this.loading = false;
      },
      (error: any) => {
        this.addSingle('error', '', error.error.message);
      }
    );
  }

  setItems(data: any[]) {
    this.items = [...data];
  }

  deleteItemss(item: any) {
    this.simpleTabsRef.tabRef = 'reportSubTypes';
    this.btnLoading = '';
    this.simpleTabsRef.deleteItem(item).subscribe(
      (result: any) => {
        this.close();
        this.addSingle('success', 'Suppression', 'Sous type constat ' + item.label + ' supprimée avec succés');
        this.getAllItems();
      },
      (error: any) => {
        this.close();
        if (error.error.code === 400) {
          this.addSingle('error', 'Suppression', 'Sous type constat ' + item.label + ' admet une relation');
        } else {
          this.addSingle('error', 'Suppression', error.error.message);
        }
      }
    );
    this.btnLoading = false;
  }

  addItems(item: any) {
    this.simpleTabsRef.tabRef = 'reportSubTypes';
    this.btnLoading = '';
    this.simpleTabsRef.addItem(item).subscribe(
      (result: any) => {
        this.close();
        this.addSingle('success', 'Ajout', 'Sous type constat ' + item.label + ' ajoutée avec succés');
        this.getAllItems();
      },
      (error) => {
        this.addSingle('error', 'Ajout', error.error.message);
      }
    );
  }

  visibleItem(data: any) {
    this.simpleTabsRef.tabRef = 'reportSubTypes';
    data.active = !data.active;
    this.simpleTabsRef.editItem({ label: data.label, active: data.active }, data.id).subscribe(
      (result) => {
        if (data.active) {
          this.addSingle('success', 'Activation', 'Sous type constat ' + data.label + ' activée avec succés');
        } else {
          this.addSingle('success', 'Activation', 'Sous type constat ' + data.label + ' désactivée avec succés');
        }
        this.getAllItems();
      },

      (error) => {
        this.addSingle('error', 'Modification', error.error.message);
      }
    );
  }

  editItems(item: any, id: number) {
    this.simpleTabsRef.tabRef = 'reportSubTypes';
    this.btnLoading = '';
    this.simpleTabsRef.editItem(item, id).subscribe(
      (result) => {
        this.close();
        this.addSingle('success', 'Modification', 'Sous type constat ' + item.label + ' modifiée avec succés');
        this.getAllItems();
      },

      (error) => {
        this.addSingle('error', 'Modification', error.error.message);
      }
    );
  }

  addSingle(type: string, sum: string, msg: string) {
    this.messageService.add({ severity: type, summary: sum, detail: msg });
    this.btnLoading = null;
  }

  pagination(e: any) {
    if (e.page < this.total / parseInt(this.limit.toString(), 0)) {
      this.page = e.page + 1;
    } else {
      this.page = this.total / parseInt(this.limit.toString(), 0);
    }
    this.getAllItems();
  }

  filters(e: any) {
    console.log(e);
    this.filter = e.label;
    this.getAllItems();
  }
  getKeyByValue(object: any, value: any) {
    return Object.keys(object).find((key) => object[key] === value);
  }
  sortEvent(e: any) {
    console.log(e);
    this.sortBy = this.getKeyByValue(this.fieldTraduction, e.field);

    if (e.order == 1) {
      this.sort = 'asc';
      this.getAllItems();
    } else {
      this.sort = 'desc';
      this.getAllItems();
    }
  }
  search(input: string) {
    if (input) {
      this.filter = input;
      this.getAllItems();
      return;
    }
    this.filter = '';
    this.getAllItems();
  }
}
