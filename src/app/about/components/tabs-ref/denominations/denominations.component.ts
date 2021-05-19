import { Component, OnInit, Output, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { FieldsService } from '@shared/services/fields.service';
import { MessageService } from 'primeng/api';
import { SimpleTabsRefService } from '@shared/services/simple-tabs-ref.service';
import { NgDataTableComponent } from '@shared/components/ng-dataTables/ng-data-table/ng-data-table.component';
import { tabRefFormBackendErrorMessage } from '@shared/utils/helpers';

@Component({
  selector: 'app-denominations',
  templateUrl: './denominations.component.html',
  styleUrls: ['./denominations.component.scss'],
})
export class DenominationsComponent implements OnInit {
  @ViewChild('content') modalRef: TemplateRef<any>;
  @ViewChild(NgDataTableComponent, { static: false }) dataTableComponent: NgDataTableComponent;

  loading = true;
  btnLoading: any = null;
  myModal: any;
  selectedItem: {
    label: '';
    active: true;
    field: {
      id: number;
      name: '';
    };
  };
  relatedEntities: any[] = [];
  selectedRelatedEntity: any;
  itemToEdit: any;
  itemToDelete: string;
  tabForm: FormGroup;
  editItem = false;
  addItem = false;
  deleteItems = false;
  editVisibility = false;
  disappearanceDate: string;
  active = true;
  itemLabel: any;

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
  fields: any[] = [];

  fieldColumn = {
    header: 'Domaine',
    field: 'field',
    type: 'key-array',
    key_data: ['field', 'label'],
    filter: true,
    filterType: 'multiselect',
    placeholder: 'Domaine',
    selectData: this.fields,
    sortable: true,
  };

  columns = [
    {
      header: 'Libellé',
      field: 'label',
      type: 'key',
      filter: true,
      filterType: 'text',
      sortable: true,
    },
    this.fieldColumn,
    {
      header: 'Actions',
      field: 'action',
      type: 'app-actions-cell',
      sortable: false,
      filter: false,
      width: '300px',
    },
  ];

  constructor(
    private router: Router,
    private modalService: NgbModal,
    private activatedRoute: ActivatedRoute,
    private simpleTabsRef: SimpleTabsRefService,
    public fb: FormBuilder,
    config: NgbModalConfig,
    private messageService: MessageService
  ) {
    config.backdrop = 'static';
    config.keyboard = false;
  }

  ngOnInit(): void {
    this.simpleTabsRef.tabRef = 'denominations';
    this.initFilterData();
    this.getAllItems();
    this.initForm();
  }

  initFilterData() {
    const params = {
      page: 1,
      serializer_group: JSON.stringify(['short']),
    };
    this.simpleTabsRef.getAllItems(params, 'fields').subscribe((result: any) => {
      this.fields = this.simpleTabsRef.getTabRefFilterData(result.results);
      this.fieldColumn.selectData = this.fields;
    });
  }

  initForm() {
    this.tabForm = this.fb.group({
      label: [this.selectedItem ? this.selectedItem.label : '', [Validators.required]],
      active: [this.selectedItem ? this.selectedItem.active : true],
      field: [this.selectedRelatedEntity ? this.selectedRelatedEntity : { label: '' }, [Validators.required]],
    });
  }

  openModal(item: any) {
    this.btnLoading = null;
    if (this.editItem || this.editVisibility) {
      this.itemToEdit = item;
      this.itemLabel = item.name;

      this.selectedRelatedEntity = item.field
        ? {
            label: item.field.label,
            id: item.field.id,
          }
        : {};
    }
    if (this.editItem || this.addItem) {
      this.getRelatedEntity();
    }
    this.selectedItem = item;
    this.initForm();
    this.myModal = this.modalService.open(this.modalRef, { centered: true });
  }

  onFieldSelect(item: any) {
    this.selectedRelatedEntity = item;
  }

  getRelatedEntity(): any {
    this.simpleTabsRef.getAllItems({ 'active[eq]': 1 }, 'fields').subscribe((result: any) => {
      this.relatedEntities = result.results;
    });
  }

  submit() {
    this.btnLoading = null;
    const item = {
      label: this.tabForm.value.label,
      active: this.tabForm.value.active,
      field: this.tabForm.value.field.id,
    };
    if (this.addItem) {
      this.addItems(item);
    }
    if (this.editItem || this.editVisibility) {
      this.editField(item, this.itemToEdit.id);
    }
  }

  close() {
    this.selectedItem = null;
    this.selectedRelatedEntity = [];
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
    this.selectedRelatedEntity = [];
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

  changeVisibilityAction(data: any) {
    this.loading = true;
    this.editVisibility = true;

    data.active = !data.active;

    this.simpleTabsRef.editItem({ active: data.active }, data.id).subscribe(
      (result) => {
        if (data.active) {
          this.addSingle('success', 'Activation', 'Dénomination "' + data.label + '" activée avec succés');
        } else {
          this.addSingle('success', 'Activation', 'Dénomination "' + data.label + '" désactivée avec succés');
        }
        this.getAllItems();
      },
      (error) => {
        this.addSingle('error', 'Modification', error.error.message);
        this.loading = false;
      }
    );
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
        this.addSingle('success', 'Suppression', 'Dénomination "' + item.label + '" supprimée avec succés');
        this.getAllItems();
        this.deleteItems = false;
      },
      (error: any) => {
        this.close();
        if (error.error.code === 400) {
          this.addSingle('error', 'Suppression', 'Dénomination "' + item.label + '" admet une relation');
        }
      }
    );
  }

  addItems(item: any) {
    this.btnLoading = '';
    this.simpleTabsRef.addItem(item).subscribe(
      (result: any) => {
        this.close();
        this.addSingle('success', 'Ajout', 'Dénomination "' + item.label + '" ajoutée avec succés');
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
        this.addSingle('success', 'Modification', 'Dénomination "' + item.label + '" modifiée avec succés');
        this.getAllItems();
        this.editItem = false;
        this.editVisibility = false;
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
