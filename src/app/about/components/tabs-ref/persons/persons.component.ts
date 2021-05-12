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
import { datePickerDateFormat, dateTimeFormat } from '@shared/utils/helpers';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-persons',
  templateUrl: './persons.component.html',
  styleUrls: ['./persons.component.scss'],
  providers: [DatePipe],
})
export class PersonsComponent implements OnInit {
  @ViewChild('content') modalRef: TemplateRef<any>;
  @ViewChild(NgDataTableComponent, { static: false }) dataTableComponent: NgDataTableComponent;

  loading = true;
  btnLoading: any = null;
  myModal: any;
  selectedItem: any;

  selectedAuthor: any;

  itemToEdit: any;
  itemToDelete: string;
  tabForm: FormGroup;
  editItem = false;
  addItem = false;
  deleteItems = false;
  editVisibility = false;

  active = true;
  itemLabel: any;

  filter = '';
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
  authors: any[] = [];
  activeAuthors: any[] = [];

  relatedAuthorsColumn = {
    header: 'Auteur',
    field: 'author',
    type: 'key-array',
    key_data: ['author', 'label'],
    filter: true,
    filterType: 'multiselect',
    placeholder: 'Auteur',
    selectData: this.authors,
  };

  columns = [
    {
      header: 'Prénom',
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
      header: 'Téléphone',
      field: 'phone',
      type: 'key',
      filter: true,
      filterType: 'text',
      sortable: true,
    },
    {
      header: 'Courriel',
      field: 'email',
      type: 'key',
      filter: true,
      filterType: 'text',
      sortable: true,
    },
    {
      header: 'Site Web',
      field: 'website',
      type: 'key',
      filter: true,
      filterType: 'text',
      sortable: true,
    },
    {
      header: 'Commentaire',
      field: 'comment',
      type: 'key',
      filter: true,
      filterType: 'text',
      sortable: true,
    },
    this.relatedAuthorsColumn,
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
    private messageService: MessageService
  ) {
    config.backdrop = 'static';
    config.keyboard = false;
  }

  ngOnInit(): void {
    this.simpleTabsRef.tabRef = 'persons';
    this.initFilterData();
    this.getAllItems();
    this.initForm();
  }

  initForm() {
    this.tabForm = this.fb.group({
      firstName: [this.selectedItem ? this.selectedItem.firstName : '', [Validators.required]],
      lastName: [this.selectedItem ? this.selectedItem.lastName : '', [Validators.required]],
      email: [this.selectedItem ? this.selectedItem.email : '', [Validators.required, Validators.email]],
      phone: [
        this.selectedItem ? this.selectedItem.phone : '',
        [Validators.pattern('^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\\s\\.0-9]*$')],
      ],
      website: [
        this.selectedItem ? this.selectedItem.website : '',
        [Validators.pattern('^(http\\:\\/\\/|https\\:\\/\\/)?([a-z0-9][a-z0-9\\-]*\\.)+[a-z0-9][a-z0-9\\-]*$')],
      ],
      comment: [this.selectedItem ? this.selectedItem.comment : '', []],
      author: [this.selectedAuthor ? this.selectedAuthor.label : { fullName: '' }, []],
      active: [this.selectedItem ? this.selectedItem?.active : true],
    });
  }

  initFilterData() {
    const data = {
      page: 1,
    };
    forkJoin([this.simpleTabsRef.getAllItems(data, 'authors')]).subscribe(
      ([relatedAuthorsResults]) => {
        this.authors = this.simpleTabsRef.getTabRefFilterData(relatedAuthorsResults.results);
        this.activeAuthors = relatedAuthorsResults.results.filter((value: any) => value.active === true);
        this.relatedAuthorsColumn.selectData = this.authors;
      },
      (error: any) => {
        this.addSingle('error', 'Erreur Technique', ' Message: ' + error.error.message);
      }
    );
  }

  openModal(item: any) {
    this.btnLoading = null;

    if (this.editItem) {
      this.itemToEdit = item;
      this.itemLabel = item.firstName + ' ' + item.lastName;
      this.selectedAuthor = item.author;
    }
    this.selectedItem = item;
    console.log('item', item);
    this.initForm();
    this.myModal = this.modalService.open(this.modalRef, { centered: true });
  }

  submit() {
    this.btnLoading = null;

    const item = {
      firstName: this.tabForm.value.firstName,
      lastName: this.tabForm.value.lastName,
      phone: this.tabForm.value.phone,
      email: this.tabForm.value.email,
      website: this.tabForm.value.website,
      author: this.tabForm.value.author.id,
      comment: this.tabForm.value.comment,
      active: this.tabForm.value.active,
    };
    if (this.addItem) {
      this.addItems(item);
    }
    if (this.editItem || this.editVisibility) {
      this.editField(item, this.itemToEdit.id);
    }
    this.selectedAuthor = null;
  }

  close() {
    this.editItem = false;
    this.addItem = false;
    this.deleteItems = false;
    this.editVisibility = false;
    this.myModal.dismiss('Cross click');
    this.selectedAuthor = null;
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
        this.visibleItem(e.item);
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

  deleteItemss(item: any) {
    this.btnLoading = '';
    this.simpleTabsRef.deleteItem(item).subscribe(
      (result: any) => {
        this.close();
        this.addSingle(
          'success',
          'Suppression',
          'Personne ' + item.firstName + ' ' + item.lastName + ' supprimée avec succés'
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
            'Personne ' + item.firstName + ' ' + item.lastName + ' admet une relation'
          );
        } else {
          this.addSingle('error', 'Suppression', error.error.message);
        }
      }
    );
  }

  visibleItem(data: any) {
    data.active = !data.active;
    this.loading = true;
    this.simpleTabsRef.editItem({ active: data.active }, data.id).subscribe(
      (result) => {
        if (data.active) {
          this.addSingle(
            'success',
            'Activation',
            'Personne ' + data.firstName + ' ' + data.lastName + ' activée avec succés'
          );
        } else {
          this.addSingle(
            'success',
            'Activation',
            'Personne ' + data.firstName + ' ' + data.lastName + ' désactivée avec succés'
          );
        }
        this.getAllItems();
      },
      (error) => {
        this.addSingle('error', 'Modification', error.error.message);
        this.loading = false;
      }
    );
  }

  addItems(item: any) {
    this.btnLoading = '';

    this.simpleTabsRef.addItem(item).subscribe(
      (result: any) => {
        this.close();
        this.addSingle('success', 'Ajout', 'Personne ' + item.firstName + ' ' + item.lastName + ' ajoutée avec succés');
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
          'Personne ' + item.firstName + ' ' + item.lastName + ' modifiée avec succés'
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
