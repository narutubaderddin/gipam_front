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
  markAsDirtyDeep,
  oneOfTheseFields,
  tabRefFormBackendErrorMessage,
  towDatesCompare,
} from '@shared/utils/helpers';

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
  selectedSite: any;
  selectedCommune: any;
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
  }

  initForm() {
    const startDate = this.datePipe.transform(
      this.selectedItem ? this.selectedItem.startDate : new Date(),
      datePickerDateFormat
    );
    const disappearanceDate = this.datePipe.transform(
      this.selectedItem ? this.selectedItem.disappearanceDate : '',
      datePickerDateFormat
    );
    this.tabForm = this.fb.group({
      label: [this.selectedItem ? this.selectedItem.name : '', [Validators.required]],
      address: [this.selectedItem ? this.selectedItem.address : '', []],
      distrib: [this.selectedItem ? this.selectedItem.distrib : '', []],
      cedex: [this.selectedItem ? this.selectedItem.cedex : '', [Validators.required]],
      startDate: [startDate, [Validators.required]],
      disappearanceDate: [disappearanceDate, []],
      site: [this.selectedSite, []],
      commune: [this.selectedCommune, []],
      responsibles: ['', []],
    });
    this.tabForm.setValidators([
      towDatesCompare('startDate', 'disappearanceDate'),
      oneOfTheseFields('commune', 'site'),
    ]);
  }

  openModal(item: any) {
    console.log('edit item', item);
    this.btnLoading = null;
    if (this.editItem || this.editVisibility) {
      this.itemToEdit = item;
      this.itemLabel = item.label;
      this.selectedSite = item.site;
      this.selectedCommune = item.commune;
    }
    this.selectedItem = item;
    this.initForm();
    this.myModal = this.modalService.open(this.modalRef, { centered: true });
  }

  onSiteSelect(item: any) {
    this.selectedSite = item;
    this.tabForm.get('commune').setValue(null);
  }
  onCommuneSelect(item: any) {
    this.selectedCommune = item;
    this.tabForm.get('site').setValue(null);
  }

  autoCompleteCommunes(event: any) {
    this.tabForm.get('commune').setValue(null);
    const params = {
      page: 1,
      serializer_group: JSON.stringify(['short']),
      'disappearanceDate[gtOrNull]': this.datePipe.transform(new Date(), dateTimeFormat),
      'name[startsWith]': event.query,
    };
    this.simpleTabsRef.getAllItems(params, 'communes').subscribe((dataResult) => {
      this.communes = dataResult.results;
    });
  }

  autoCompleteSites(event: any) {
    this.tabForm.get('site').setValue(null);
    const params = {
      page: 1,
      serializer_group: JSON.stringify(['short']),
      'disappearanceDate[gtOrNull]': this.datePipe.transform(new Date(), dateTimeFormat),
      'label[startsWith]': event.query,
    };
    this.simpleTabsRef.getAllItems(params, 'sites').subscribe((dataResult) => {
      this.sites = dataResult.results;
    });
  }

  onSelectAll(items: any) {}

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
    if (this.tabForm.invalid) {
      markAsDirtyDeep(this.tabForm);
      this.addSingle('error', 'Erreur', 'Veuillez vérifier tous les champs encadrés en rouge');
      if (this.tabForm.errors?.oneOfTheseFields) {
        this.addSingle('error', 'Erreur', 'Un bâtiment doit être lié à une Commune ou un Site');
      }
      if (this.tabForm.errors?.dateInvalid) {
        this.addSingle('error', 'Erreur', this.tabForm.errors.dateInvalid);
      }
      return;
    }
    this.btnLoading = null;
    const item = {
      name: this.tabForm.value.label,
      address: this.tabForm.value.address,
      cedex: this.tabForm.value.cedex,
      distrib: this.tabForm.value.distrib,
      site: this.tabForm.value.site?.id,
      commune: this.tabForm.value.commune?.id,
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

    this.simpleTabsRef.addItem(item).subscribe(
      (result: any) => {
        this.close();
        this.addSingle('success', 'Ajout', 'Bâtiment ' + item.name + ' ajoutée avec succés');
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
        this.addSingle('success', 'Modification', 'Bâtiment ' + item.name + ' modifiée avec succés');
        this.getAllItems();
        this.editItem = false;
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
