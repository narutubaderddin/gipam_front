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
import {
  datePickerDateFormat,
  dateTimeFormat,
  getMultiSelectIds,
  markAsDirtyDeep,
  oneOfTheseFields,
  towDatesCompare,
} from '@shared/utils/helpers';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-responsible',
  templateUrl: './responsible.component.html',
  styleUrls: ['./responsible.component.scss'],
  providers: [DatePipe],
})
export class ResponsibleComponent implements OnInit {
  @ViewChild('content') modalRef: TemplateRef<any>;
  @ViewChild(NgDataTableComponent, { static: false }) dataTableComponent: NgDataTableComponent;

  loading = true;
  btnLoading: any = null;
  myModal: any;
  selectedItem: {
    firstName: '';
    lastName: '';

    login: '';
    phone: '';
    mail: '';
    building: {
      id: number;
      name: '';
    };
    startDate: '';
    endDate: '';
  };

  relatedEntities: {
    regions: any[];
    departments: any[];
    communes: any[];
    sites: any[];
    buildings: any[];
  } = {
    regions: [],
    departments: [],
    communes: [],
    sites: [],
    buildings: [],
  };

  selectedRelated: {
    region: any;
    departments: any[];
    commune: any;
    site: any;
    buildings: any[];
  } = {
    region: null,
    departments: [],
    commune: null,
    site: null,
    buildings: [],
  };

  buildings: any[] = [];
  departments: any[] = [];
  regions: any[] = [];

  activeBuildings: any[] = [];

  selectedRegion: any;
  selectedBuildings: any[] = [];
  selectedDepartments: any[] = [];

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

  filter = '';
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

  relatedBuildingsColumn = {
    header: 'B??timents',
    field: 'buildings',
    type: 'key-multiple-data',
    key_multiple_data: ['buildings', 'name'],
    filter: true,
    filterType: 'multiselect',
    placeholder: 'Filtrer par b??timents',
    selectData: this.buildings,
  };

  relatedRegionColumn = {
    header: 'Region',
    field: 'region',
    type: 'key-array',
    key_data: ['region', 'name'],
    filter: true,
    filterType: 'multiselect',
    placeholder: 'Filtrer par r??gions',
    selectData: this.regions,
  };
  relatedDepartmentsColumn = {
    header: 'D??partements',
    field: 'departments',
    type: 'key-multiple-data',
    key_multiple_data: ['departments', 'name'],
    filter: true,
    filterType: 'multiselect',
    placeholder: 'Filtrer par d??partements',
    selectData: this.departments,
  };

