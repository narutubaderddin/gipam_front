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
    this.dropdownSettings = {
      singleSelection: true,
      textField: 'label',
      idField: 'id',
      itemsShowLimit: 1,
      allowSearchFilter: true,
    };
    this.addItem = this.fromParent.addItem;

    this.deleteItems = this.fromParent.deleteItems;
    this.editItem = this.fromParent.editItem;
    this.itemToDelete = this.fromParent.itemToDelete;
    this.itemToEdit = this.fromParent.itemToEdit;
    this.active = this.fromParent.active;
    this.selectedItem = this.fromParent.selectedItem;
    this.name = this.fromParent.name;
    this.selectedreportType = this.fromParent.selectedReportType;
    this.reportTypes = this.fromParent.activeRelatedEntities;
    this.initForm();
  }
  initForm() {
    this.tabForm = this.fb.group({
      label: [this.selectedItem, [Validators.required]],
      reportType: [this.selectedreportType ? this.selectedreportType.label : '', [Validators.required]],
      active: [this.active],
    });
  }

  submit() {
    const item = {
      reportType: this.tabForm.value.reportType.id,
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

  onReportTypesSelect(item: any) {
    this.selectedreportType = item;
    console.log(item);
  }
}
