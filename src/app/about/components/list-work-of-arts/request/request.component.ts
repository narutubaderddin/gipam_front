import { Component, Input, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
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
  value: number = 40;
  highValue: number = 60;
  options: Options = {
    floor: 0,
    ceil: 9999,
  };
  domaine: any;
  items: FormArray;
  selectedItems: any;
  dateOperator = ['En', 'Entre', 'Supérieure à', 'Inférieure à'];
  dropdownSettings: IDropdownSettings;
  showAdvancedSearchBloc = false;
  constructor(private formBuilder: FormBuilder, public WorkOfArtService: WorkOfArtService) {}

  ngOnInit() {
    this.domaine = this.WorkOfArtService.domaine;
    this.dropdownSettings = {
      singleSelection: false,
      idField: 'id',
      textField: 'name',
      selectAllText: 'Sélectionner tout',
      unSelectAllText: 'Supprimer les sélections',
      itemsShowLimit: 1,
      allowSearchFilter: true,
    };
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

  openAdvancedSearchBloc() {
    this.showAdvancedSearchBloc = !this.showAdvancedSearchBloc;
  }
}