  columns = [
    {
      header: 'Pr??nom',
      field: 'firstName',
      type: 'key',
      filter: true,
      filterType: 'text',
      sortable: true,
    },
    {
      header: 'Nom',
      field: 'lastName',
      type: 'key',
      filter: true,
      filterType: 'text',
      sortable: true,
    },

    {
      header: 'T??l??phone',
      field: 'phone',
      type: 'key',
      filter: true,
      filterType: 'text',
      sortable: true,
    },
    {
      header: 'E-mail',
      field: 'mail',
      type: 'key',
      filter: true,
      filterType: 'text',
      sortable: true,
    },
    {
      header: 'Connexion',
      field: 'login',
      type: 'key',
      filter: true,
      filterType: 'text',
      sortable: true,
    },
    this.relatedRegionColumn,
    this.relatedDepartmentsColumn,
    this.relatedBuildingsColumn,
    {
      header: 'Date d??but de validit??',
      field: 'startDate',
      type: 'date',
      filter: true,
      filterType: 'range-date',
      sortable: true,
    },
    {
      header: 'Date fin de validit??',
      field: 'endDate',
      type: 'date',
      filter: true,
      filterType: 'range-date',
      sortable: true,
    },
    {
      header: 'Actions',
      field: 'action',
      type: 'app-actions-cell',
      sortable: false,
      filter: false,
      width: '150px',
    },
  ];

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
    this.simpleTabsRef.tabRef = 'responsibles';
    this.initFilterData();
    this.getAllItems();
    this.initForm();
  }

  initForm() {
    const startDate = this.datePipe.transform(
      this.selectedItem ? this.selectedItem.startDate : new Date(),
      datePickerDateFormat
    );
    const disappearanceDate = this.datePipe.transform(
      this.selectedItem ? this.selectedItem.endDate : '',
      datePickerDateFormat
    );
    this.tabForm = this.fb.group({
      firstName: [this.selectedItem ? this.selectedItem.firstName : null, [Validators.required]],
      lastName: [this.selectedItem ? this.selectedItem.lastName : null, [Validators.required]],

      login: [this.selectedItem ? this.selectedItem.login : '', []],

      phone: [this.selectedItem ? this.selectedItem.phone : '', [Validators.required]],
      mail: [this.selectedItem ? this.selectedItem.mail : '', [Validators.required, Validators.email]],
      startDate: [startDate, [Validators.required]],
      endDate: [disappearanceDate, []],
      region: [this.selectedRegion, []],
      buildings: [
        {
          value: this.selectedBuildings,
          disabled: !this.selectedRelated.commune && !this.selectedRelated.site && this.selectedBuildings.length === 0,
        },
        [],
      ],
      departments: [this.selectedDepartments, []],
    });
    this.tabForm.setValidators([
      towDatesCompare('startDate', 'endDate'),
      oneOfTheseFields('region', 'departments', 'buildings'),
    ]);
  }

  initFilterData() {
    const data = {
      page: 1,
      'active[eq]': 1,
      serializer_group: JSON.stringify(['response', 'short']),
    };
    forkJoin([
      this.simpleTabsRef.getAllItems(data, 'regions'),
      this.simpleTabsRef.getAllItems(data, 'departments'),
      this.simpleTabsRef.getAllItems(data, 'buildings'),
    ]).subscribe(
      ([regionsResults, departmentsResults, buildingsResults]) => {
        this.regions = this.simpleTabsRef.getTabRefFilterData(regionsResults.results);
        this.relatedRegionColumn.selectData = this.regions;
        this.departments = this.simpleTabsRef.getTabRefFilterData(departmentsResults.results);
        this.relatedDepartmentsColumn.selectData = this.departments;
        this.buildings = this.simpleTabsRef.getTabRefFilterData(buildingsResults.results);
        this.relatedBuildingsColumn.selectData = this.buildings;
      },
      (error: any) => {
        this.addSingle('error', 'Erreur Technique', ' Message: ' + error.error.message);
      }
    );
  }

  initFormDropdowns() {
    const data = {
      page: 1,
      serializer_group: JSON.stringify(['short']),
      'disappearanceDate[gtOrNull]': this.datePipe.transform(new Date(), dateTimeFormat),
    };
    forkJoin([
      this.simpleTabsRef.getAllItems(data, 'regions'),
      this.simpleTabsRef.getAllItems(data, 'departments'),
    ]).subscribe(
      ([regionsResults, departmentsResults]) => {
        this.relatedEntities.regions = regionsResults.results;
        this.relatedEntities.departments = departmentsResults.results;
      },
      (error: any) => {
        this.addSingle('error', 'Erreur Technique', 'Une erreur technique est survenue');
      }
    );
  }

  openModal(item: any) {
    this.resetRelatedEntities();
    this.initFormDropdowns();
    this.btnLoading = null;

    if (this.editItem || this.editVisibility) {
      this.itemToEdit = item;
      this.itemLabel = item.firstName + ' ' + item.lastName;
      this.selectedDepartments = item.departments;
      this.selectedRegion = item.region;
      this.relatedEntities.departments = item.departments;
      this.selectedBuildings = item.buildings;
      this.relatedEntities.buildings = item.buildings;
      this.tabForm.get('departments').enable();
      this.tabForm.get('buildings').enable();
    }
    this.selectedItem = item;
    this.initForm();
    this.myModal = this.modalService.open(this.modalRef, { centered: true });
  }

  submit() {
    if (this.tabForm.invalid) {
      markAsDirtyDeep(this.tabForm);
      this.addSingle('error', 'Erreur', 'Veuillez v??rifier tous les champs encadr??s en rouge');
      if (this.tabForm.errors?.oneOfTheseFields) {
        this.addSingle(
          'error',
          'Erreur',
          'Un responsable doit avoir au moins une R??gion ou un D??partement ou un B??timent'
        );
      }
      if (this.tabForm.errors?.dateInvalid) {
        this.addSingle('error', 'Erreur', this.tabForm.errors.dateInvalid);
      }
      return;
    }

    this.btnLoading = null;
    // this.tabForm.value.buildings.map((el: any) => selectedBuildings.push(el.id));

    let item = {};
    if (this.addItem || this.editItem) {
      item = {
        firstName: this.tabForm.value.firstName,
        lastName: this.tabForm.value.lastName,
        login: this.tabForm.value.login,
        phone: this.tabForm.value.phone,
        mail: this.tabForm.value.mail,
        region: this.tabForm.value.region?.id,
        departments: getMultiSelectIds(this.tabForm.value.departments),
        buildings: getMultiSelectIds(this.tabForm.value.buildings),
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
    this.selectedDepartments = [];
    this.selectedRegion = null;
    this.selectedBuildings = [];
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

    this.openModal('');
  }

  deleteItem(data: any) {
    this.btnLoading = null;
    this.deleteItems = true;
    this.itemToDelete = data;

    this.itemLabel = data.firstName + ' ' + data.lastName;

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

  getDropdownData(entity: string, relatedEntityName?: string, relatedEntity?: any) {
    const params = {
      page: 1,
      serializer_group: JSON.stringify(['short']),
      'disappearanceDate[gtOrNull]': this.datePipe.transform(new Date(), dateTimeFormat),
    };
    if (relatedEntity) {
      if (!Array.isArray(relatedEntity)) {
        params[relatedEntityName + '[eq]'] = relatedEntity.id;
      } else {
        params[relatedEntityName + '[in]'] = getMultiSelectIds(relatedEntity);
      }
    }

    this.resetRelatedEntities(relatedEntityName);
    entity = entity + 's';
    this.relatedEntities[entity] = [];
    this.simpleTabsRef.getAllItems(params, entity).subscribe((dataResult) => {
      this.relatedEntities[entity] = dataResult.results;
    });
  }

  resetRelatedEntities(relatedEntityName?: string) {
    if (!relatedEntityName) {
      Object.keys(this.selectedRelated).forEach((key) => {
        this.selectedRelated[key] = null;
      });
      Object.keys(this.relatedEntities).forEach((key) => {
        this.relatedEntities[key] = [];
      });
    }
    if (relatedEntityName === 'region') {
      this.tabForm.get('departments').setValue(null);
      this.tabForm.get('departments').enable();
    }
    if (relatedEntityName === 'site') {
      this.tabForm.get('buildings').setValue(null);
      this.tabForm.get('buildings').enable();
      this.relatedEntities.communes = [];
      this.selectedRelated.commune = null;
    }
    if (relatedEntityName === 'commune') {
      this.tabForm.get('buildings').setValue(null);
      this.tabForm.get('buildings').enable();
      this.relatedEntities.sites = [];
      this.selectedRelated.site = null;
    }
  }

  autoComplete(event: any, entity: string, field: string) {
    const params = {
      page: 1,
      serializer_group: JSON.stringify(['short']),
    };
    params[field + '[startsWith]'] = event.query;
    entity = entity + 's';
    this.simpleTabsRef.getAllItems(params, entity).subscribe((dataResult) => {
      this.relatedEntities[entity] = dataResult.results;
    });
  }

  autoCompleteCommune(event: any, entity: string, field: string) {
    const params = {
      page: 1,
      serializer_group: JSON.stringify(['short', 'response']),
      search: event.query,
    };
    params[field + '[startsWith]'] = event.query;
    if (this.tabForm.get('region').value) {
      params['region'] = JSON.stringify([this.tabForm.get('region').value.id]);
    }
    if (this.tabForm.get('departments').value && this.tabForm.get('departments').value.length !== 0) {
      params['department'] = JSON.stringify(getMultiSelectIds(this.tabForm.get('departments').value));
    }
    entity = entity + 's';
    this.simpleTabsRef.getItemsByCriteria(params, entity).subscribe((dataResult) => {
      this.relatedEntities[entity] = dataResult.results;
    });
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

    this.simpleTabsRef.getAllItems(params).subscribe(
      (result: any) => {
        this.items = result.results.map((item: any) => {
          return Object.assign({ active: this.isActive(item.endDate) }, item);
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
        this.addSingle(
          'success',
          'Suppression',
          'Responsable ' + item.firstName + ' ' + item.lastName + ' supprim??e avec succ??s'
        );
        this.getAllItems();
        this.deleteItems = false;
      },
      (error: any) => {
        this.close();
        if (error.error.code === 400) {
          this.addSingle(
            'error',
            'Suppression',
            'Responsable ' + item.firstName + ' ' + item.lastName + ' admet une relation'
          );
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
        this.addSingle(
          'success',
          'Ajout',
          'Responsable ' + item.firstName + ' ' + item.lastName + ' ajout??e avec succ??s'
        );
        this.getAllItems();
        this.addItem = false;
      },
      (error) => {
        if (error.error.code !== 400) {
          this.addSingle('error', 'Ajout', error.error.message);
        } else {
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
        this.addSingle(
          'success',
          'Modification',
          'Responsable ' + item.firstName + ' ' + item.lastName + ' modifi??e avec succ??s'
        );
        this.getAllItems();
        this.editItem = false;
      },
      (error) => {
        if (error.error.code !== 400) {
          this.addSingle('error', 'Modification', error.error.message);
        } else {
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

    this.dataTableSearchBar = { search: input };
    this.getAllItems();
  }

  ClearSearch(event: Event, input: string) {
    if (!event['inputType']) {
      this.search(input);
    }
  }
}
