import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { OPERATORS, TYPES } from '@shared/services/column-filter.service';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { MessageService } from 'primeng/api';

import { SimpleTabsRefService } from '@shared/services/simple-tabs-ref.service';
import { NgDataTableComponent } from '@shared/components/ng-dataTables/ng-data-table/ng-data-table.component';
import { DatePipe } from '@angular/common';
import { datePickerDateFormat, dateTimeFormat, towDatesCompare, viewDateFormat } from '@shared/utils/helpers';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-establishments',
  templateUrl: './establishments.component.html',
  styleUrls: ['./establishments.component.scss'],
  providers: [DatePipe],
})
export class EstablishmentsComponent implements OnInit {
  @ViewChild('content') modalRef: TemplateRef<any>;
  @ViewChild(NgDataTableComponent, { static: false }) dataTableComponent: NgDataTableComponent;

  loading = true;
  btnLoading: any = null;
  myModal: any;
  selectedItem: {
    label: '';
    acronym: '';
    startDate: '';
    disappearanceDate: '';
    ministry: {
      id: number;
      name: '';
    };
    type: {
      id: number;
      label: '';
    };
  };
  relatedEntities: any[] = [];
  activeRelatedEntities: any[] = [];
  types: any[] = [];
  activeTypes: any[] = [];
  selectedRelatedEntity: any;
  selectedType: any;
  itemToEdit: any;
  itemToDelete: string;
  tabForm: FormGroup;
  editItem = false;
  addItem = false;
  deleteItems = false;
  editVisibility = false;
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
  dataTableFilter: any = {};
  dataTableSort: any = {};
  dataTableSearchBar: any = {};
  items: any[] = [];
  today: string;
  error = false;
  columns: any[];

  rowCount: any = 5;

  relatedEntityColumn = {
    header: 'Ministère',
    field: 'ministry',
    type: 'key-array',
    key_data: ['ministry', 'name'],
    filter: true,
    filterType: 'multiselect',
    placeholder: 'Choisir des Ministères',
    selectData: this.relatedEntities,
    sortable: true,
    width: '380px',
  };
  relatedTypeColumn = {
    header: 'Type',
    field: 'type',
    type: 'key-array',
    key_data: ['type', 'label'],
    filter: true,
    filterType: 'multiselect',
    placeholder: 'Choisir des Types',
    selectData: this.types,
    sortable: true,
  };

  constructor(
    private modalService: NgbModal,
    private activatedRoute: ActivatedRoute,
    private simpleTabsRef: SimpleTabsRefService,
    public fb: FormBuilder,
    config: NgbModalConfig,
    private messageService: MessageService,
    private datePipe: DatePipe
  ) {
    config.backdrop = 'static';
    config.keyboard = false;
  }

  ngOnInit(): void {
    this.simpleTabsRef.tabRef = 'establishments';
    this.initColumnsDefinition();
    this.initFilterData();
    this.getAllItems();
    this.initForm();
    this.filter =
      this.activatedRoute.snapshot.queryParams.filter && this.activatedRoute.snapshot.queryParams.filter.length > 0;
  }

  initForm() {
    const msg = 'date début inférieur date fin';
    const startDate = this.datePipe.transform(
      this.selectedItem ? this.selectedItem.startDate : new Date(),
      datePickerDateFormat
    );
    const disappearanceDate = this.datePipe.transform(
      this.selectedItem ? this.selectedItem.disappearanceDate : '',
      datePickerDateFormat
    );
    this.tabForm = this.fb.group({
      label: [this.selectedItem ? this.selectedItem.label : '', [Validators.required]],
      acronym: [this.selectedItem ? this.selectedItem.acronym : '', [Validators.required]],
      startDate: [startDate, [Validators.required]],
      disappearanceDate: [disappearanceDate, []],
      ministry: [this.selectedRelatedEntity ? this.selectedRelatedEntity : '', [Validators.required]],
      type: [this.selectedType ? this.selectedType : '', [Validators.required]],
    });
    this.tabForm.setValidators(towDatesCompare('startDate', 'disappearanceDate'));
  }

  initColumnsDefinition() {
    this.columns = [
      {
        header: 'Libellé',
        field: 'label',
        type: 'key',
        filter: true,
        filterType: 'text',
        sortable: true,
      },
      {
        header: 'Sigle',
        field: 'acronym',
        type: 'key',
        filter: true,
        filterType: 'text',
        sortable: true,
        width: '100px',
      },
      this.relatedTypeColumn,
      {
        header: 'Date début de validité',
        field: 'startDate',
        type: 'date',
        filter: true,
        filterType: 'range-date',
        sortable: true,
        width: '200px',
      },
      {
        header: 'Date fin de validité',
        field: 'disappearanceDate',
        type: 'date',
        filter: true,
        filterType: 'range-date',
        sortable: true,
        width: '200px',
      },
      this.relatedEntityColumn,
      {
        header: 'Actions',
        field: 'action',
        type: 'app-actions-cell',
        sortable: false,
        filter: false,
        width: '100px',
      },
    ];
  }

