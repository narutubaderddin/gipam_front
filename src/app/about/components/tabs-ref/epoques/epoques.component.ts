import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { OPERATORS, TYPES } from '@shared/services/column-filter.service';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal, NgbModalConfig, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { SimpleTabsRefService } from '@shared/services/simple-tabs-ref.service';
import { FieldsService } from '@shared/services/fields.service';
import { MessageService } from 'primeng/api';
import { ModalTabsRefComponent } from '@app/about/components/tabs-ref/modal-tabs-ref/modal-tabs-ref.component';

@Component({
  selector: 'app-epoques',
  templateUrl: './epoques.component.html',
  styleUrls: ['./epoques.component.scss'],
})
export class EpoquesComponent implements OnInit {
  dropdownSettings: IDropdownSettings;
  dropdownList: any;
  items: any;
  active = true;
  selectedItem: string;
  itemToEdit: any;
  itemToDelete: string;
  myForm: any;
  editItem = false;
  addItem = false;
  deleteItems = false;
  itemLabel: any;
  filter: any;
  sortBy = '';
  sort = 'asc';
  totalFiltred: any;
  total: any;
  limit: any = '5';
  page: any = '1';
  start: any;
  end: any;
  fieldTraduction = {
    label: 'Libellé',
  };
  loading: boolean = false;
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

  rowCount: any = 5;
  // filter = false;

  constructor(
    private router: Router,
    private modalService: NgbModal,
    private activatedRoute: ActivatedRoute,
    private simpleTabsRef: SimpleTabsRefService,

    private fieldsService: FieldsService,
    public fb: FormBuilder,
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
    this.simpleTabsRef.tabRef = 'eras';
    this.getAllItems();
  }

  resetFilter() {}

  openModal(item: any) {
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
    const modalRef = this.modalService.open(ModalTabsRefComponent, ngbModalOptions);
    modalRef.componentInstance.fromParent = {
      name: 'époque',
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
          this.editField(result, this.itemToEdit.id);
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

  deleteItem(data: any) {
    this.deleteItems = true;
    this.itemToDelete = data;
    this.itemLabel = data.label;
    this.openModal(data);
  }

  actionMethod(e: any) {
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
    const data = {
      limit: this.limit,
      page: this.page,
      'label[contains]': this.filter,
      sort_by: this.sortBy,
      sort: this.sort,
    };
    this.simpleTabsRef.getAllItems(data).subscribe(
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

  visibleItem(data: any) {
    data.active = !data.active;

    this.simpleTabsRef.editItem({ label: data.label, active: data.active }, data.id).subscribe(
      (result) => {
        if (data.active) {
          this.addSingle('success', 'Activation', 'Epoque ' + data.label + ' activée avec succés');
        } else {
          this.addSingle('success', 'Activation', 'Epoque ' + data.label + ' désactivée avec succés');
        }
        this.getAllItems();
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
    if (e.page < this.total / parseInt(this.limit, 0)) {
      this.page = e.page + 1;
    } else {
      this.page = (this.total / parseInt(this.limit, 0)).toString();
    }
    // this.limit = e.rows;
    // Math.min(e.rows, this.totalFiltred - e.page * e.rows).toString();
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
  paginationData(): void {
    // this.dataTableComponent.handlePaginationInfo();
  }
  addItems(item: any) {
    this.simpleTabsRef.addItem(item).subscribe(
      (result: any) => {
        this.close();
        this.addSingle('success', 'Ajout', 'Epoque ' + item.label + ' ajoutée avec succés');
        this.getAllItems();
      },
      (error) => {
        this.addSingle('error', 'Ajout', error.error.message);
      }
    );
  }
  close() {
    this.editItem = false;
    this.addItem = false;
    this.deleteItems = false;
  }
  submit() {
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
  editField(item: any, id: number) {
    this.simpleTabsRef.editItem(item, id).subscribe(
      (result) => {
        this.close();
        this.addSingle('success', 'Modification', 'Epoque ' + item.label + ' modifiée avec succés');
        this.getAllItems();
      },

      (error) => {
        this.addSingle('error', 'Modification', error.error.message);
      }
    );
  }
  deleteItemss(item: any) {
    this.simpleTabsRef.deleteItem(item).subscribe(
      (result: any) => {
        this.close();
        this.addSingle('success', 'Suppression', 'Epoque ' + item.label + ' supprimée avec succés');
        this.getAllItems();
      },
      (error: any) => {
        this.close();
        if (error.error.code === 400) {
          this.addSingle('error', 'Suppression', 'Epoque ' + item.label + ' admet une relation');
        } else {
          this.addSingle('error', 'Suppression', error.error.message);
        }
      }
    );
  }

}
