import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { NgDataTableComponent } from '@shared/components/ng-dataTables/ng-data-table/ng-data-table.component';
import { FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { SimpleTabsRefService } from '@shared/services/simple-tabs-ref.service';
import { FieldsService } from '@shared/services/fields.service';
import { MessageService } from 'primeng/api';
import { DatePipe } from '@angular/common';
import { forkJoin } from 'rxjs';
import { tabRefFormBackendErrorMessage } from '@shared/utils/helpers';

@Component({
  selector: 'app-departments',
  templateUrl: './departments.component.html',
  styleUrls: ['./departments.component.scss'],
  providers: [DatePipe],
})
export class DepartmentsComponent implements OnInit {
  @ViewChild('content') modalRef: TemplateRef<any>;
  @ViewChild(NgDataTableComponent, { static: false }) dataTableComponent: NgDataTableComponent;

  loading = true;
  btnLoading: any = null;
  myModal: any;
  selectedItem: {
    name: '';
    startDate: '';
    disappearanceDate: '';
    region: {
      id: number;
      name: '';
    };
  };
  relatedEntities: any[] = [];
  selectedRelatedEntity: any;
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
  sortBy = 'name';
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
  items: any[] = [];
  today: string;

  activeRelatedEntities: any[] = [];

  RelatedEntityColumn = {
    header: 'R??gion',
    field: 'region',
    type: 'key-array',
    key_data: ['region', 'name'],
    filter: true,
    filterType: 'multiselect',
    placeholder: 'R??gion',
    selectData: this.relatedEntities,
    sortable: true,
  };

  columns = [
    {
      header: 'Libell??',
      field: 'name',
      type: 'key',
      filter: true,
      filterType: 'text',
      sortable: true,
    },
    {
      header: 'Date d??but de validit??',
      field: 'startDate',
      type: 'date',
      filter: true,
      filterType: 'range-date',
      sortable: true,
      width: '200px',
    },
    {
      header: 'Date fin de validit??',
      field: 'disappearanceDate',
      type: 'date',
      filter: true,
      filterType: 'range-date',
      sortable: true,
      width: '200px',
    },
    this.RelatedEntityColumn,
    {
      header: 'Actions',
      field: 'action',
      type: 'app-actions-cell',
      sortable: false,
      filter: false,
      width: '250px',
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
    this.simpleTabsRef.tabRef = 'departments';
    this.getAllItems();
    this.initFilterData();
    this.today = this.datePipe.transform(new Date(), 'yyyy-MM-dd');
    this.initForm();
  }
  initFilterData() {
    const previousUrl = this.simpleTabsRef.tabRef;
    const data = {
      page: 1,
      'active[eq]': 1,
      serializer_group: JSON.stringify(['response', 'short']),
    };
    forkJoin([this.simpleTabsRef.getAllItems(data, 'regions')]).subscribe(
      ([relatedServicesResults]) => {
        this.relatedEntities = this.simpleTabsRef.getTabRefFilterData(relatedServicesResults['results']);
        this.activeRelatedEntities = this.simpleTabsRef
          .getTabRefFilterData(relatedServicesResults['results'])
          .filter((value: any) => this.isActive(value.disappearanceDate));

        this.RelatedEntityColumn.selectData = this.relatedEntities;
      },
      (error: any) => {
        this.addSingle('error', 'Erreur Technique', ' Message: ' + error.error.message);
      }
    );
    this.simpleTabsRef.tabRef = previousUrl;
  }

  initForm() {
    const msg = 'date d??but inf??rieur date fin';
    const startDate = this.datePipe.transform(
      this.selectedItem ? this.selectedItem.startDate : new Date(),
      'yyyy-MM-dd'
    );
    const disappearanceDate = this.datePipe.transform(
      this.selectedItem ? this.selectedItem.disappearanceDate : '',
      'yyyy-MM-dd'
    );
    this.tabForm = this.fb.group({
      label: [this.selectedItem ? this.selectedItem.name : '', [Validators.required]],
      startDate: [startDate, [Validators.required]],
      disappearanceDate: [disappearanceDate, []],
      region: [this.selectedRelatedEntity ? this.selectedRelatedEntity : { name: '' }, [Validators.required]],
    });
    this.tabForm.setValidators(this.ValidateDate());
  }

  ValidateDate(): ValidatorFn {
    return (cc: FormGroup): ValidationErrors => {
      if (!cc.get('startDate')) {
        return null;
      }
      if (cc.get('startDate').value > cc.get('disappearanceDate').value) {
        return { dateInvalid: 'Date d??but sup??rieur date fin' };
      }
      return null;
    };
  }

  resetFilter() {}

  openModal(item: any) {
    this.btnLoading = null;
    if (this.editItem || this.editVisibility) {
      this.itemToEdit = item;
      this.itemLabel = item.name;

      this.selectedRelatedEntity = item.region
        ? {
            name: item.region.name,
            id: item.region.id,
          }
        : {};
    }
    if (this.editItem || this.addItem) {
    }
    this.selectedItem = item;
    this.initForm();
    this.myModal = this.modalService.open(this.modalRef, { centered: true });
  }
  onRegionSelect(item: any) {
    this.selectedRelatedEntity = item;
  }
  onSelectAll(items: any) {}

  transformDateToDateTime(input: string, format: string, addTime: boolean = true) {
    if (input !== '' && input) {
      if (addTime) {
        return this.datePipe.transform(input, format) + ' 00:00:00';
      }
      return this.datePipe.transform(input, format);
    }
    return '';
  }

  submit() {
    this.btnLoading = null;
    const item = {
      name: this.tabForm.value.label,
      startDate: this.transformDateToDateTime(this.tabForm.value.startDate, 'yyy-MM-dd'),
      disappearanceDate: this.transformDateToDateTime(this.tabForm.value.disappearanceDate, 'yyy-MM-dd'),
      region: this.tabForm.value.region.id,
    };
    if (this.addItem) {
      this.addItems(item);
    }
    if (this.editItem || this.editVisibility) {
      this.editField(item, this.itemToEdit.id);
    }
  }

  close() {
    this.selectedItem = null;
    this.selectedRelatedEntity = [];
    this.editItem = false;
    this.addItem = false;
    this.deleteItems = false;
    this.editVisibility = false;

    this.myModal.dismiss('Cross click');
  }

  actionMethod(e: any) {
    switch (e.method) {
      case 'delete':
        this.deleteItem(e.item);
        break;
      case 'edit':
        this.editItemAction(e.item);
        break;
      case 'visibility':
        this.changeVisibilityAction(e.item);
        break;
      default:
        this.close();
    }
  }

  addItemAction() {
    this.addItem = true;
    this.selectedItem = null;
    this.selectedRelatedEntity = [];
    this.openModal('');
  }

  deleteItem(data: any) {
    this.btnLoading = null;
    this.deleteItems = true;
    this.itemToDelete = data;
    this.itemLabel = data.name;
    this.myModal = this.modalService.open(this.modalRef, { centered: true });
  }

  editItemAction(item: any) {
    this.editItem = true;
    this.openModal(item);
  }

  changeVisibilityAction(item: any) {
    this.editVisibility = true;
    this.openModal(item);
  }

  isActive(endDate: string) {
    const today = this.datePipe.transform(new Date(), 'yyyy/MM/dd');
    return !(endDate !== '' && endDate && endDate <= today);
  }

  getAllItems() {
    this.loading = true;
    let params = {
      limit: this.limit,
      page: this.page,
      sort_by: this.sortBy,
      sort: this.sort,
    };
    params = Object.assign(params, this.dataTableFilter);
    params = Object.assign(params, this.dataTableSort);
    params = Object.assign(params, this.dataTableSearchBar);

    this.simpleTabsRef.getAllItems(params).subscribe(
      (result: any) => {
        this.items = result.results.map((item: any) => {
          return Object.assign({ active: this.isActive(item.disappearanceDate) }, item);
        });
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

  deleteItemss(item: any) {
    this.btnLoading = '';
    this.simpleTabsRef.deleteItem(item).subscribe(
      (result: any) => {
        this.close();
        this.addSingle('success', 'Suppression', 'D??partement ' + item.name + ' supprim??e avec succ??s');
        this.getAllItems();
        this.deleteItems = false;
      },
      (error: any) => {
        this.close();
        if (error.error.code === 400) {
          this.addSingle('error', 'Suppression', 'D??partement ' + item.name + ' admet une relation');
        } else {
          this.addSingle('error', 'Suppression', error.error.message);
        }
      }
    );
  }

  addItems(item: any) {
    this.btnLoading = '';
    this.simpleTabsRef.addItem(item).subscribe(
      (result: any) => {
        this.close();
        this.addSingle('success', 'Ajout', 'D??partement ' + item.name + ' ajout??e avec succ??s');
        this.getAllItems();
        this.addItem = false;
      },
      (error) => {
        if (error.error.code === 400) {
          this.addSingle('error', 'Ajout', tabRefFormBackendErrorMessage);
          this.simpleTabsRef.getFormErrors(error.error.errors, 'Ajout');
        }
      }
    );
  }

  editField(item: any, id: number) {
    this.btnLoading = '';
    this.simpleTabsRef.editItem(item, id).subscribe(
      (result) => {
        this.close();
        this.addSingle('success', 'Modification', 'D??partement ' + item.name + ' modifi??e avec succ??s');
        this.getAllItems();
        this.editItem = false;
        this.editVisibility = false;
      },

      (error) => {
        if (error.error.code === 400) {
          this.addSingle('error', 'Modification', tabRefFormBackendErrorMessage);
          this.simpleTabsRef.getFormErrors(error.error.errors, 'Modification');
        }
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
