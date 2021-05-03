import {Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {NgDataTableComponent} from '@shared/components/ng-dataTables/ng-data-table/ng-data-table.component';
import {FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators} from '@angular/forms';
import {IDropdownSettings} from 'ng-multiselect-dropdown';
import {ActivatedRoute, Router} from '@angular/router';
import {NgbModal, NgbModalConfig, NgbModalOptions} from '@ng-bootstrap/ng-bootstrap';
import {SimpleTabsRefService} from '@shared/services/simple-tabs-ref.service';
import {FieldsService} from '@shared/services/fields.service';
import {MessageService} from 'primeng/api';
import {DatePipe} from '@angular/common';
import {ModalTabsRefComponent} from '@app/about/components/tabs-ref/modal-tabs-ref/modal-tabs-ref.component';

@Component({
  selector: 'app-localisation-type',
  templateUrl: './localisation-type.component.html',
  styleUrls: ['./localisation-type.component.scss'],
  providers: [DatePipe]
})
export class LocalisationTypeComponent implements OnInit {

  @ViewChild(NgDataTableComponent, {static: false}) dataTableComponent: NgDataTableComponent;

  myForm: any;
  loading = true;
  btnLoading: any = null;
  myModal: any;
  selectedItem: {};
  itemToEdit: any;
  itemToDelete: string;
  tabForm: FormGroup;
  editItem = false;
  addItem = false;
  deleteItems = false;
  editVisibility = false;
  dropdownSettings: IDropdownSettings;
  disappearanceDate: string;
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

  dataTableFilter: any = {};
  dataTableSort: any = {};
  dataTableSearchBar: any = {};
  items: any;
  today: string;

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

  constructor(
    private router: Router,
    private modalService: NgbModal,
    private activatedRoute: ActivatedRoute,
    private simpleTabsRef: SimpleTabsRefService,
    private fieldsService: FieldsService,
    public fb: FormBuilder,
    config: NgbModalConfig,
    private messageService: MessageService,
    private datePipe: DatePipe
  ) {
    config.backdrop = 'static';
    config.keyboard = false;
  }

  ngOnInit(): void {
    this.simpleTabsRef.tabRef = 'locationTypes';
    this.getAllItems();
  }


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
    const modalRef = this.modalService.open(ModalTabsRefComponent, ngbModalOptions);
    modalRef.componentInstance.fromParent = {
      name: 'type localisation',
      editItem: this.editItem,
      addItem: this.addItem,
      deleteItems: this.deleteItems,
      itemToDelete: this.itemToDelete,
      itemToEdit: this.itemToEdit,
      selectedItem: this.selectedItem,
      itemLabel: this.itemLabel,
      btnLoading : this.btnLoading,
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
    this.btnLoading = null;
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
    let params = {
      limit: this.limit,
      page: this.page,
      sort_by:this.sortBy,
      sort: this.sort
    };
    params = Object.assign(params, this.dataTableFilter);
    params = Object.assign(params, this.dataTableSort);
    params = Object.assign(params, this.dataTableSearchBar);

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
        this.items = [];
        this.totalFiltred = 0;
        this.total = 0;
        this.dataTableComponent.error = true;
        this.loading = false;
        this.addSingle('error', 'Erreur Technique', error.error.message);
      }
    );
  }

  visibleItem(data: any) {
    data.active = !data.active;

    this.simpleTabsRef.editItem({label: data.label, active: data.active}, data.id).subscribe(
      (result) => {
        if (data.active) {
          this.addSingle('success', 'Activation', 'Type localisation ' + data.label + ' activée avec succés');
        } else {
          this.addSingle('success', 'Activation', 'Type localisation ' + data.label + ' désactivée avec succés');
        }
        this.getAllItems();
      },

      (error) => {
        this.addSingle('error', 'Modification', error.error.message);
      }
    );
  }

  addSingle(type: string, sum: string, msg: string) {
    this.messageService.add({severity: type, summary: sum, detail: msg});
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

    this.dataTableFilter = Object.assign({}, e);
    this.page = 1;
    this.dataTableComponent.currentPage = 1;
    this.getAllItems();
  }

  sortEvent(e: any) {
    this.dataTableSort = e;
    this.getAllItems();
  }

  search(input: string) {
    this.page = 1;

    this.dataTableSearchBar = {'search': input};
    this.getAllItems();
  }

  paginationData(): void {
    // this.dataTableComponent.handlePaginationInfo();
  }

  addItems(item: any) {
    this.btnLoading = '';
    this.simpleTabsRef.addItem(item).subscribe(
      (result: any) => {
        this.close();
        this.addSingle('success', 'Ajout', 'Type localisation ' + item.label + ' ajoutée avec succés');
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

  editField(item: any, id: number) {
    this.btnLoading = '';
    this.simpleTabsRef.editItem(item, id).subscribe(
      (result) => {
        this.close();
        this.addSingle('success', 'Modification', 'Type localisation ' + item.label + ' modifiée avec succés');
        this.getAllItems();
      },

      (error) => {
        this.addSingle('error', 'Modification', error.error.message);
      }
    );
  }

  deleteItemss(item: any) {
    this.btnLoading = '';
    this.simpleTabsRef.deleteItem(item).subscribe(
      (result: any) => {
        this.close();
        this.addSingle('success', 'Suppression', 'Type localisation ' + item.label + ' supprimée avec succés');
        this.getAllItems();
      },
      (error: any) => {
        this.close();
        if (error.error.code === 400) {
          this.addSingle('error', 'Suppression', 'Type localisation ' + item.label + ' admet une relation');
        } else {
          this.addSingle('error', 'Suppression', error.error.message);
        }
      }
    );
  }
}
