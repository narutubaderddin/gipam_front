import { Component, OnInit, Output, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { CustomHeaderRendererComponent } from '@shared/components/datatables/custom-header-renderer/custom-header-renderer.component';
import { OPERATORS, TYPES } from '@shared/services/column-filter.service';
import { ColumnApi, GridApi, GridOptions, ICellEditorParams } from 'ag-grid-community';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { DenominationsActionsRendererComponent } from '@shared/components/datatables/denominations-actions-renderer/denominations-actions-renderer.component';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { DenominationsService } from '@shared/services/denominations.service';
import { FieldsService } from '@shared/services/fields.service';
import { MessageService } from 'primeng/api';
import { SimpleTabsRefService } from '@shared/services/simple-tabs-ref.service';
import { NgDataTableComponent } from '@shared/components/ng-dataTables/ng-data-table/ng-data-table.component';
import { DatePipe } from '@angular/common';

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
  dropdownSettings: IDropdownSettings;
  disappearanceDate: string;
  active = true;
  dropdownList: any;
  itemLabel: any;

  filter: any;
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
  items: any[] = [];
  today: string;

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
      header: 'Domaine',
      field: 'field',
      type: 'key-array',
      key_data: ['field', 'label'],
    },
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
    private fieldsService: FieldsService,
    public fb: FormBuilder,
    config: NgbModalConfig,
    private messageService: MessageService
  ) {
    config.backdrop = 'static';
    config.keyboard = false;
  }

  ngOnInit(): void {
    this.simpleTabsRef.tabRef = 'denominations';
    this.getAllItems();
    this.initForm();
  }

  initForm() {
    this.tabForm = this.fb.group({
      label: [this.selectedItem ? this.selectedItem.label : '', [Validators.required]],
      active: [true],
      field: [this.selectedRelatedEntity ? this.selectedRelatedEntity : { label: '' }, [Validators.required]],
    });
  }

  resetFilter() {}

  openModal(item: any) {
    this.btnLoading = null;
    if (this.editItem || this.editVisibility) {
      this.itemToEdit = item;
      this.itemLabel = item.name;
      console.log('selectedRelatedEntity', this.selectedRelatedEntity);
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
    console.log(this.selectedRelatedEntity);
  }
  onSelectAll(items: any) {}

  getRelatedEntity(): any {
    const previousUrl = this.simpleTabsRef.tabRef;
    this.simpleTabsRef.tabRef = 'fields';

    this.simpleTabsRef.getAllItems({}).subscribe((result: any) => {
      this.relatedEntities = result.results;
      console.log('relatedEntities', this.relatedEntities);
    });
    this.simpleTabsRef.tabRef = previousUrl;
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

    // this.myModal.close('Close click');
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
    this.editVisibility = true;

    data.active = !data.active;

    this.simpleTabsRef.editItem({ label: data.label, active: data.active }, data.id).subscribe(
      (result) => {
        if (data.active) {
          this.addSingle('success', 'Activation', 'Dénomination ' + data.label + ' activée avec succés');
        } else {
          this.addSingle('success', 'Activation', 'Dénomination ' + data.label + ' désactivée avec succés');
        }
        this.getAllItems();
      },

      (error) => {
        this.addSingle('error', 'Modification', error.error.message);
      }
    );
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
    console.log('http params', params);
    this.simpleTabsRef.getAllItems(params).subscribe(
      (result: any) => {
        this.items = result.results;
        console.log(this.items);
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
        this.addSingle('success', 'Suppression', 'Dénomination ' + item.label + ' supprimée avec succés');
        this.getAllItems();
        this.deleteItems = false;
      },
      (error: any) => {
        this.close();
        if (error.error.code === 400) {
          this.addSingle('error', 'Suppression', 'Dénomination ' + item.label + ' admet une relation');
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
        this.addSingle('success', 'Ajout', 'Dénomination ' + item.label + ' ajoutée avec succés');
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
        this.addSingle('success', 'Modification', 'Dénomination ' + item.label + ' modifiée avec succés');
        this.getAllItems();
        this.editItem = false;
        this.editVisibility = false;
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
