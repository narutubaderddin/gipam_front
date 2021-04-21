import { Component, EventEmitter, OnInit, TemplateRef, ViewChild } from '@angular/core';
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

  myModal: any;
  selectedDomain: string;
  domainToDelete: string;
  domainToEdit: any;
  DomainForm: FormGroup;
  editDomain = false;
  addDomain = false;
  deleteDomain = false;
  active = true;
  errors: any = [];
  success: any = [];
  domains: any;
  columnDropped = new EventEmitter();
  columnDroppedSubscription: Subscription;
  currentColumnStates: any;
  currentFilters: ColumnFilterModel[] = [];
  currentOrderedFields: { column: string; direction: string }[] = [];

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

  gridApi: GridApi;
  gridColumnApi: ColumnApi;
  gridReady = false;
  rowCount: any = 5;
  filter = false;

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

  // onRowCountChange(event: Event) {
  //   // @ts-ignore
  //   this.rowCount = event.target.value;
  //   this.gridApi.paginationSetPageSize(Number(this.rowCount));
  // }

  resetFilter() {}

  openModal(domain: any) {
    if (domain) {
      this.editDomain = true;
      this.domainToEdit = domain;
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
    this.errors = [];
    this.success = [];
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
    // this.editField(
    //   {
    //     label: data.label,
    //     active: data.active,
    //   },
    //   data.id
    // );
  }
  deleteItem(data: any) {
    this.deleteDomain = true;
    this.domainToDelete = data;
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
    this.feildsService.getAllFields().subscribe(
      (feilds) => {
        this.domains = feilds;
        this.domains = this.domains.results;
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
        this.addSingle('success', 'Suppression', 'Domaine supprimé avec succés');
        this.getAllFeilds();
      },
      (error) => {
        this.close();
        if (error.error.code === 400) {
          this.addSingle('error', 'Suppression', 'Domaine admet une relation');
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
        this.addSingle('success', 'Ajout', 'Domaine ajoutée avec succés');
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
        this.addSingle('success', 'Modification', 'Dénomination modifié avec succés');
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
}
