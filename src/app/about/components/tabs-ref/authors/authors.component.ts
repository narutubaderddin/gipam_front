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
import { datePickerDateFormat, dateTimeFormat, getMultiSelectIds } from '@shared/utils/helpers';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-authors',
  templateUrl: './authors.component.html',
  styleUrls: ['./authors.component.scss'],
  providers: [DatePipe],
})
export class AuthorsComponent implements OnInit {
  @ViewChild('content') modalRef: TemplateRef<any>;
  @ViewChild(NgDataTableComponent, { static: false }) dataTableComponent: NgDataTableComponent;

  loading = true;
  btnLoading: any = null;
  myModal: any;
  selectedItem: any;

  selectedType: any;
  selectedPeople: any;

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
  types: any[] = [];
  activeTypes: any[] = [];
  people: any[] = [];
  activePeople: any[] = [];

  typesColumn = {
    header: 'Type',
    field: 'type',
    type: 'key-array',
    key_data: ['type', 'label'],
    filter: true,
    filterType: 'multiselect',
    placeholder: 'Type',
    selectData: this.types,
  };

  peopleColumn = {
    header: 'Ayant droit',
    field: 'people',
    type: 'key-multiple-data',
    key_multiple_data: ['people', 'label'],
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
    this.typesColumn,
    this.peopleColumn,
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
    this.simpleTabsRef.tabRef = 'authors';
    this.initFilterData();
    this.getAllItems();
    this.initForm();
  }

  initForm() {
    this.tabForm = this.fb.group({
      firstName: [this.selectedItem ? this.selectedItem.firstName : '', [Validators.required]],
      lastName: [this.selectedItem ? this.selectedItem.lastName : '', [Validators.required]],
      type: [this.selectedType ? this.selectedType : '', []],
      people: [this.selectedPeople ? this.selectedPeople : [], []],
      active: [this.selectedItem ? this.selectedItem?.active : true],
    });
  }

  initFilterData() {
    const data = {
      page: 1,
      serializer_group: JSON.stringify(['short']),
    };
    forkJoin([
      this.simpleTabsRef.getAllItems(data, 'authorTypes'),
      this.simpleTabsRef.getAllItems(data, 'persons'),
    ]).subscribe(
      ([typesResults, peopleResults]) => {
        this.types = this.simpleTabsRef.getTabRefFilterData(typesResults.results);
        this.people = this.simpleTabsRef.getTabRefFilterData(peopleResults.results);
        this.activeTypes = typesResults.results.filter((value: any) => value.active === true);
        this.typesColumn.selectData = this.types;
      },
      (error: any) => {
        this.addSingle('error', 'Erreur Technique', ' Message: ' + error.error.message);
      }
    );
  }

  getActiveRelatedEntities() {
    const data = {
      page: 1,
      serializer_group: JSON.stringify(['short']),
      'active[eq]': 1,
    };
    this.tabForm.get('people').disable();
    this.tabForm.get('type').disable();

    forkJoin([
      this.simpleTabsRef.getAllItems(data, 'authorTypes'),
      this.simpleTabsRef.getAllItems(data, 'persons'),
    ]).subscribe(
      ([typesResults, peopleResults]) => {
        this.activeTypes = typesResults.results;
        this.activePeople = peopleResults.results;
        this.tabForm.get('people').enable();
        this.tabForm.get('type').enable();
        this.addNotActiveEntities();
      },
      (error: any) => {
        this.addSingle('error', 'Erreur Technique', ' Message: ' + error.error.message);
      }
    );
  }

  addNotActiveEntities() {
    if (this.selectedPeople) {
      this.selectedPeople?.forEach((item: any) => {
        if (!this.activePeople.some((activeItem) => activeItem.id === item.id)) {
          this.activePeople.push(item);
        }
      });
    }
    if (this.selectedType) {
      if (!this.activeTypes.some((activeItem) => activeItem.id === this.selectedType?.id)) {
        this.activePeople.push(this.selectedType);
      }
    }
  }

  openModal(item: any) {
    console.log('item to edit', item);

    this.btnLoading = null;
    this.selectedItem = item;
    if (this.editItem) {
      this.itemToEdit = item;
      this.itemLabel = item.firstName + ' ' + item.lastName;
      this.selectedType = item.type;
      this.selectedPeople = item.people;
    }
    this.getActiveRelatedEntities();
    this.initForm();
    this.myModal = this.modalService.open(this.modalRef, { centered: true });
  }

  submit() {
    this.btnLoading = null;
    const item = {
      firstName: this.tabForm.value.firstName,
      lastName: this.tabForm.value.lastName,
      type: this.tabForm.value.type.id,
      people: getMultiSelectIds(this.tabForm.value.people),
      active: this.tabForm.value.active,
    };
    if (this.addItem) {
      this.addItems(item);
    }
    if (this.editItem || this.editVisibility) {
      this.editField(item, this.itemToEdit.id);
    }
    this.selectedType = null;
    this.selectedPeople = null;
  }

  close() {
    this.editItem = false;
    this.addItem = false;
    this.deleteItems = false;
    this.editVisibility = false;
    this.myModal.dismiss('Cross click');
    this.selectedType = null;
    this.selectedPeople = null;
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
        console.log('items', result.results);
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
          'Auteur ' + item.firstName + ' ' + item.lastName + ' supprimée avec succés'
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
            'Auteur ' + item.firstName + ' ' + item.lastName + ' admet une relation'
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
            'Auteur ' + data.firstName + ' ' + data.lastName + ' activée avec succés'
          );
        } else {
          this.addSingle(
            'success',
            'Activation',
            'Auteur ' + data.firstName + ' ' + data.lastName + ' désactivée avec succés'
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
        this.addSingle('success', 'Ajout', 'Auteur ' + item.firstName + ' ' + item.lastName + ' ajoutée avec succés');
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
          'Auteur ' + item.firstName + ' ' + item.lastName + ' modifiée avec succés'
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
