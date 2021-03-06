import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { OPERATORS, TYPES } from '@shared/services/column-filter.service';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { MessageService } from 'primeng/api';

import { SimpleTabsRefService } from '@shared/services/simple-tabs-ref.service';
import { NgDataTableComponent } from '@shared/components/ng-dataTables/ng-data-table/ng-data-table.component';
import { DatePipe } from '@angular/common';
import {
  datePickerDateFormat,
  dateTimeFormat,
  markAsDirtyDeep,
  towDatesCompare,
  viewDateFormat,
} from '@shared/utils/helpers';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-reserves',
  templateUrl: './reserves.component.html',
  styleUrls: ['./reserves.component.scss'],
  providers: [DatePipe],
})
export class ReservesComponent implements OnInit {
  @ViewChild('content') modalRef: TemplateRef<any>;
  @ViewChild(NgDataTableComponent, { static: false }) dataTableComponent: NgDataTableComponent;

  loading = true;
  btnLoading: any = null;
  myModal: any;
  selectedItem: any;
  loadingDropdownData = false;
  // for datatable filter
  relatedRooms: any[] = [];
  relatedBuildings: any[] = [];

  // for form dropdown and autocomplete

  autoComplete: {
    regions: any[];
    departments: any[];
    communes: any[];
    sites: any[];
    buildings: any[];
    room: any[];
  } = {
    regions: [],
    departments: [],
    communes: [],
    sites: [],
    buildings: [],
    room: [],
  };

  activeRelatedRooms: any[] = [];

  // selected from dropdown

  selectedRelatedRoom: any;
  selectedRelated: {
    region: any;
    department: any;
    commune: any;
    site: any;
    building: any;
    room: any;
  } = {
    region: null,
    department: null,
    commune: null,
    site: null,
    building: null,
    room: null,
  };

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

  relatedRoomColumn = {
    header: 'Pi??ce',
    field: 'room',
    type: 'key-array',
    key_data: ['room', 'reference'],
    filter: true,
    filterType: 'multiselect',
    placeholder: 'Choisir une entit??',
    selectData: this.relatedRooms,
    sortable: true,
  };

  relatedBuildingColumn = {
    header: 'B??timent',
    field: 'building',
    type: 'key-array',
    key_data: ['building', 'name'],
  };

  relatedCommuneColumn = {
    header: 'Commune',
    field: 'commune',
    type: 'key-array',
    key_data: ['commune', 'name'],
  };

  relatedSiteColumn = {
    header: 'Site',
    field: 'site',
    type: 'key-array',
    key_data: ['site', 'label'],
  };

  relatedDepartmentColumn = {
    header: 'D??partement',
    field: 'department',
    type: 'key-array',
    key_data: ['department', 'name'],
  };

  relatedRegionColumn = {
    header: 'Region',
    field: 'region',
    type: 'key-array',
    key_data: ['region', 'name'],
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
    this.simpleTabsRef.tabRef = 'reserves';
    this.initColumnsDefinition();
    this.initFilterData();
    this.getAllItems();
    this.initForm();
    this.filter =
      this.activatedRoute.snapshot.queryParams.filter && this.activatedRoute.snapshot.queryParams.filter.length > 0;
  }

  initForm() {
    const startDate = this.datePipe.transform(
      this.selectedItem ? this.selectedItem.startDate : new Date(),
      datePickerDateFormat
    );
    const endDate = this.datePipe.transform(this.selectedItem ? this.selectedItem.endDate : '', datePickerDateFormat);
    this.tabForm = this.fb.group({
      label: [this.selectedItem ? this.selectedItem.label : '', [Validators.required]],
      startDate: [startDate, [Validators.required]],
      endDate: [endDate, []],
      room: [{ value: this.selectedRelatedRoom, disabled: !this.selectedRelated?.building }, [Validators.required]],
    });
    this.tabForm.setValidators(towDatesCompare('startDate', 'endDate'));
  }

