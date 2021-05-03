import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { SimpleTabsRefService } from '@shared/services/simple-tabs-ref.service';

@Component({
  selector: 'app-modal-mvt-action-types',
  templateUrl: './modal-mvt-action-types.component.html',
  styleUrls: ['./modal-mvt-action-types.component.scss'],
})
export class ModalMvtActionTypesComponent implements OnInit {
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
  mvtTypes: any;
  selectedMvtType: any;
  constructor(
    public fb: FormBuilder,
    public activeModal: NgbActiveModal,
    private simpleTabsRef: SimpleTabsRefService
  ) {}

  ngOnInit(): void {

    this.getAllMvtTypes();

    this.addItem = this.fromParent.addItem;
    this.deleteItems = this.fromParent.deleteItems;
    this.editItem = this.fromParent.editItem;
    this.itemToDelete = this.fromParent.itemToDelete;
    this.itemToEdit = this.fromParent.itemToEdit;
    this.active = this.fromParent.active;
    this.selectedItem = this.fromParent.selectedItem;
    this.name = this.fromParent.name;
    this.btnLoading =this.fromParent.btnLoading;
    this.selectedMvtType = this.fromParent.selectedMvtType ;
    console.log('selectedItem', this.selectedItem, this.editItem);
    console.log('selectedMvtType', this.selectedMvtType);
    this.initForm();
  }
  initForm() {
    this.tabForm = this.fb.group({
      movementType: [this.selectedMvtType, [Validators.required]],
      label: [this.selectedItem, [Validators.required]],
      active: [true],
    });
  }

  submit() {
    const item = {
      movementType: this.tabForm.value.movementType.id,
      label: this.tabForm.value.label,
      active: this.tabForm.value.active,
    };

    this.activeModal.close(item);
  }
  deleteItem() {
    this.activeModal.close('delete');
  }
  close() {
    this.selectedMvtType={};
    this.selectedItem='';
    this.editItem = false;
    this.addItem = false;
    this.deleteItems = false;
    this.activeModal.dismiss();
  }
  getAllMvtTypes() {
    this.simpleTabsRef.tabRef = 'movementTypes';
    const params = {};
    this.simpleTabsRef.getAllItems(params).subscribe(
      (result: any) => {
        this.mvtTypes = result.results;
        console.log(this.mvtTypes);
      },
      (error: any) => {
        console.log('error', error.error.message);
      }
    );
  }
  // onMvtTypesSelect(item: any) {
  //   this.selectedMvtType = item;
  //   console.log(item);
  // }
  onMvtTypesSelect(item: any) {
    this.selectedMvtType = item;
    console.log('item',item);
    console.log(this.selectedItem)
  }
}
