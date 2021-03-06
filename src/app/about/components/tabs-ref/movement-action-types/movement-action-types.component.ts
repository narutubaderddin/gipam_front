import { Component, OnInit, ViewChild } from '@angular/core';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal, NgbModalConfig, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { SimpleTabsRefService } from '@shared/services/simple-tabs-ref.service';
import { FieldsService } from '@shared/services/fields.service';
import { MessageService } from 'primeng/api';
import { ModalMvtActionTypesComponent } from '@app/about/components/tabs-ref/movement-action-types/modal-mvt-action-types/modal-mvt-action-types.component';
import { NgDataTableComponent } from '@shared/components/ng-dataTables/ng-data-table/ng-data-table.component';
import { forkJoin } from 'rxjs';
import { tabRefFormBackendErrorMessage } from '@shared/utils/helpers';

@Component({
  selector: 'app-movement-action-types',
  templateUrl: './movement-action-types.component.html',
  styleUrls: ['./movement-action-types.component.scss'],
})
export class MovementActionTypesComponent implements OnInit {
  @ViewChild(NgDataTableComponent, { static: false }) dataTableComponent: NgDataTableComponent;

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
  selectedMvtType: any;
  active = true;
  dropdownList: any;
  itemLabel: any;

  filter: any;
  sortBy = '';
  sort = 'asc';
  totalFiltred: any;
  total: any;
  limit = 5;
  page = 1;
  end: number;
  start: number;

