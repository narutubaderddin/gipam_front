import { Component, EventEmitter, Input, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { CustomHeaderRendererComponent } from '@shared/components/datatables/custom-header-renderer/custom-header-renderer.component';
import { DomainsActionsRendererComponent } from '@shared/components/datatables/domains-actions-renderer/domains-actions-renderer.component';
import { ColumnApi, GridApi, GridOptions, ICellEditorParams } from 'ag-grid-community';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { ColumnFilterModel } from '@shared/models/column-filter-model';
import { FieldsService } from '@shared/services/fields.service';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-domains',
  templateUrl: './domains.component.html',
  styleUrls: ['./domains.component.scss'],
})
export class DomainsComponent implements OnInit {
  @ViewChild('content')
  modalRef: TemplateRef<any>;
  // @Input() pageChanged;
  myModal: any;
  selectedDomain: string;
  domainToDelete: string;
  domainToEdit: any;
  DomainForm: FormGroup;
  editDomain = false;
  addDomain = false;
  deleteDomain = false;
  active = true;

  domains: any;
  columnDropped = new EventEmitter();
  columnDroppedSubscription: Subscription;
  currentColumnStates: any;
  currentFilters: ColumnFilterModel[] = [];
  currentOrderedFields: { column: string; direction: string }[] = [];
  itemLabel: any;
  filter: any;
  sort: string = 'asc';
  totalFiltred: any;
  total: any;
  limit = '5';
  page = '1';

  frameworkComponents = {
    customHeader: CustomHeaderRendererComponent,
    gridActionRenderer: DomainsActionsRendererComponent,
  };

  columns: any[] = [
    {
      header: 'Libellé',
      field: 'label',
      type: 'key',
      filter: true,
      filterType: 'text',
      sortable: true,
    },

    {
      header: 'Actions',
      type: 'app-actions-cell',
      sortable: false,
      filter: false,
      width: '300px',
    },
  ];

  rowCount: any = 5;
  // filter = false;

  constructor(
    private router: Router,
    private modalService: NgbModal,
    private activatedRoute: ActivatedRoute,
    private messageService: MessageService,
    private feildsService: FieldsService,
    public fb: FormBuilder,
    config: NgbModalConfig
  ) {
    config.backdrop = 'static';
    config.keyboard = false;
  }

  initForm() {
    this.DomainForm = this.fb.group({
      label: [this.selectedDomain, [Validators.required]],
      active: [true],
    });
  }

  ngOnInit(): void {
    this.getAllFeilds();
    this.initForm();

    this.filter =
      this.activatedRoute.snapshot.queryParams.filter && this.activatedRoute.snapshot.queryParams.filter.length > 0;
  }

  resetFilter() {}

  openModal(domain: any) {
    if (domain) {
      this.editDomain = true;
      this.domainToEdit = domain;
      this.itemLabel = domain.label;
    } else {
      this.addDomain = true;
    }

    this.selectedDomain = domain.label;
    this.initForm();
    this.myModal = this.modalService.open(this.modalRef, { centered: true });
  }
  submit() {
    if (this.addDomain) {
      this.addField(this.DomainForm.value);
    }
    if (this.editDomain) {
      const field = {
        // id: this.domainToEdit.id,
        label: this.DomainForm.value.label,
        active: this.domainToEdit.active,
      };
      this.editField(field, this.domainToEdit.id);
    }
  }
  close() {
    this.editDomain = false;
    this.addDomain = false;
    this.deleteDomain = false;

    this.myModal.close('Close click');
    this.myModal.dismiss('Cross click');
  }
  visibleDomain(data: any) {
    data.active = !data.active;
    this.feildsService.editField({ label: data.label, active: data.active }, data.id).subscribe(
      (result) => {
        if (data.active) {
          this.addSingle('success', 'Activation', 'Domaine activée avec succés');
        } else {
          this.addSingle('success', 'Activation', 'Domaine désactivée avec succés');
        }
        this.getAllFeilds();
      },
      (error) => {
        this.addSingle('error', 'Modification', error.error.message);
      }
    );
  }
  deleteItem(data: any) {
    this.deleteDomain = true;
    this.domainToDelete = data;
    this.itemLabel = data.label;
    this.myModal = this.modalService.open(this.modalRef, { centered: true });
  }

  actionMethod(e: any) {
    switch (e.method) {
      case 'delete':
        this.deleteItem(e.item);
        break;
      case 'edit':
        this.openModal(e.item);
        break;
      case 'visibility':
        this.visibleDomain(e.item);
        break;
      default:
        this.close();
    }
  }

  getAllFeilds() {
    this.feildsService
      .getAllFields({ limit: this.limit, page: this.page, 'label[contains]': this.filter, sort: this.sort })
      .subscribe(
        (fields) => {
          this.domains = fields;

          this.totalFiltred = this.domains.filteredQuantity;
          this.total = this.domains.totalQuantity;
          console.log();
        },
        (error) => {
          this.addSingle('error', '', error.error.message);
        }
      );
  }
  deleteField(field: any) {
    this.feildsService.deleteField(field).subscribe(
      (result) => {
        this.close();
        this.addSingle('success', 'Suppression', 'Domaine ' + field.label + ' supprimé avec succés');
        this.getAllFeilds();
      },
      (error) => {
        this.close();
        if (error.error.code === 400) {
          this.addSingle('error', 'Suppression', 'Domaine ' + field.label + ' admet une relation');
        } else {
          this.addSingle('error', 'Suppression', error.error.message);
        }
      }
    );
  }
  addField(field: any) {
    this.feildsService.addField(field).subscribe(
      (result) => {
        this.close();
        this.addSingle('success', 'Ajout', 'Domaine ' + field.label + ' ajoutée avec succés');
        this.getAllFeilds();
      },
      (error) => {
        this.addSingle('error', 'Ajout', error.error.message);
      }
    );
  }
  editField(field: any, id: number) {
    this.feildsService.editField(field, id).subscribe(
      (result) => {
        this.close();
        this.addSingle('success', 'Modification', 'Domaine ' + field.label + ' modifié avec succés');
        this.getAllFeilds();
      },
      (error) => {
        this.addSingle('error', 'Modification', error.error.message);
      }
    );
  }
  addSingle(type: string, sum: string, msg: string) {
    this.messageService.add({ severity: type, summary: sum, detail: msg });
  }
  pagination(e: any) {
    console.log(e);
    if (e.page < this.total / parseInt(this.limit, 0)) {
      this.page = e.page + 1;
    } else {
      // this.page = Math.max(e.page, 1).toString();
      this.page = (this.total / parseInt(this.limit, 0)).toString();
    }
    this.limit = e.rows;
    // this.limit = Math.min(e.rows, this.totalFiltred - e.page * e.rows).toString();
    // this.start = e.first + 1;
    this.getAllFeilds();
  }
  filters(e: any) {
    console.log(e);
    this.filter = e.label;
    this.getAllFeilds();
  }
  sortEvent(e: any) {
    console.log(e);
    if (e) {
      this.sort = 'asc';
      this.getAllFeilds();
    } else {
      this.sort = 'desc';
      this.getAllFeilds();
    }
  }
}
