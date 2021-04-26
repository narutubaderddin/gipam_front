import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-modal-tabs-ref',
  templateUrl: './modal-tabs-ref.component.html',
  styleUrls: ['./modal-tabs-ref.component.scss'],
})
export class ModalTabsRefComponent implements OnInit {
  @Output() passEntry: EventEmitter<any> = new EventEmitter();
  @Input() fromParent: any;
  addItem: boolean;
  deleteItems: boolean;
  editItem: boolean;
  tabForm: FormGroup;
  active = true;
  itemToDelete: any;
  itemToEdit: any;
  selectedItem: string;
  name: string;
  constructor(public fb: FormBuilder, public activeModal: NgbActiveModal) {}

  ngOnInit(): void {
    this.initForm();

    this.addItem = this.fromParent.addItem;
    this.deleteItems = this.fromParent.deleteItems;
    this.editItem = this.fromParent.editItem;
    this.itemToDelete = this.fromParent.itemToDelete;
    this.itemToEdit = this.fromParent.itemToEdit;
    this.active = this.fromParent.active;
    this.selectedItem = this.fromParent.selectedItem;
    this.name = this.fromParent.name;
    console.log(this.selectedItem, this.editItem);
  }
  initForm() {
    this.tabForm = this.fb.group({
      label: [this.selectedItem, [Validators.required]],
      active: [true],
    });
  }

  submit() {
    const item = {
      label: this.tabForm.value.style,
      active: this.tabForm.value.active,
    };

    this.activeModal.close(this.tabForm.value);
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
}
