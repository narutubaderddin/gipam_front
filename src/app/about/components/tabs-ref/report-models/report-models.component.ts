import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { NgDataTableComponent } from '@shared/components/ng-dataTables/ng-data-table/ng-data-table.component';
import { FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { SimpleTabsRefService } from '@shared/services/simple-tabs-ref.service';
import { FieldsService } from '@shared/services/fields.service';
import { MessageService } from 'primeng/api';
import { DatePipe } from '@angular/common';
import { forkJoin } from 'rxjs';
import { getMultiSelectIds } from '@shared/utils/helpers';

@Component({
  selector: 'app-report-models',
  templateUrl: './report-models.component.html',
  styleUrls: ['./report-models.component.scss'],
  providers: [DatePipe],
})
export class ReportModelsComponent implements OnInit {
  @ViewChild('content') modalRef: TemplateRef<any>;
  @ViewChild(NgDataTableComponent, { static: false }) dataTableComponent: NgDataTableComponent;

  loading = true;
  btnLoading: any = null;
  myModal: any;
  selectedItem: any;

  selectedFields: any[] = [];

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
  fields: any[] = [];
  activeFields: any[] = [];

  relatedFields = {
    header: 'Domaines',
    field: 'fields',
    type: 'key-multiple-data',
    key_multiple_data: ['fields', 'label'],
  };

  columns = [
    {
      header: 'Nom',
      field: 'name',
      type: 'key',
      filter: true,
      filterType: 'text',
      sortable: true,
    },
    this.relatedFields,
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
    this.simpleTabsRef.tabRef = 'reportModels';
    this.getAllItems();
    this.initForm();
  }

  initForm() {
    this.tabForm = this.fb.group({
      name: [this.selectedItem ? this.selectedItem.name : '', [Validators.required]],
      fields: [this.selectedFields, [Validators.required]],
      active: [this.selectedItem ? this.selectedItem?.active : true],
    });
  }

  getActiveRelatedEntities() {
    const data = {
      page: 1,
      serializer_group: JSON.stringify(['short']),
      'active[eq]': 1,
    };
    this.simpleTabsRef.getAllItems(data, 'fields').subscribe(
      (result) => {
        this.activeFields = result.results;
        this.addNotActiveEntities();
      },
      (error: any) => {
        this.addSingle('error', 'Erreur Technique', ' Message: ' + error.error.message);
      }
    );
  }

  addNotActiveEntities() {
    if (this.selectedFields) {
      this.selectedFields.forEach((item: any) => {
        if (!this.activeFields.some((activeItem) => activeItem.id === item.id)) {
          this.activeFields.push(item);
        }
      });
    }
  }

  openModal(item: any) {
    this.btnLoading = null;

    if (this.editItem) {
      this.itemToEdit = item;
      this.itemLabel = item.name;
      this.selectedFields = item.fields;
    }
    this.selectedItem = item;
    this.getActiveRelatedEntities();
    this.initForm();
    this.myModal = this.modalService.open(this.modalRef, { centered: true });
  }

  submit() {
    this.btnLoading = null;

    const item = {
      name: this.tabForm.value.name,
      fields: getMultiSelectIds(this.tabForm.value.fields),
      active: this.tabForm.value.active,
    };
    if (this.addItem) {
      this.addItems(item);
    }
    if (this.editItem || this.editVisibility) {
      this.editField(item, this.itemToEdit.id);
    }
    this.selectedFields = null;
  }

  close() {
    this.editItem = false;
    this.addItem = false;
    this.deleteItems = false;
    this.editVisibility = false;
    this.myModal.dismiss('Cross click');
    this.selectedFields = null;
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
    this.itemLabel = data.name;
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
        this.addSingle('error', 'Erreur Technique', error.error.message);
      }
    );
  }

  deleteItemss(item: any) {
    this.btnLoading = '';
    this.simpleTabsRef.deleteItem(item).subscribe(
      (result: any) => {
        this.close();
        this.addSingle('success', 'Suppression', 'Personne ' + item.name + ' supprimée avec succés');
        this.getAllItems();
        this.deleteItems = false;
      },
      (error: any) => {
        this.close();
        if (error.error.code === 400) {
          this.addSingle('error', 'Suppression', 'Personne ' + item.name + ' admet une relation');
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
          this.addSingle('success', 'Activation', 'Personne ' + data.name + ' activée avec succés');
        } else {
          this.addSingle('success', 'Activation', 'Personne ' + data.name + ' désactivée avec succés');
        }
        this.getAllItems();
      },
      (error) => {
        if (error.error.code === 400) {
          this.addSingle('error', 'Modification', error.error.message);
        }
        this.loading = false;
      }
    );
  }

  addItems(item: any) {
    this.btnLoading = '';

    this.simpleTabsRef.addItem(item).subscribe(
      (result: any) => {
        this.close();
        this.addSingle('success', 'Ajout', 'Personne ' + item.name + ' ajoutée avec succés');
        this.getAllItems();
        this.addItem = false;
      },
      (error) => {
        if (error.error.code === 400) {
          this.addSingle('error', 'Ajout', error.error.message);
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
        this.addSingle('success', 'Modification', 'Personne ' + item.name + ' modifiée avec succés');
        this.getAllItems();
        this.editItem = false;
      },
      (error) => {
        if (error.error.code === 400) {
          this.addSingle('error', 'Modification', error.error.message);
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
