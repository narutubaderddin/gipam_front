import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { SimpleTabsRefService } from '@shared/services/simple-tabs-ref.service';

@Component({
  selector: 'app-modal-report-sub-types',
  templateUrl: './modal-report-sub-types.component.html',
  styleUrls: ['./modal-report-sub-types.component.scss'],
})
export class ModalReportSubTypesComponent implements OnInit {
  @Output() passEntry: EventEmitter<any> = new EventEmitter();
  @Input() fromParent: any;
  addItem: boolean;
  btnLoading: boolean;
  deleteItems: boolean;
  editItem: boolean;
  tabForm: FormGroup;
  active = true;
  itemToDelete: any;
  itemToEdit: any;
  selectedItem: string;
  name: string;
  dropdownSettings: IDropdownSettings;
  dropdownList: any;
  reportTypes: any;
  selectedreportType: any;
  constructor(
    public fb: FormBuilder,
    public activeModal: NgbActiveModal,
    private simpleTabsRef: SimpleTabsRefService
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.dropdownSettings = {
      singleSelection: true,
      textField: 'label',
      idField: 'id',
      itemsShowLimit: 1,
      allowSearchFilter: true,
    };
    this.getAllReportTypes();

    this.addItem = this.fromParent.addItem;
    this.deleteItems = this.fromParent.deleteItems;
    this.editItem = this.fromParent.editItem;
    this.itemToDelete = this.fromParent.itemToDelete;
    this.itemToEdit = this.fromParent.itemToEdit;
    this.active = this.fromParent.active;
    this.selectedItem = this.fromParent.selectedItem;
    this.name = this.fromParent.name;
    this.selectedreportType = this.fromParent.selectedreportType ;
    console.log(this.selectedItem, this.editItem);
  }
  initForm() {
    this.tabForm = this.fb.group({
      reportType: [this.selectedItem, [Validators.required]],
      label: [this.selectedItem, [Validators.required]],
      active: [true],
    });
  }

  submit() {
    const item = {
      reportType: this.tabForm.value.reportType[0].id,
      label: this.tabForm.value.label,
      active: this.tabForm.value.active,
    };

    this.activeModal.close(item);
  }
  deleteItem() {
    this.activeModal.close('delete');
  }
  close() {
    this.editItem = false;
    this.addItem = false;
    this.deleteItems = false;
    this.activeModal.dismiss();
  }
  getAllReportTypes() {
    this.simpleTabsRef.tabRef = 'reportTypes';
    const params = {};
    this.simpleTabsRef.getAllItems(params).subscribe(
      (result: any) => {
        this.reportTypes = result.results;
        console.log(this.reportTypes);
      },
      (error: any) => {
        console.log('error', error.error.message);
      }
    );
  }
  onMvtTypesSelect(item: any) {
    this.selectedreportType = item;
    console.log(item);
  }
}