  relatedEntities: any[] = [];
  activeRelatedEntities: any[] = [];
  dataTableFilter: any = {};
  dataTableSort: any = {};
  dataTableSearchBar: any = {};
  RelatedEntityColumn = {
    header: 'Type mouvement',
    field: 'movementType',
    type: 'key-array',
    key_data: ['movementType', 'label'],
    filter: true,
    filterType: 'multiselect',
    placeholder: 'Type mouvement',
    selectData: this.relatedEntities,
    sortable: true,
  };
  items: any;
  fieldNames = {
    label: 'Libell??',
    movementType: 'Type mouvement',
  };
  columns = [
    {
      header: 'Libell??',
      field: 'label',
      type: 'key',
      filter: true,
      filterType: 'text',
      sortable: true,
    },
    this.RelatedEntityColumn,
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

  ngOnInit(): void {
    this.simpleTabsRef.tabRef = 'movementActionTypes';
    this.getAllItems();
    this.initFilterData();
    this.filter =
      this.activatedRoute.snapshot.queryParams.filter && this.activatedRoute.snapshot.queryParams.filter.length > 0;
  }
  initFilterData() {
    const previousUrl = this.simpleTabsRef.tabRef;
    const data = {
      page: 1,
      'active[eq]': 1,
      serializer_group: JSON.stringify(['response', 'short']),
    };
    forkJoin([this.simpleTabsRef.getAllItems(data, 'movementTypes')]).subscribe(
      ([relatedServicesResults]) => {
        this.relatedEntities = this.simpleTabsRef.getTabRefFilterData(relatedServicesResults['results']);
        this.activeRelatedEntities = this.simpleTabsRef.getTabRefFilterData(
          relatedServicesResults['results'].filter((value: any) => {
            return value.active === true;
          })
        );

        this.RelatedEntityColumn.selectData = this.relatedEntities;
      },
      (error: any) => {
        this.addSingle('error', 'Erreur Technique', ' Message: ' + error.error.message);
      }
    );
    this.simpleTabsRef.tabRef = previousUrl;
  }
  resetFilter() {}
  isActive(active: string) {
    return active;
  }
  openModal(item: any) {
    this.btnLoading = null;
    if (!this.deleteItems) {
      if (item) {
        this.editItem = true;
        this.itemToEdit = item;
        this.itemLabel = item.label;
        this.selectedMvtType = {
          id: item.movementType.id,
          label: item.movementType.label,
        };
      } else {
        this.selectedMvtType = [];
        this.addItem = true;
      }
    }

    this.selectedItem = item.label;
    const ngbModalOptions: NgbModalOptions = {
      backdropClass: 'modal-container',
      centered: true,
    };
    const modalRef = this.modalService.open(ModalMvtActionTypesComponent, ngbModalOptions);
    modalRef.componentInstance.fromParent = {
      name: 'type action mouvement',
      editItem: this.editItem,
      addItem: this.addItem,
      deleteItems: this.deleteItems,
      itemToDelete: this.itemToDelete,
      itemToEdit: this.itemToEdit,
      selectedItem: this.selectedItem,
      active: this.active,
      btnLoading: this.btnLoading,
      selectedMvtType: this.selectedMvtType,
      activeRelatedEntities: this.activeRelatedEntities,
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
    this.simpleTabsRef.tabRef = 'movementActionTypes';
    let params = {
      limit: this.limit,
      page: this.page,
      ort_by: this.sortBy,
      sort: this.sort,
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

  setItems(data: any[]) {
    this.items = [...data];
  }

  deleteItemss(item: any) {
    this.simpleTabsRef.tabRef = 'movementActionTypes';
    this.btnLoading = '';
    this.simpleTabsRef.deleteItem(item).subscribe(
      (result: any) => {
        this.close();
        this.addSingle('success', 'Suppression', 'Type action mouvement ' + item.label + ' supprim??e avec succ??s');
        this.getAllItems();
      },
      (error: any) => {
        this.close();
        if (error.error.code === 400) {
          this.addSingle('error', 'Suppression', 'Type action mouvement ' + item.label + ' admet une relation');
        } else {
          this.addSingle('error', 'Suppression', error.error.message);
        }
      }
    );
    this.btnLoading = false;
    this.close();
  }

  addItems(item: any) {
    this.simpleTabsRef.tabRef = 'movementActionTypes';
    this.btnLoading = '';
    this.loading = true;
    this.simpleTabsRef.addItem(item).subscribe(
      (result: any) => {
        this.close();
        this.addSingle('success', 'Ajout', 'Type action mouvement ' + item.label + ' ajout??e avec succ??s');
        this.getAllItems();
      },
      (error) => {
        if (error.error.code === 400) {
          this.addSingle('error', 'Ajout', tabRefFormBackendErrorMessage);
          this.simpleTabsRef.getFormErrors(error.error.errors, 'Ajout');
          this.loading = false;
        }
      }
    );
    this.close();
  }

  visibleItem(data: any) {
    this.loading = true;
    this.simpleTabsRef.tabRef = 'movementActionTypes';
    data.active = !data.active;
    this.simpleTabsRef.editItem({ label: data.label, active: data.active }, data.id).subscribe(
      (result) => {
        if (data.active) {
          this.addSingle('success', 'Activation', 'Type action mouvement ' + data.label + ' activ??e avec succ??s');
        } else {
          this.addSingle('success', 'Activation', 'Type action mouvement ' + data.label + ' d??sactiv??e avec succ??s');
        }
        this.getAllItems();
      },

      (error) => {
        this.addSingle('error', 'Modification', error.error.message);
        this.loading = false;
      }
    );
    this.close();
  }

  editItems(item: any, id: number) {
    this.loading = true;
    this.simpleTabsRef.tabRef = 'movementActionTypes';
    this.btnLoading = '';
    this.simpleTabsRef.editItem(item, id).subscribe(
      (result) => {
        this.close();
        this.addSingle('success', 'Modification', 'Type action mouvement ' + item.label + ' modifi??e avec succ??s');
        this.getAllItems();
      },
      (error) => {
        if (error.error.code === 400) {
          this.addSingle('error', 'Modification', tabRefFormBackendErrorMessage);
          this.simpleTabsRef.getFormErrors(error.error.errors, 'Modification');
          this.loading = false;
        }
      }
    );
    this.close();
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
    this.dataTableFilter = Object.assign({}, this.simpleTabsRef.prepareFilter(e));
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
    this.dataTableSearchBar = { search: input };
    this.getAllItems();
  }
  ClearSearch(event: Event, input: string) {
    if (!event['inputType']) {
      this.search(input);
    }
  }
}
