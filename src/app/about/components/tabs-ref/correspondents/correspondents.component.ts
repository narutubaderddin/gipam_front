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
  selector: 'app-correspondents',
  templateUrl: './correspondents.component.html',
  styleUrls: ['./correspondents.component.scss'],
  providers: [DatePipe],
})
export class CorrespondentsComponent implements OnInit {
  @ViewChild('content') modalRef: TemplateRef<any>;
  @ViewChild(NgDataTableComponent, { static: false }) dataTableComponent: NgDataTableComponent;

  loading = true;
  btnLoading: any = null;
  myModal: any;
  selectedItem: {
    firstName: '';
    lastName: '';
    function: '';
    login: '';
    phone: '';
    fax: '';
    mail: '';
    establishment: {
      id: number;
      name: '';
    };
    subDivision: {
      id: number;
      name: '';
    };
    service: {
      id: number;
      name: '';
    };
    startDate: '';
    endDate: '';
  };

  relatedEntities: {
    establishments: any[];
    subDivisions: any[];
    services: any[];
  } = {
    establishments: [],
    subDivisions: [],
    services: [],
  };

  selectedRelated: {
    establishment: any;
    subDivisions: any[];
    services: any;
  } = {
    establishment: null,
    subDivisions: [],
    services: null,
  };

  services: any[] = [];
  establishments: any[] = [];
  subDivisions: any[] = [];

  selectedServices: any[] = [];
  selectedEstablishment: any;
  selectedSubDivisions: any[] = [];

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

  relatedServicesColumn = {
    header: 'Services',
    field: 'services',
    type: 'key-multiple-data',
    key_multiple_data: ['services', 'label'],
    filter: true,
    filterType: 'multiselect',
    placeholder: 'Services',
    selectData: this.services,
  };

  relatedEstablishmentsColumn = {
    header: 'Etablissement',
    field: 'establishment',
    type: 'key-array',
    key_data: ['establishment', 'label'],
    filter: true,
    filterType: 'multiselect',
    placeholder: 'Etablissements',
    selectData: this.establishments,
    sortable: true,
  };

  relatedSubDivisionsColumn = {
    header: 'Sous direction',
    field: 'subDivisions',
    type: 'key-multiple-data',
    key_multiple_data: ['subDivisions', 'label'],
    filter: true,
    filterType: 'multiselect',
    placeholder: 'Sous direction',
    selectData: this.subDivisions,
  };

  columns = [
    {
      header: 'Prénom',
      field: 'firstName',
      type: 'key',
      filter: true,
      filterType: 'text',
      sortable: true,
      width: '120px',
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
      header: 'Fonction',
      field: 'function',
      type: 'key',
      filter: true,
      filterType: 'text',
      sortable: true,
    },
    {
      header: 'Téléphone',
      field: 'phone',
      type: 'key',
      filter: true,
      filterType: 'text',
      sortable: true,
    },
    {
      header: 'FAX',
      field: 'fax',
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
    this.relatedEstablishmentsColumn,
    this.relatedServicesColumn,
    this.relatedSubDivisionsColumn,
    {
      header: 'Date début de validité',
      field: 'startDate',
      type: 'date',
      filter: true,
      filterType: 'range-date',
      sortable: true,
      width: '170px',
    },
    {
      header: 'Date fin de validité',
      field: 'endDate',
      type: 'date',
      filter: true,
      filterType: 'range-date',
      sortable: true,
      width: '170px',
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
    this.simpleTabsRef.tabRef = 'correspondents';
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
      firstName: [this.selectedItem ? this.selectedItem.firstName : '', [Validators.required]],
      lastName: [this.selectedItem ? this.selectedItem.lastName : '', [Validators.required]],
      function: [this.selectedItem ? this.selectedItem.function : '', [Validators.required]],
      login: [this.selectedItem ? this.selectedItem.login : '', []],

      phone: [this.selectedItem ? this.selectedItem.phone : '', [Validators.required]],
      fax: [this.selectedItem ? this.selectedItem.fax : '', [Validators.required]],
      mail: [this.selectedItem ? this.selectedItem.mail : '', [Validators.required, Validators.email]],
      startDate: [startDate, [Validators.required]],
      endDate: [disappearanceDate, []],
      establishment: [this.selectedEstablishment, [Validators.required]],
      subDivisions: [
        {
          value: this.selectedSubDivisions,
          disabled: !this.selectedEstablishment && this.selectedSubDivisions.length === 0,
        },
        [],
      ],
      services: [
        {
          value: this.selectedServices,
          disabled: !this.selectedEstablishment && this.selectedServices.length === 0,
        },
        [],
      ],
    });
    this.tabForm.setValidators([
      towDatesCompare('startDate', 'endDate'),
      oneOfTheseFields('establishment', 'subDivisions', 'services'),
    ]);
  }

