import { Component, OnInit, Output, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { FieldsService } from '@shared/services/fields.service';
import { MessageService } from 'primeng/api';
import { DenominationsService } from '@shared/services/denominations.service';
import { SimpleTabsRefService } from '@shared/services/simple-tabs-ref.service';

@Component({
  selector: 'app-material-technique',
  templateUrl: './material-technique.component.html',
  styleUrls: ['./material-technique.component.scss'],
})
export class MaterialTechniqueComponent implements OnInit {
  @ViewChild('content') modalRef: TemplateRef<any>;

  myModal: any;
  selectedItem: string;

  itemToEdit: any;
  itemToDelete: string;
  tabForm: FormGroup;
  editItem = false;
  addItem = false;
  deleteItems = false;
  dropdownSettings: IDropdownSettings;

  denominations: any;
  selectedDenominations: any = [];
  active = true;
  dropdownList: any;
  itemLabel: any;
  selectedDomain: any;
  filter: any;
  sort: string = 'asc';
  totalFiltred: any;
  total: any;
  limit = '5';
  page = '1';

  items: any;

  columns = [
    {
      header: 'Libellé',
      field: 'label',
      type: 'key',
      filter: true,
      filterType: 'text',
      sortable: true,
      width: '300px',
    },
    {
      header: 'Dénomination',
      field: 'denominations',
      type: 'key-multiple-data',
      key_multiple_data: ['denominations', 'label'],
      filter: true,
      filterType: 'text',
      sortable: true,
      scrollable: true,
    },
    {
      header: 'Type',
      field: 'type',
      type: 'key',
      filter: true,
      filterType: 'text',
      sortable: true,
      width: '300px',
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

  rowCount: any = 5;

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
    this.simpleTabsRef.tabRef = 'materialTechniques';
    this.getAllitems();
    // this.getAllFields();
    this.getAllDenominations();
    this.initForm();
    this.dropdownSettings = {
      singleSelection: false,
      selectAllText: 'Sélectionner tout',
      idField: 'id',
      textField: 'label',
      itemsShowLimit: 1,
      allowSearchFilter: true,
    };
  }
  initForm() {
    this.tabForm = this.fb.group({
      material: [this.selectedItem, [Validators.required]],
      type: [''],
      denomination: ['', [Validators.required]],
      active: [true],
    });
  }

  resetFilter() {}

  openModal(item: any) {
    if (item) {
      this.editItem = true;
      this.itemToEdit = item;
      this.itemLabel = item.label;
    } else {
      this.addItem = true;
    }

    this.selectedItem = item.label;

    this.initForm();
    this.myModal = this.modalService.open(this.modalRef, { centered: true });
  }
  submit() {
    console.log(this.tabForm.value.denomination, this.tabForm.value.field);
    const item = {
      label: this.tabForm.value.material,
      type: this.tabForm.value.type,
      denominations: this.selectedDenominations,
      active: this.tabForm.value.active,
    };
    if (this.addItem) {
      this.addItems(item);
    }
    if (this.editItem) {
      // const item2 = {
      //   label: this.tabForm.value.material,
      //   type:'',
      //   denominations:[this.tabForm.value.denomination[0].id],
      //   active: this.tabForm.value.active,
      // };
      this.editItems(item, this.itemToEdit.id);
    }
  }
  close() {
    this.editItem = false;
    this.addItem = false;
    this.deleteItems = false;

    this.myModal.dismiss('Cross click');
  }
  deleteItem(data: any) {
    this.deleteItems = true;
    this.itemToDelete = data;
    this.itemLabel = data.label;
    this.myModal = this.modalService.open(this.modalRef, { centered: true });
  }

  actionMethod(e: any) {
    console.log(e);
    switch (e.method) {
      case 'delete':
        this.deleteItem(e.item);
        break;
      case 'edit':
        this.openModal(e.item);
        break;
      case 'visibility':
        this.visibleItem(e.item);
        break;
      default:
        this.close();
    }
  }

  getAllitems() {
    this.simpleTabsRef.tabRef = 'materialTechniques';
    this.simpleTabsRef
      .getAllItems({ limit: this.limit, page: this.page, 'label[contains]': this.filter, sort: this.sort })
      .subscribe(
        (result: any) => {
          this.items = result;
          this.totalFiltred = this.items.filteredQuantity;
          this.total = this.items.totalQuantity;
          this.items = this.items.results;
          // console.log('result', this.items);
        },
        (error: any) => {
          this.addSingle('error', '', error.error.message);
        }
      );
  }
  deleteItemss(item: any) {
    this.simpleTabsRef.tabRef = 'materialTechniques';
    this.simpleTabsRef.deleteItem(item).subscribe(
      (result: any) => {
        this.close();
        this.addSingle('success', 'Suppression', 'Matière/technique ' + item.label + ' supprimée avec succés');
        this.getAllitems();
      },
      (error: any) => {
        this.close();
        if (error.error.code === 400) {
          this.addSingle('error', 'Suppression', 'Matière/technique ' + item.label + ' admet une relation');
        } else {
          this.addSingle('error', 'Suppression', error.error.message);
        }
      }
    );
  }
  addItems(item: any) {
    console.log(item);
    this.simpleTabsRef.tabRef = 'materialTechniques';
    this.simpleTabsRef.addItem(item).subscribe(
      (result: any) => {
        this.close();
        this.addSingle('success', 'Ajout', 'Matière/technique ' + item.label + ' ajoutée avec succés');
        this.getAllitems();
      },
      (error) => {
        this.addSingle('error', 'Ajout', error.error.message);
      }
    );
  }
  visibleItem(data: any) {
    data.active = !data.active;
    this.simpleTabsRef.tabRef = 'materialTechniques';
    this.simpleTabsRef.editItem({ label: data.label, active: data.active }, data.id).subscribe(
      (result) => {
        if (data.active) {
          this.addSingle('success', 'Activation', 'Matière/technique ' + data.label + ' activée avec succés');
        } else {
          this.addSingle('success', 'Activation', 'Matière/technique ' + data.label + ' désactivée avec succés');
        }
        this.getAllitems();
      },

      (error) => {
        this.addSingle('error', 'Modification', error.error.message);
      }
    );
  }
  editItems(item: any, id: number) {
    console.log(item);
    this.simpleTabsRef.tabRef = 'materialTechniques';
    this.simpleTabsRef.editItem(item, id).subscribe(
      (result) => {
        console.log(result);
        this.close();
        this.addSingle('success', 'Modification', 'Matière/technique ' + item.label + ' modifiée avec succés');
        this.getAllitems();
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
    if (e.page < this.total / parseInt(this.limit, 0)) {
      this.page = e.page + 1;
    } else {
      this.page = (this.total / parseInt(this.limit, 0)).toString();
    }
    this.limit = Math.min(e.rows, this.totalFiltred).toString();
    // this.limit = Math.min(e.rows, this.totalFiltred - e.page * e.rows).toString();

    this.getAllitems();
  }
  filters(e: any) {
    console.log(e);
    this.filter = e.label;
    this.getAllitems();
  }
  sortEvent(e: any) {
    console.log(e);
    if (e) {
      this.sort = 'asc';
      this.getAllitems();
    } else {
      this.sort = 'desc';
      this.getAllitems();
    }
  }
  // getAllFields() {
  //   this.simpleTabsRef.tabRef='fields';
  //   this.simpleTabsRef.getAllItems({}).subscribe(
  //     (fields) => {
  //       this.domains = fields;
  //       this.domains = this.domains.results;
  //     },
  //     (error) => {
  //       // this.errors.push(error.error.message);
  //       console.log(error.error.message);
  //     }
  //   );
  // }
  // onDomainSelect(item: any) {
  //   console.log(item);
  //   this.selectedDomain = item;
  // }
  getAllDenominations() {
    this.simpleTabsRef.tabRef = 'denominations';
    this.simpleTabsRef.getAllItems({}).subscribe(
      (result) => {
        this.denominations = result;
        this.denominations = this.denominations.results;
      },
      (error) => {
        console.log(error.error.message);
      }
    );
  }
  onDenominationSelect(item: any) {
    console.log(item);
    this.selectedDenominations.push(item.id);
    console.log(this.selectedDenominations);
    // this.selectedDomain = item;
  }
}
