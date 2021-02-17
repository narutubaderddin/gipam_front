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
  value: number = 40;
  highValue: number = 60;
  dimensionsOptions: Options;
  poundsOprions: Options;
  domaine: any;
  dateOperator = ['En', 'Entre', 'Supérieure à', 'Inférieure à'];
  dropdownSettings: IDropdownSettings;
  showAdvancedSearchBloc = false;
  denomination: any;
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
    this.denomination = item.denominations;
  }
  openAdvancedSearchBloc() {
    this.showAdvancedSearchBloc = !this.showAdvancedSearchBloc;
  }

  onValidateRequest() {
    this.validateRequest.emit(true);
  }
}
