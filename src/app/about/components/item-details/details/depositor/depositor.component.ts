import { Component, Input, OnInit } from '@angular/core';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { WorkOfArtService } from '@shared/services/work-of-art.service';

@Component({
  selector: 'app-depositor',
  templateUrl: './depositor.component.html',
  styleUrls: ['./depositor.component.scss'],
})
export class DepositorComponent implements OnInit {
  @Input() edit = false;
  dropdownSettings: IDropdownSettings;

  constructor(public WorkOfArtService: WorkOfArtService) {}

  ngOnInit(): void {
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
  onDomainSelect(item: any) {
    // this.denominations = item.denominations;
  }
  onSelectAll(items: any) {}
}
