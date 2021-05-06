import { Component, OnInit, Output, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { FieldsService } from '@shared/services/fields.service';
import { MessageService } from 'primeng/api';
import { DenominationsService } from '@shared/services/denominations.service';
import { SimpleTabsRefService } from '@shared/services/simple-tabs-ref.service';
import { NgDataTableComponent } from '@shared/components/ng-dataTables/ng-data-table/ng-data-table.component';

@Component({
  selector: 'app-material-technique',
  templateUrl: './material-technique.component.html',
  styleUrls: ['./material-technique.component.scss'],
})
export class MaterialTechniqueComponent implements OnInit {
  @ViewChild('content') modalRef: TemplateRef<any>;
  @ViewChild(NgDataTableComponent, { static: false }) dataTableComponent: NgDataTableComponent;

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
  sortBy = 'label';
  totalFiltred: any;
  total: any;
  limit: any = '5';
  page: any = '1';
  start: any;
  end: any;

  loading = true;
  btnLoading: any = null;
  dataTableFilter: any = {};
  dataTableSort: any = {};
  dataTableSearchBar: any = {};
  items: any[] = [];

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
      header: 'Dénominations',
      field: 'denominations',
      type: 'key-multiple-data',
      key_multiple_data: ['denominations', 'label'],
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
  selectedDenomination:any[]=[];
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
    this.getAllItems();
    // this.getAllFields();
    this.getAllDenominations();
    this.initForm();
    this.selectedDenominations = [];
    this.dropdownSettings = {
      singleSelection: false,
      selectAllText: 'Sélectionner tout',
      unSelectAllText: 'Déselectionner tout',
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
    this.btnLoading = null;

    if (item) {
      this.editItem = true;
      this.itemToEdit = item;
      this.itemLabel = item.firstName+' '+item.lastName;
    } else {
      this.addItem = true;
    }
    if(item.denominations){
      item.denominations.map((el:any)=>{
        this.selectedDenomination.push({id:el.id, label:el.label})
        console.log(item.denominations)
      })
      console.log(item.denominations)
    }
    console.log(item.denominations,this.selectedDenomination)
    this.selectedItem = item.label;

    this.initForm();
    this.myModal = this.modalService.open(this.modalRef, { centered: true });
  }
  submit() {
    this.btnLoading = null;
    const selectedDenominations: any[]=[];
    this.tabForm.value.denominations.map((el:any)=>selectedDenominations.push(el.id))
    console.log(selectedDenominations);
    const item = {
      label: this.tabForm.value.material,
      type: this.tabForm.value.type,
      denominations: selectedDenominations,
      active: this.tabForm.value.active,
    };
    if (this.addItem) {
      this.addItems(item);
    }
    if (this.editItem) {
      this.editItems(item, this.itemToEdit.id);
    }
  }
  close() {
    this.editItem = false;
    this.addItem = false;
    this.deleteItems = false;
    this.selectedDenominations=[];
    this.myModal.dismiss('Cross click');
  }
  deleteItem(data: any) {
    this.btnLoading = null;
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

  getAllItems() {
    this.simpleTabsRef.tabRef = 'materialTechniques';
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
    this.simpleTabsRef.tabRef = 'materialTechniques';

    this.btnLoading = '';
    this.simpleTabsRef.deleteItem(item).subscribe(
      (result: any) => {
        this.close();
        this.addSingle('success', 'Suppression', 'Matière/technique ' + item.label + ' supprimée avec succés');
        this.getAllItems();
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
    this.btnLoading = '';
    this.simpleTabsRef.tabRef = 'materialTechniques';
    this.simpleTabsRef.addItem(item).subscribe(
      (result: any) => {
        this.close();
        this.addSingle('success', 'Ajout', 'Matière/technique ' + item.label + ' ajoutée avec succés');
        this.getAllItems();
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
        this.getAllItems();
      },

      (error) => {
        this.addSingle('error', 'Modification', error.error.message);
      }
    );
  }
  editItems(item: any, id: number) {
    this.btnLoading = '';
    console.log(item);
    this.simpleTabsRef.tabRef = 'materialTechniques';
    this.simpleTabsRef.editItem(item, id).subscribe(
      (result) => {
        console.log(result);
        this.close();
        this.addSingle('success', 'Modification', 'Matière/technique ' + item.label + ' modifiée avec succés');
        this.getAllItems();
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
  onSelect(item: any) {
    console.log(item);
    console.log(this.tabForm.value.denomination);
    // this.tabForm.value.denominations.map((el: any) => this.selectedDenominations.push(el.id));
  }
  public onDeSelect(item: any) {
    this.selectedDenominations = this.selectedDenominations.filter((denomination: any) => {
      return denomination !== item.id;
    });
  }

  public onSelectAll(items: any) {
    items.map((item: any) => this.selectedDenominations.push(item.id));
  }
  public onDeSelectAll(items: any) {
    this.selectedDenominations = [];
  }
}
