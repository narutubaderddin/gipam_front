import {Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {NgDataTableComponent} from '@shared/components/ng-dataTables/ng-data-table/ng-data-table.component';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {IDropdownSettings} from 'ng-multiselect-dropdown';
import {OPERATORS, TYPES} from '@shared/services/column-filter.service';
import {ActivatedRoute, Router} from '@angular/router';
import {NgbModal, NgbModalConfig} from '@ng-bootstrap/ng-bootstrap';
import {SimpleTabsRefService} from '@shared/services/simple-tabs-ref.service';
import {FieldsService} from '@shared/services/fields.service';
import {MessageService} from 'primeng/api';
import {DatePipe} from '@angular/common';

@Component({
  selector: 'app-ministry',
  templateUrl: './ministry.component.html',
  styleUrls: ['./ministry.component.scss'],
  providers: [DatePipe]
})
export class MinistryComponent implements OnInit {

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
  };
  selectedMinistry: any[] = [];
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

  filter='';
  sortBy = '';
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

  items: any;

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
      header: 'Sigle',
      field: 'acronym',
      type: 'key',
      filter: true,
      filterType: 'text',
      sortable: true,
      width: '200px',
    },
    {
      header: 'Date début de validité',
      field: 'startDate',
      type: 'key',
      filter: true,
      filterType: 'range-date',
      sortable: true,
      width: '250px',
    },
    {
      header: 'Date fin de validité',
      field: 'disappearanceDate',
      type: 'key',
      filter: true,
      filterType: 'range-date',
      sortable: true,
      width: '250px',
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

  fieldNames = {
    name: 'Libellé',
    acronym: 'Sigle',
    startDate: 'Date début de validité',
    disappearanceDate:'Date fin de validité'
  };
  params = {
    limit: this.limit,
    page: this.page,
    'label[contains]': this.filter,
    sort_by: this.sortBy,
    sort: this.sort,
  };
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

    this.simpleTabsRef.tabRef = 'ministries';
    this.getAllItems();
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
      label: [this.selectedItem ? this.selectedItem.label : '', [Validators.required]],
      acronym: [this.selectedItem ? this.selectedItem.acronym : '', [Validators.required]],
      startDate: [startDate, [Validators.required]],
      disappearanceDate: [disappearanceDate, [Validators.required]],
      // ministry: [this.selectedMinistry, [Validators.required]],
    });
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
      this.selectedMinistry = [
        {
          id: item.ministryId,
          name: item.ministryName,
        },
      ];
    }
    // if (this.editItem || this.addItem) {
    //   this.getMinistries();
    // }
    this.selectedItem = item;
    this.initForm();
    this.myModal = this.modalService.open(this.modalRef, { centered: true });
  }

  onMinistrySelect(item: any) {
    this.selectedMinistry = item;
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
    this.btnLoading = null;
    const item = {
      name: this.tabForm.value.label,
      acronym: this.tabForm.value.acronym,
      startDate: this.transformDateToDateTime(this.tabForm.value.startDate, 'yyy-MM-dd'),
      disappearanceDate: this.transformDateToDateTime(this.tabForm.value.disappearanceDate, 'yyy-MM-dd'),
      // ministry: this.tabForm.value.ministry[0].id,
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
    this.editVisibility=false;
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
    this.selectedMinistry = [];
    this.openModal('');
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
    const today = this.datePipe.transform(new Date(), 'yyyy/MM/dd');
    return !(endDate !== '' && endDate && endDate <= today);
  }

  convertItem(item: any) {
    const newItem = {
      id: item.id,
      label: item.name,
      acronym: item.acronym,
      startDate: item.startDate,
      disappearanceDate: item.disappearanceDate,
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



    this.simpleTabsRef.getAllItems(this.params).subscribe(
      (result: any) => {
        this.items = result.results.map((item: any) => {
          return this.convertItem(item);
        });
        console.log(result);
        this.totalFiltred = result.filteredQuantity;
        this.total = result.totalQuantity;
        this.start = (this.page - 1) * this.limit + 1;
        this.end = (this.page - 1) * this.limit + this.items.length;
        this.loading = false;
      },
      (error: any) => {
        this.addSingle('error', '', error.error.message);
      }
    );
  }

  deleteItemss(item: any) {
    console.log(item)
    this.btnLoading = '';
    this.simpleTabsRef.deleteItem(item).subscribe(
      (result: any) => {
        this.close();
        this.addSingle('success', 'Suppression', 'Ministère ' + item.label + ' supprimée avec succés');
        this.getAllItems();
        this.deleteItems = false;
      },
      (error: any) => {
        this.close();
        if (error.error.code === 400) {
          this.addSingle('error', 'Suppression', 'Ministère ' + item.label + ' admet une relation');
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
        this.addSingle('success', 'Ajout', 'Ministère ' + item.name + ' ajoutée avec succés');
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
        this.addSingle('success', 'Modification', 'Ministère ' + item.name + ' modifiée avec succés');
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
    console.log('filter', e);
    this.page = 1;
    this.dataTableComponent.currentPage = 1;
    // this.filter = e.label;
    // this.filter

    Object.keys(e).map((key, index) =>{
      if(e[key]) {
        let newKey=key+'[contains]'
        if(key.includes('Date')){
           newKey = key+'[eq]';
        }
        const addfilter= {[newKey]: e[key]}
        this.params = {
          ...this.params, ...addfilter
        }
      }
    });
    console.log(this.params);
    this.getAllItems();
  }

  getKeyByValue(object: any, value: any) {
    return Object.keys(object).find((key) => object[key] === value);
  }

  sortEvent(e: any) {
    console.log(e)
    this.sortBy = this.getKeyByValue(this.fieldNames, e.field);
    if (e.order === 1) {
      this.sort = 'asc';
    } else {
      this.sort = 'desc';
    }
    this.params={
      ... this.params,
      sort: this.sort,
      sort_by: this.sortBy
    }
    this.getAllItems();
    console.log(this.params)
  }

  search(input: string) {
    this.page = 1;
    if (input) {
      this.filter = input;
      this.getAllItems();
      return;
    }
    this.filter = '';
    this.getAllItems();
  }
}