  initColumnsDefinition() {
    this.columns = [
      {
        header: 'Libell??',
        field: 'label',
        type: 'key',
        filter: true,
        filterType: 'text',
        sortable: true,
      },
      this.relatedRoomColumn,
      this.relatedBuildingColumn,
      this.relatedSiteColumn,
      this.relatedCommuneColumn,
      this.relatedDepartmentColumn,
      this.relatedRegionColumn,
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
        field: 'endDate',
        type: 'date',
        filter: true,
        filterType: 'range-date',
        sortable: true,
        width: '200px',
      },
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
      serializer_group: JSON.stringify(['short']),
    };
    forkJoin([this.simpleTabsRef.getAllItems(data, 'rooms')]).subscribe(
      ([relatedEntitiesResults]) => {
        this.relatedRooms = this.simpleTabsRef.getTabRefFilterData(relatedEntitiesResults.results);
        this.relatedRoomColumn.selectData = this.relatedRooms;
      },
      (error: any) => {
        this.addSingle('error', 'Erreur Technique', ' Message: ' + error.error.message);
      }
    );
  }

  getDropdownData(entity: string, relatedEntityName?: string, relatedEntity?: any) {
    const params = {
      page: 1,
      serializer_group: JSON.stringify(['short']),
    };
    if (relatedEntity) {
      params[relatedEntityName + '[eq]'] = relatedEntity.id;
    }
    this.unsetRelated(entity);
    this.tabForm.get('room').setValue('');
    this.tabForm.get('room').disable();
    entity = entity + 's';
    this.simpleTabsRef.getAllItems(params, entity).subscribe((dataResult) => {
      this.autoComplete[entity] = dataResult.results;
      console.log(entity, dataResult.results);
    });
  }

  autoCompleteSites(event: any) {
    const params = {
      page: 1,
      'label[startsWith]': event.query,
      serializer_group: JSON.stringify(['short']),
    };
    this.simpleTabsRef.getAllItems(params, 'sites').subscribe((dataResult) => {
      this.autoComplete.sites = dataResult.results;
    });
  }

  unsetRelated(from?: string) {
    let unset = false;
    Object.keys(this.selectedRelated).forEach((key) => {
      if (key === from) {
        unset = true;
      }
      if (unset || !from) {
        this.selectedRelated[key] = null;
      }
    });
  }

  initFormDropdowns() {
    const data = {
      page: 1,
      serializer_group: JSON.stringify(['short']),
    };
    forkJoin([this.simpleTabsRef.getAllItems(data, 'regions')]).subscribe(
      ([regionsResults]) => {
        this.autoComplete.regions = this.simpleTabsRef.getTabRefFilterData(regionsResults.results);
      },
      (error: any) => {
        this.addSingle('error', 'Erreur Technique', ' Message: ' + error.error.message);
      }
    );
  }

  getRoomsByBuilding() {
    this.tabForm.get('room').enable();
    const params = {
      'building[eq]': this.selectedRelated.building.id,
      serializer_group: JSON.stringify(['short']),
    };
    this.simpleTabsRef.getAllItems(params, 'rooms').subscribe(
      (result: any) => {
        this.activeRelatedRooms = result.results.filter((value: any) => this.isActive(value.endDate));
        this.loadingDropdownData = false;
      },
      (error: any) => {
        this.loadingDropdownData = false;
      }
    );
  }

  get defaultHeaderParams() {
    return this.defaultColDef.headerComponentParams;
  }

  fillDropDowns(item: any) {
    if (item.region) {
      this.selectedRelated.region = Object.assign({}, item.region);
      this.getDropdownData('department', 'region', this.selectedRelated.region);
      this.selectedRelated.department = Object.assign({}, item.department);
      this.getDropdownData('commune', 'department', this.selectedRelated.department);
      this.selectedRelated.commune = Object.assign({}, item.commune);
      this.getDropdownData('building', 'commune', this.selectedRelated.commune);
    } else {
      this.selectedRelated.site = Object.assign({}, item.site);
      this.getDropdownData('building', 'site', this.selectedRelated.site);
    }
    this.selectedRelated.building = Object.assign({}, item.building);
    this.getRoomsByBuilding();
  }

  openModal(item: any) {
    this.initFormDropdowns();
    this.selectedRelatedRoom = null;
    this.tabForm.get('room').setValue('');
    this.btnLoading = null;
    if (this.editItem || this.editVisibility) {
      this.itemToEdit = item;
      this.itemLabel = item.label;
    }
    if (this.editItem) {
      this.loadingDropdownData = true;
      this.selectedRelatedRoom = {
        id: item.room ? item.room.id : '',
        reference: item.room ? item.room.reference : '',
      };
      this.fillDropDowns(item);
    }
    this.selectedItem = item;
    this.initForm();
    this.myModal = this.modalService.open(this.modalRef, { centered: true });
  }

  submit() {
    if (this.tabForm.invalid || !this.tabForm.get('room').value) {
      markAsDirtyDeep(this.tabForm);
      this.addSingle('error', 'Erreur', 'Veuillez v??rifier tous les champs encadr??s en rouge');
      return;
    }
    this.btnLoading = null;
    let item = {};
    if (this.addItem || this.editItem) {
      item = {
        label: this.tabForm.value.label,
        room: this.tabForm.value.room.id,
        startDate: this.datePipe.transform(this.tabForm.value.startDate, dateTimeFormat),
        endDate: this.datePipe.transform(this.tabForm.value.endDate, dateTimeFormat),
      };
    }
    if (this.addItem) {
      this.addItems(item);
      return;
    }
    if (this.editVisibility) {
      item = {
        startDate: this.datePipe.transform(this.tabForm.value.startDate, dateTimeFormat),
        endDate: this.datePipe.transform(this.tabForm.value.endDate, dateTimeFormat),
      };
    }
    if (this.editItem || this.editVisibility) {
      this.editField(item, this.itemToEdit.id);
      return;
    }
  }

  close() {
    this.editItem = false;
    this.addItem = false;
    this.deleteItems = false;
    this.editVisibility = false;
    this.selectedRelatedRoom = null;
    this.unsetRelated();
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
    this.selectedRelatedRoom = {};
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
    this.simpleTabsRef.getAllItems(params, 'reserves').subscribe(
      (result: any) => {
        this.items = result.results.map((item: any) => {
          return Object.assign({ active: this.isActive(item.endDate) }, item);
        });
        this.totalFiltred = result.filteredQuantity;
        this.total = result.totalQuantity;
        this.start = (this.page - 1) * this.limit + 1;
        this.end = (this.page - 1) * this.limit + this.items.length;
        this.loading = false;
        if (this.dataTableComponent) {
          this.dataTableComponent.error = false;
        }
      },
      (error: any) => {
        this.items = [];
        this.totalFiltred = 0;
        this.total = 0;
        this.dataTableComponent.error = true;
        this.loading = false;
        if (error.error.code !== 500) {
          this.addSingle('error', 'Erreur Technique', 'Message: ' + error.error.message);
        }
      }
    );
  }

  deleteItemss(item: any) {
    this.btnLoading = '';
    this.simpleTabsRef.deleteItem(item).subscribe(
      (result: any) => {
        this.close();
        this.addSingle('success', 'Suppression', 'Entit?? ' + item.label + ' supprim??e avec succ??s');
        this.getAllItems();
        this.deleteItems = false;
      },
      (error: any) => {
        this.close();
        if (error.error.code === 400) {
          this.addSingle('error', 'Suppression', 'Entit?? ' + item.label + ' admet une relation');
        }
      }
    );
  }

  addItems(item: any) {
    this.btnLoading = '';
    this.simpleTabsRef.addItem(item).subscribe(
      (result: any) => {
        this.close();
        this.addSingle('success', 'Ajout', 'Entit?? ' + item.label + ' ajout??e avec succ??s');
        this.getAllItems();
        this.addItem = false;
      },
      (error) => {
        if (error.error.code === 400) {
          this.simpleTabsRef.getFormErrors(error.error.errors, 'Ajout');
        }
        this.btnLoading = null;
      }
    );
  }

  editField(item: any, id: number) {
    this.btnLoading = '';
    this.simpleTabsRef.editItem(item, id).subscribe(
      (result) => {
        this.close();
        this.addSingle('success', 'Modification', 'Entit?? ' + this.itemLabel + ' modifi??e avec succ??s');
        this.getAllItems();
        this.editItem = false;
        this.editVisibility = false;
      },
      (error) => {
        if (error.error.code === 400) {
          this.simpleTabsRef.getFormErrors(error.error.errors, 'Modification');
        }
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
