import { Options } from '@angular-slider/ngx-slider';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { WorkOfArtService } from '@shared/services/work-of-art.service';
import { IDropdownSettings } from 'ng-multiselect-dropdown';

@Component({
  selector: 'app-request',
  templateUrl: './request.component.html',
  styleUrls: ['./request.component.scss'],
})
export class RequestComponent implements OnInit {
  @Input() fields: any;
  @Output() validateRequest = new EventEmitter<any>();
  inventoryValue = 0;
  hightInventoryValue = 60;
  value: number = 40;
  highValue: number = 60;
  lengthValue = 0;
  highLengthValue = 60;
  widthValue = 0;
  highWidthValue = 60;
  totValue: number = 40;
  highTotValue: number = 60;
  totLengthValue = 0;
  highTotLengthValue = 60;
  totWidthValue = 0;
  highTotWidthValue = 60;
  depthValue = 0;
  highDepthValue = 60;
  weightValue = 0;
  highWeightValue = 60;
  dimensionsOptions: Options;
  inventoryOptions: Options;
  poundsOprions: Options;
  domaine: any;
  denominations: any;
  dropdownSettings: IDropdownSettings;
  showAdvancedSearchBloc = false;
  constructor(public WorkOfArtService: WorkOfArtService) {}

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
    this.dimensionsOptions = {
      floor: 0,
      ceil: 9999,
      translate: (value: number): string => {
        return value + 'cm';
      },
    };
    this.inventoryOptions = {
      floor: 0,
      ceil: 9999,
    };
    this.poundsOprions = {
      floor: 0,
      ceil: 9999,
      translate: (value: number): string => {
        return value + 'Kg';
      },
    };
  }

  onItemSelect(item: any) {
    console.log(item);
  }
  onSelectAll(items: any) {}
  onDomainSelect(item: any) {
    this.denominations = item.denominations;
  }
  openAdvancedSearchBloc() {
    this.showAdvancedSearchBloc = !this.showAdvancedSearchBloc;
  }

  onValidateRequest() {
    this.validateRequest.emit(true);
  }
}