  initFilterData() {
    const data = {
      page: 1,
      'active[eq]': 1,
      serializer_group: JSON.stringify(['response', 'short']),
    };
    forkJoin([
      this.simpleTabsRef.getAllItems(data, 'ministries'),
      this.simpleTabsRef.getAllItems(data, 'establishmentTypes'),
    ]).subscribe(
      ([relatedEntitiesResults, relatedTypesResults]) => {
        this.relatedEntities = this.simpleTabsRef.getTabRefFilterData(relatedEntitiesResults['results']);
        this.activeRelatedEntities = relatedEntitiesResults['results'].filter((value: any) =>
          this.isActive(value.disappearanceDate)
        );
        this.types = this.simpleTabsRef.getTabRefFilterData(relatedTypesResults['results']);
        this.activeTypes = relatedTypesResults['results'].filter((value: any) =>
          this.isActive(value.disappearanceDate)
        );
        this.relatedEntityColumn.selectData = this.relatedEntities;
        this.relatedTypeColumn.selectData = this.types;
      },
      (error: any) => {
        this.addSingle('error', 'Erreur Technique', ' Message: ' + error.error.message);
      }
    );
  }

  get defaultHeaderParams() {
    return this.defaultColDef.headerComponentParams;
  }

  resetFilter() {}

  openModal(item: any) {
    this.btnLoading = null;
    if (this.editItem || this.editVisibility) {
      this.itemToEdit = item;
      this.itemLabel = item.label;
      this.selectedRelatedEntity = {
        id: item.ministry ? item.ministry.id : '',
        name: item.ministry ? item.ministry.name : '',
      };
      this.selectedType = {
        id: item.type ? item.type.id : '',
        label: item.type ? item.type.label : '',
      };
    }
    if (this.addItem) {
      this.selectedRelatedEntity = null;
      this.selectedType = null;
    }
    this.selectedItem = item;
    this.initForm();
    this.myModal = this.modalService.open(this.modalRef, { centered: true });
  }

  submit() {
    this.btnLoading = null;

    const item = {
      label: this.tabForm.value.label,
      acronym: this.tabForm.value.acronym,
      startDate: this.datePipe.transform(this.tabForm.value.startDate, dateTimeFormat),
      disappearanceDate: this.datePipe.transform(this.tabForm.value.disappearanceDate, dateTimeFormat),
      ministry: this.tabForm.value.ministry.id,
      type: this.tabForm.value.type.id,
    };
    if (this.addItem) {
      this.addItems(item);
    }
    if (this.editItem || this.editVisibility) {
      this.editField(item, this.itemToEdit.id);
    }
  }

  close() {
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
    this.selectedRelatedEntity = {};
    this.openModal(null);
  }

  deleteItem(data: any) {
    this.btnLoading = null;
    this.deleteItems = true;
    this.itemToDelete = data;
    this.itemLabel = data.label;
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
    const today = this.datePipe.transform(new Date(), datePickerDateFormat);
    return !(endDate !== '' && endDate && endDate <= today);
  }

  getAllItems() {
    this.loading = true;
    let params = {
      limit: this.limit,
      page: this.page,
    };
    params = Object.assign(params, this.dataTableFilter);
    params = Object.assign(params, this.dataTableSort);
    params = Object.assign(params, this.dataTableSearchBar);
    this.simpleTabsRef.getAllItems(params, 'establishments').subscribe(
      (result: any) => {
        this.items = result.results.map((item: any) => {
          return Object.assign({ active: this.isActive(item.disappearanceDate) }, item);
        });
        this.totalFiltred = result.filteredQuantity;
        this.total = result.totalQuantity;
        this.start = (this.page - 1) * this.limit + 1;
        this.end = (this.page - 1) * this.limit + this.items.length;
        this.loading = false;
        this.dataTableComponent.error = false;
      },
      (error: any) => {
        this.items = [];
        this.totalFiltred = 0;
        this.total = 0;
        this.dataTableComponent.error = true;
        this.loading = false;
        this.addSingle('error', 'Erreur Technique', 'Message: ' + error.error.message);
      }
    );
  }

  deleteItemss(item: any) {
    this.btnLoading = '';
    this.simpleTabsRef.deleteItem(item).subscribe(
      (result: any) => {
        this.close();
        this.addSingle('success', 'Suppression', 'Etablissement ' + item.label + ' supprimée avec succés');
        this.getAllItems();
        this.deleteItems = false;
      },
      (error: any) => {
        this.close();
        if (error.error.code === 400) {
          this.addSingle('error', 'Suppression', 'Etablissement ' + item.label + ' admet une relation');
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
        this.addSingle('success', 'Ajout', 'Etablissement ' + item.label + ' ajoutée avec succés');
        this.getAllItems();
        this.addItem = false;
      },
      (error) => {
        this.simpleTabsRef.getFormErrors(error.error.errors, 'Ajout');
        this.btnLoading = null;
      }
    );
  }

  editField(item: any, id: number) {
    this.btnLoading = '';
    this.simpleTabsRef.editItem(item, id).subscribe(
      (result) => {
        this.close();
        this.addSingle('success', 'Modification', 'Etablissement ' + item.label + ' modifiée avec succés');
        this.getAllItems();
        this.editItem = false;
        this.editVisibility = false;
      },

      (error) => {
        this.simpleTabsRef.getFormErrors(error.error.errors, 'Modification');
        this.btnLoading = null;
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
    this.dataTableSearchBar = {};
    if (input !== '') {
      this.dataTableSearchBar = { search: input };
    }
    this.getAllItems();
  }

  ClearSearch(event: any, input: string) {
    if (!event.inputType) {
      this.search(input);
    }
  }
}