  initFilterData() {
    const previousUrl = this.simpleTabsRef.tabRef;
    const data = {
      page: 1,
      'active[eq]': 1,
      serializer_group: JSON.stringify(['response', 'short']),
    };
    forkJoin([
      this.simpleTabsRef.getAllItems(data, 'services'),
      this.simpleTabsRef.getAllItems(data, 'establishments'),
      this.simpleTabsRef.getAllItems(data, 'subDivisions'),
    ]).subscribe(
      ([relatedServicesResults, relatedEstablishmentsResults, relatedSubDivisionsResults]) => {
        this.services = this.simpleTabsRef.getTabRefFilterData(relatedServicesResults.results);
        this.establishments = this.simpleTabsRef.getTabRefFilterData(relatedEstablishmentsResults.results);
        this.subDivisions = this.simpleTabsRef.getTabRefFilterData(relatedSubDivisionsResults.results);

        this.relatedServicesColumn.selectData = this.services;
        this.relatedEstablishmentsColumn.selectData = this.establishments;
        this.relatedSubDivisionsColumn.selectData = this.subDivisions;
      },
      (error: any) => {
        this.addSingle('error', 'Erreur Technique', ' Message: ' + error.error.message);
      }
    );
    this.simpleTabsRef.tabRef = previousUrl;
  }

  initFormDropdowns() {
    const data = {
      page: 1,
      serializer_group: JSON.stringify(['short']),
      'disappearanceDate[gtOrNull]': this.datePipe.transform(new Date(), dateTimeFormat),
    };
    forkJoin([this.simpleTabsRef.getAllItems(data, 'establishments')]).subscribe(
      ([establishmentsResults]) => {
        this.relatedEntities.establishments = establishmentsResults.results;
      },
      (error: any) => {
        this.addSingle('error', 'Erreur Technique', 'Une erreur technique est survenue');
      }
    );
    if (this.selectedEstablishment) {
      this.onEstablishmentSelect({ value: this.selectedEstablishment });
    }
    if (this.selectedSubDivisions.length !== 0) {
      this.onSubDivisionSelect({ value: this.selectedSubDivisions });
    }
  }

  resetRelatedEntities(relatedEntityName?: string) {
    let unset = false;
    Object.keys(this.selectedRelated).forEach((key) => {
      if (key === relatedEntityName) {
        unset = true;
      }
      if (unset || !relatedEntityName) {
        this.selectedRelated[key] = null;
      }
    });
  }

  openModal(item: any) {
    this.resetRelatedEntities();
    this.btnLoading = null;

    if (this.editItem || this.editVisibility) {
      this.itemToEdit = item;
      this.itemLabel = item.firstName + ' ' + item.lastName;
      this.selectedEstablishment = item.establishment;
      this.selectedServices = item.services;
      this.selectedSubDivisions = item.subDivisions;
    }
    this.selectedItem = item;

    this.initFormDropdowns();
    this.initForm();
    this.myModal = this.modalService.open(this.modalRef, { centered: true });
  }

  onServiceSelect(item: any) {
    this.selectedServices = item;
  }

  onEstablishmentSelect(item: any) {
    if (!item.value) {
      this.selectedEstablishment = null;
      this.selectedSubDivisions = null;
      this.selectedServices = null;
      this.resetRelatedEntities();
      this.tabForm.get('subDivisions').disable();
      this.tabForm.get('subDivisions').setValue(null);
      this.tabForm.get('services').disable();
      this.tabForm.get('services').setValue(null);
      return;
    }
    const apiData = {
      page: 1,
      serializer_group: JSON.stringify(['short', 'response']),
      'endDate[gtOrNull]': this.datePipe.transform(new Date(), dateTimeFormat),
      establishments: JSON.stringify([item.value.id]),
    };

    this.simpleTabsRef.getItemsByCriteria(apiData, 'subDivisions').subscribe((result) => {
      this.relatedEntities.subDivisions = result.results;
      this.tabForm.get('subDivisions').enable();
    });
    this.getServicesByEstablishment(item.value.id);
  }

