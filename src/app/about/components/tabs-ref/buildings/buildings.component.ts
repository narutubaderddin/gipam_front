import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { NgDataTableComponent } from '@shared/components/ng-dataTables/ng-data-table/ng-data-table.component';
import { FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { OPERATORS, TYPES } from '@shared/services/column-filter.service';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { SimpleTabsRefService } from '@shared/services/simple-tabs-ref.service';
import { FieldsService } from '@shared/services/fields.service';
import { MessageService } from 'primeng/api';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-buildings',
  templateUrl: './buildings.component.html',
  styleUrls: ['./buildings.component.scss'],
  providers: [DatePipe],
})
export class BuildingsComponent implements OnInit {
  @ViewChild('content') modalRef: TemplateRef<any>;
  @ViewChild(NgDataTableComponent, { static: false }) dataTableComponent: NgDataTableComponent;

  loading = true;
  btnLoading: any = null;
  myModal: any;
  selectedItem: {
    name: '';
    address: '';
    cedex: '';
    distrib: '';
    startDate: '';
    disappearanceDate: '';
    site: {
      id: number;
      label: '';
    };
    commune: {
      id: number;
      name: '';
    };
  };
  sites: any[] = [];
  communes: any[] = [];
  selectedSite: any[] = [];
  selectedCommune: any[] = [];
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

