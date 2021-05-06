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
import { datePickerDateFormat, dateTimeFormat, towDatesCompare, viewDateFormat } from '@shared/utils/helpers';
import {forkJoin} from "rxjs";

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
    function:'';
    login:'';
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
  services: any[] = [];
  establishments: any[] = [];
  subDivisions: any[] = [];
  activeServices: any[] = [];
  activeEstablishments: any[] = [];
  activeSubDivisions: any[] = [];

  selectedService: any[] = [];
  selectedEstablishment: any[] = [];
  selectedSubDivision: any[] = [];
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

  relatedServicesColumn={
    header: 'Service',
    field: 'service',
    type: 'key-array',
    key_data: ['service', 'label'],
    filter: true,
    filterType: 'multiselect',
    placeholder: 'Services',
    selectData: this.services,
  };

  relatedEstablishmentsColumn={
    header: 'Etablissement',
    field: 'establishment',
    type: 'key-array',
    key_data: ['establishment', 'label'],
    filter: true,
    filterType: 'multiselect',
    placeholder: 'Etablissements',
    selectData: this.establishments,
  };

  relatedSubDivisionsColumn={
    header: 'Sous direction',
    field: 'subDivision',
    type: 'key-array',
    key_data: ['subDivision', 'label'],
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
      width: '120px',
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
      width: '200px',
    },
    {
      header: 'FAX',
      field: 'fax',
      type: 'key',
      filter: true,
      filterType: 'text',
      sortable: true,
      width: '100px',
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
      function: [this.selectedItem ? this.selectedItem.function : '', []],
      login: [this.selectedItem ? this.selectedItem.login : '', []],

      phone: [this.selectedItem ? this.selectedItem.phone : '', []],
      fax: [this.selectedItem ? this.selectedItem.fax : '', []],
      mail: [this.selectedItem ? this.selectedItem.mail : '', [Validators.email]],
      startDate: [startDate, [Validators.required]],
      endDate: [disappearanceDate, []],
      service: [this.selectedService ? this.selectedService : { label: '' }, []],
      establishment: [this.selectedEstablishment ? this.selectedEstablishment : { label: '' }, []],
      subDivision: [this.selectedSubDivision ? this.selectedSubDivision : { label: '' }, []],
    });
    this.tabForm.setValidators(this.ValidateDate());
    // this.tabForm.setValidators(towDatesCompare('startDate', 'endDate'));
  }
  initFilterData() {
    const data = {
      page: 1,
      'active[eq]': 1,
      serializer_group: JSON.stringify(['response', 'short']),
    };
    forkJoin([
      this.simpleTabsRef.getAllItems(data, 'services'),
      this.simpleTabsRef.getAllItems(data, 'establishments'),
      this.simpleTabsRef.getAllItems(data, 'subDivisions')
    ]).subscribe(
      ([relatedServicesResults, relatedEstablishmentsResults, relatedSubDivisionsResults]) => {
        this.services = this.simpleTabsRef.getTabRefFilterData(relatedServicesResults['results']);
        this.activeServices = this.simpleTabsRef.getTabRefFilterData(relatedServicesResults['results'])
          .filter((value: any) =>
          this.isActive(value.disappearanceDate)
        );

        this.establishments = this.simpleTabsRef.getTabRefFilterData(relatedEstablishmentsResults['results']);
        this.activeEstablishments = this.simpleTabsRef.getTabRefFilterData
        (relatedEstablishmentsResults['results']).filter((value: any) =>
          this.isActive(value.disappearanceDate)
        );
        this.subDivisions = this.simpleTabsRef.getTabRefFilterData(relatedSubDivisionsResults['results'])
        this.activeSubDivisions = this.simpleTabsRef.getTabRefFilterData
        (relatedSubDivisionsResults['results']).filter((value: any) =>
          this.isActive(value.disappearanceDate)
        );
        this.relatedServicesColumn.selectData = this.services;
        this.relatedEstablishmentsColumn.selectData = this.establishments;
        this.relatedSubDivisionsColumn.selectData = this.subDivisions;

      },
      (error: any) => {
        this.addSingle('error', 'Erreur Technique', ' Message: ' + error.error.message);
      }
    );
  }

  openModal(item: any) {
    this.btnLoading = null;
    console.log(item);
    if (this.editItem || this.addItem) {
      this.initFilterData();
      console.log(this.establishments);

    }
    if (this.editItem || this.editVisibility) {
      this.itemToEdit = item;
      this.itemLabel = item.firstName+' '+item.lastName;
      this.selectedService = item.service ? item.service.label : '';
      this.selectedEstablishment = item.establishment ? item.establishment.label : '';
      this.selectedSubDivision = item.subDivision ? item.subDivision.label : '';
    }
    this.selectedItem = item;
    this.initForm();
    this.myModal = this.modalService.open(this.modalRef, { centered: true });
  }

  onServiceSelect(item: any) {
    this.selectedService = item;
  }
  onEstablishmentSelect(item: any) {
    this.selectedEstablishment = item;

    const apiData = {
      page: 1,
      'active[eq]': 1,
    };
    const subDivisionApiData = Object.assign({}, apiData);
console.log('item', item)
    subDivisionApiData['establishments'] = JSON.stringify([item.value.id]);
    console.log("subDivisionApiData", subDivisionApiData)
    this.simpleTabsRef.getItemsByCriteria(subDivisionApiData, 'subDivisions').subscribe(
      (result) => {
        this.activeSubDivisions=this.simpleTabsRef.getTabRefFilterData(result.results);
        console.log("result of subdivisions",  this.activeSubDivisions)
      }
    );
  }
  onSubDivisionSelect(item: any) {
    this.selectedSubDivision = item;

    const apiData = {
      page: 1,
      'active[eq]': 1,
    };
    const serviceApiData = Object.assign({}, apiData);
    console.log('itemService', item)
    serviceApiData['subDivisions'] = JSON.stringify([item.value.id]);
    console.log("serviceApiData", serviceApiData)
    this.simpleTabsRef.getItemsByCriteria(serviceApiData, 'services').subscribe(
      (result) => {
        this.activeServices=this.simpleTabsRef.getTabRefFilterData(result.results);
        console.log("result of services",  this.activeServices)
      }
    );
  }


  onSelectAll(items: any) {}

  ValidateDate(): ValidatorFn {
    return (cc: FormGroup): ValidationErrors => {
      if (!cc.get('startDate')) {
        return null;
      }
      if (cc.get('startDate').value > cc.get('endDate').value) {
        return { dateInvalid: 'Date début supérieur date fin' };
      }
      return null;
    };
  }

  transformDateToDateTime(input: string, format: string, addTime: boolean = true) {
    // 1984-06-05 12:15:30
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
      firstName: this.tabForm.value.firstName,
      lastName: this.tabForm.value.lastName,
      function: this.tabForm.value.function,
      login: this.tabForm.value.login,
      phone: this.tabForm.value.phone,
      fax: this.tabForm.value.fax,
      mail: this.tabForm.value.mail,
      service: this.tabForm.value.service.id,
      establishment: this.tabForm.value.establishment.id,
      subDivision: this.tabForm.value.subDivision.id,
      startDate: this.datePipe.transform(this.tabForm.value.startDate, dateTimeFormat),
      endDate: this.datePipe.transform(this.tabForm.value.endDate, dateTimeFormat),
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
    this.selectedSubDivision = [];
    this.selectedEstablishment = [];
    this.selectedService = [];
    this.openModal('');
  }

  deleteItem(data: any) {
    this.btnLoading = null;
    this.deleteItems = true;
    this.itemToDelete = data;
    this.itemLabel = data.firstName+' '+data.lastName;
    console.log(this.itemLabel);
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
  convertItem(item: any) {
    const newItem = {
      id: item.id,
      firstName: item.firstName,
      lastName: item.lastName,
      function: item.function,
      login: item.login,
      phone: item.phone,
      fax: item.fax,
      mail: item.mail,
      startDate: item.startDate,
      endDate: item.endDate,
      establishment: item.establishment ? item.establishment : '',
      subDivision: item.subDivision ? item.subDivision : '',
      service: item.service ? item.service : '',
      active: true,
    };

    newItem.startDate = item.startDate ? this.datePipe.transform(item.startDate, 'yyyy/MM/dd') : null;
    newItem.endDate = item.endDate ? this.datePipe.transform(item.endDate, 'yyyy/MM/dd') : null;
    newItem.active = this.isActive(newItem.endDate);
    console.log(this.isActive(newItem.endDate));
    return newItem;
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
    console.log(params);
    this.simpleTabsRef.getAllItems(params).subscribe(
      (result: any) => {
        console.log(result);
        this.items = result.results.map((item: any) => {
          return this.convertItem(item);
        });
        console.log(result, this.items);
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
    console.log(item);
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
    console.log(item);
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
        console.log(error);
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
