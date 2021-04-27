import { Component, Input, OnInit } from '@angular/core';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { WorkOfArtService } from '@shared/services/work-of-art.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-add-descriptions',
  templateUrl: './add-descriptions.component.html',
  styleUrls: ['./add-descriptions.component.scss'],
})
export class AddDescriptionsComponent implements OnInit {
  domains: any;
  @Input() keyword: string;
  @Input() addDepot = false;
  @Input() addProperty = true;
  @Input() descriptifForm: FormGroup;
  items: any = [];
  domain = '';
  denominations: any;
  denomination: any;
  selectedDomain = '';
  isCollapsed = true;
  dropdownSettings: IDropdownSettings;
  autocompleteItems = ['Item1', 'item2', 'item3'];

  constructor(public WorkOfArtService: WorkOfArtService, public fb: FormBuilder) {}

  ngOnInit(): void {
    this.domains = this.WorkOfArtService.domaine;
    this.dropdownSettings = {
      singleSelection: false,
      idField: 'id',
      textField: 'name',
      selectAllText: 'Sélectionner tout',
      unSelectAllText: 'Supprimer les sélections',
      itemsShowLimit: 1,
      allowSearchFilter: true,
    };
  }
  get f() {
    return this.descriptifForm.controls;
  }
  onTagEdited(e: any) {
    console.log(e);
  }
  selectEvent(item: any) {}

  onChangeSearch(val: string) {
    // fetch remote data from here
    // And reassign the 'data' which is binded to 'data' property.
  }

  onFocused(e: any) {
    // do something when input is focused
  }

  onCollapse() {
    this.isCollapsed = !this.isCollapsed;
  }
  onDomainSelect(item: any) {
    this.denominations = item.value.denominations;
    this.selectedDomain = item.value.name;
  }
  onDenominationSelect(item: any) {
    this.denomination = item;
    console.log('item', item);
  }
  onAuthorSelect(item: any) {
    console.log('author', item);
  }
  onSelectAll(items: any) {}
}