  columns = [
    {
      header: 'Libellé',
      field: 'name',
      type: 'key',
      filter: true,
      filterType: 'text',
      sortable: true,
      width: '300px',
    },
    {
      header: 'Adresse',
      field: 'address',
      type: 'key',
      filter: true,
      filterType: 'text',
      sortable: true,
      width: '200px',
    },
    {
      header: 'CEDEX',
      field: 'cedex',
      type: 'key',
      filter: true,
      filterType: 'text',
      sortable: true,
    },
    {
      header: 'Distrib',
      field: 'distrib',
      type: 'key',
      filter: true,
      filterType: 'text',
      sortable: true,
    },
    {
      header: 'Site',
      field: 'site',
      type: 'key-array',
      key_data: ['site', 'label'],
    },
    {
      header: 'Commune',
      field: 'commune',
      type: 'key-array',
      key_data: ['commune', 'name'],
    },
    {
      header: 'Date début de validité',
      field: 'startDate',
      type: 'key',
      filter: true,
      filterType: 'range-date',
      sortable: true,
      width: '200px',
    },
    {
      header: 'Date fin de validité',
      field: 'disappearanceDate',
      type: 'key',
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
      width: '250px',
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
    this.simpleTabsRef.tabRef = 'buildings';
    this.getAllItems();
    this.today = this.datePipe.transform(new Date(), 'yyyy-MM-dd');
    this.initForm();

    // this.filter =
    //   this.activatedRoute.snapshot.queryParams.filter && this.activatedRoute.snapshot.queryParams.filter.length > 0;
  }

  initForm() {
    const startDate = this.datePipe.transform(this.selectedItem ? this.selectedItem.startDate : '', 'yyyy-MM-dd');
    const disappearanceDate = this.datePipe.transform(
      this.selectedItem ? this.selectedItem.disappearanceDate : '',
      'yyyy-MM-dd'
    );
    this.tabForm = this.fb.group({
      label: [this.selectedItem ? this.selectedItem.name : '', [Validators.required]],
      address: [this.selectedItem ? this.selectedItem.address : '', []],
      distrib: [this.selectedItem ? this.selectedItem.distrib : '', []],
      cedex: [this.selectedItem ? this.selectedItem.cedex : '', [Validators.required]],
      startDate: [startDate, [Validators.required]],
      disappearanceDate: [disappearanceDate, []],
      site: [this.selectedSite, [Validators.required]],
      commune: [this.selectedCommune, [Validators.required]],
      responsibles: ['', []],
    });
    this.tabForm.setValidators(this.ValidateDate());
  }

  openModal(item: any) {
    this.btnLoading = null;
    if (this.editItem || this.addItem) {
      this.getSites();
      this.getCommunes();
    }
    if (this.editItem || this.editVisibility) {
      this.itemToEdit = item;
      this.itemLabel = item.label;
      this.selectedSite = item.site ? item.site.label : '';
      this.selectedCommune = item.commune ? item.commune.name : '';
    }
    this.selectedItem = item;
    this.initForm();
    this.myModal = this.modalService.open(this.modalRef, { centered: true });
  }

  onSiteSelect(item: any) {
    this.selectedSite = item;
  }
  onCommuneSelect(item: any) {
    this.selectedCommune = item;
  }
  getSites() {
    const previousUrl = this.simpleTabsRef.tabRef;

    this.simpleTabsRef.tabRef = 'sites';

    this.simpleTabsRef.getAllItems({ limit: '10' }).subscribe(
      (result: any) => {
        this.sites = result.results;
        console.log('sites', this.sites);
      },
      (error: any) => {
        this.addSingle('error', '', error.error.message);
      }
    );
    this.simpleTabsRef.tabRef = previousUrl;
  }

  getCommunes() {
    const previousUrl = this.simpleTabsRef.tabRef;

    this.simpleTabsRef.tabRef = 'communes';

    this.simpleTabsRef.getAllItems({ limit: '100' }).subscribe(
      (result: any) => {
        this.communes = result.results;
        console.log('communes', this.communes);
      },
      (error: any) => {
        this.addSingle('error', '', error.error.message);
      }
    );
    this.simpleTabsRef.tabRef = previousUrl;
  }
  onSelectAll(items: any) {}

  ValidateDate(): ValidatorFn {
    return (cc: FormGroup): ValidationErrors => {
      if (!cc.get('startDate')) {
        return null;
      }
      if (cc.get('startDate').value > cc.get('disappearanceDate').value) {
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
      name: this.tabForm.value.label,
      address: this.tabForm.value.address,
      cedex: this.tabForm.value.cedex,
      distrib: this.tabForm.value.distrib,
      site: this.tabForm.value.site.id,
      commune: this.tabForm.value.commune.id,
      startDate: this.transformDateToDateTime(this.tabForm.value.startDate, 'yyy-MM-dd'),
      disappearanceDate: this.transformDateToDateTime(this.tabForm.value.disappearanceDate, 'yyy-MM-dd'),
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
    this.selectedSite = [];
    this.selectedCommune = [];
    this.openModal('');
  }

  deleteItem(data: any) {
    this.btnLoading = null;
    this.deleteItems = true;
    this.itemToDelete = data;
    this.itemLabel = data.name;
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
      name: item.name,
      address: item.address,
      cedex: item.cedex,
      distrib: item.distrib,
      startDate: item.startDate,
      disappearanceDate: item.disappearanceDate,
      site: item.site ? item.site : '',
      commune: item.commune ? item.commune : '',
      active: true,
    };
    newItem.startDate = item.startDate ? this.datePipe.transform(item.startDate, 'yyyy/MM/dd') : null;
    newItem.disappearanceDate = item.disappearanceDate
      ? this.datePipe.transform(item.disappearanceDate, 'yyyy/MM/dd')
      : null;
    newItem.active = this.isActive(newItem.disappearanceDate);
    return newItem;
  }

  getAllItems() {
    this.loading = true;
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
        this.addSingle('success', 'Suppression', 'Bâtiment ' + item.name + ' supprimée avec succés');
        this.getAllItems();
        this.deleteItems = false;
      },
      (error: any) => {
        this.close();
        if (error.error.code === 400) {
          this.addSingle('error', 'Suppression', 'Bâtiment ' + item.name + ' admet une relation');
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
        this.addSingle('success', 'Ajout', 'Bâtiment ' + item.name + ' ajoutée avec succés');
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
        this.addSingle('success', 'Modification', 'Bâtiment ' + item.name + ' modifiée avec succés');
        this.getAllItems();
        this.editItem = false;
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
