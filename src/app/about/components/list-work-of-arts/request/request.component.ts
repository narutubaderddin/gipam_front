import { Component, Input, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { WorkOfArtService } from '@shared/services/work-of-art.service';
import { IDropdownSettings } from 'ng-multiselect-dropdown';

@Component({
  selector: 'app-request',
  templateUrl: './request.component.html',
  styleUrls: ['./request.component.scss'],
})
export class RequestComponent implements OnInit {
  @Input() fields: any;
  orderForm: FormGroup;
  items: FormArray;
  selectedItems: any;
  dateOperator = ['En', 'Entre', 'Supérieure à', 'Inférieure à'];
  dropdownSettings: IDropdownSettings = {
    singleSelection: false,
    idField: '',
    textField: '',
    selectAllText: 'Sélectionner tout',
    unSelectAllText: 'Supprimer les sélections',
    itemsShowLimit: 3,
    allowSearchFilter: true,
  };
  constructor(private formBuilder: FormBuilder, public WorkOfArtService: WorkOfArtService) {}

  ngOnInit() {
    this.orderForm = new FormGroup({
      items: new FormArray([]),
    });
  }

  createItem(): FormGroup {
    return this.formBuilder.group({
      field: '',
      operator: '',
      value: '',
    });
  }

  addItem(): void {
    this.items = this.orderForm.get('items') as FormArray;
    this.items.push(this.createItem());
  }

  removeElement(i: any) {
    const remove = this.orderForm.get('items') as FormArray;
    remove.removeAt(i);
  }
  onItemSelect(item: any) {
    console.log(item);
  }
  onSelectAll(items: any) {
    console.log(items);
  }
}