  getServicesByEstablishment(establishmentId: number) {
    const apiData = {
      page: 1,
      serializer_group: JSON.stringify(['short', 'response']),
      'disappearanceDate[gtOrNull]': this.datePipe.transform(new Date(), dateTimeFormat),
      establishments: JSON.stringify([establishmentId]),
    };

    this.simpleTabsRef.getItemsByCriteria(apiData, 'services').subscribe((result) => {
      this.relatedEntities.services = result.results;
      this.tabForm.get('services').enable();
    });
  }

  onSubDivisionSelect(item: any) {
    const apiData = {
      page: 1,
      serializer_group: JSON.stringify(['short', 'response']),
      'disappearanceDate[gtOrNull]': this.datePipe.transform(new Date(), dateTimeFormat),
    };
    apiData['subDivisions'] = JSON.stringify(getMultiSelectIds(item.value));
    this.simpleTabsRef.getItemsByCriteria(apiData, 'services').subscribe((result) => {
      this.relatedEntities.services = result.results;
      this.tabForm.get('services').enable();
    });
  }

  submit() {
    if (this.tabForm.invalid) {
      markAsDirtyDeep(this.tabForm);
      this.addSingle('error', 'Erreur', 'Veuillez vérifier tous les champs encadrés en rouge');
      if (this.tabForm.errors?.oneOfTheseFields) {
        this.addSingle(
          'error',
          'Erreur',
          'Un correspondant doit avoir au moins un Etablissement ou une Sous-Direction ou un Service'
        );
      }
      if (this.tabForm.errors?.dateInvalid) {
        this.addSingle('error', 'Erreur', this.tabForm.errors.dateInvalid);
      }
      return;
    }

    this.btnLoading = null;
    let item = {};
    if (this.addItem || this.editItem) {
      item = {
        firstName: this.tabForm.value.firstName,
        lastName: this.tabForm.value.lastName,
        function: this.tabForm.value.function,
        login: this.tabForm.value.login,
        phone: this.tabForm.value.phone,
        fax: this.tabForm.value.fax,
        mail: this.tabForm.value.mail,
        establishment: this.tabForm.value.establishment.id,
        subDivisions: getMultiSelectIds(this.tabForm.value.subDivisions),
        services: getMultiSelectIds(this.tabForm.value.services),
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
    this.selectedEstablishment = null;
    this.selectedSubDivisions = [];
    this.selectedServices = [];
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
    this.selectedEstablishment = null;
    this.selectedSubDivisions = [];
    this.selectedServices = [];
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

  isActive(endDate: string) {
    const today = this.datePipe.transform(new Date(), datePickerDateFormat);
    return !(endDate !== '' && endDate && endDate <= today);
  }

  getAllItems() {
    this.loading = true;
    let params = {
      limit: this.limit,
      page: this.page,
      sort_by: this.sortBy,
      sort: this.sort,
      serializer_group: JSON.stringify(['short', 'response', 'correspondent']),
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
          'Correspondant ' + item.firstName + ' ' + item.lastName + ' supprimée avec succés'
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
            'Correspondant ' + item.firstName + ' ' + item.lastName + ' admet une relation'
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
          'Correspondant ' + item.firstName + ' ' + item.lastName + ' ajoutée avec succés'
        );
        this.getAllItems();
        this.addItem = false;
      },
      (error) => {
        this.addSingle('error', 'Ajout', error.error.message);
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
        this.addSingle(
          'success',
          'Modification',
          'Correspondant ' + item.firstName + ' ' + item.lastName + ' modifiée avec succés'
        );
        this.getAllItems();
        this.editItem = false;
      },
      (error) => {
        this.addSingle('error', 'Modification', error.error.message);
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

    this.dataTableSearchBar = { search: input };
    this.getAllItems();
  }

  ClearSearch(event: Event, input: string) {
    if (!event['inputType']) {
      this.search(input);
    }
  }
}
