import { Component, Input, OnInit } from '@angular/core';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { WorkOfArtService } from '@shared/services/work-of-art.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { forkJoin } from 'rxjs';
import { DenominationsService } from '@app/@shared/services/denominations.service';
import { FieldsService } from '@app/@shared/services/fields.service';
import { StylesService } from '@app/@shared/services/styles.service';
import { SimpleTabsRefService } from '@app/@shared/services/simple-tabs-ref.service';
import { MaterialTechniqueService } from '@app/@shared/services/material-technique.service';

@Component({
  selector: 'app-add-descriptions',
  templateUrl: './add-descriptions.component.html',
  styleUrls: ['./add-descriptions.component.scss'],
})
export class AddDescriptionsComponent implements OnInit {
  domains: any;
  @Input() keyword: string;
  @Input() addDepot = false;
  @Input() descriptifForm: FormGroup;
  items: any = [];
  domain = '';
  denominations: any;
  denomination: any;
  selectedDomain = '';
  isCollapsed = true;
  dropdownSettings: IDropdownSettings;
  autocompleteItems = ['Item1', 'item2', 'item3'];
  domainData: any[];
  denominationData: any[];
  styleData: any[];
  materialTechniquesData: any[];
  authorData: any[];
  categoriesData: any[];
  depositorsData: any[];
  eraData: any[];
  entryModesData: any[];
  materialTechniques: any;
  constructor(
    private fieldService: FieldsService,
    private denominationsService: DenominationsService,
    private styleService: StylesService,
    private simpleTabsRefService: SimpleTabsRefService,
    private materialTechniqueService: MaterialTechniqueService,
    public fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.initFilterData();
  }
  get f() {
    return this.descriptifForm.controls;
  }
  getTabRefData(result: any[]) {
    let items: any[] = [];
    result.forEach((item: any) => {
      if (item.hasOwnProperty('label')) {
        items.push({ id: item.id, name: item.label });
      } else {
        items.push({ id: item.id, name: item.name });
      }
    });
    return items;
  }
  initFilterData() {
    const data = {
      page: 1,
      'active[eq]': 1,
      serializer_group: JSON.stringify(['response', 'short']),
    };
    forkJoin([
      this.fieldService.getAllFields(data),
      this.denominationsService.getAllDenominations(data),
      this.styleService.getAllItems(data),
      this.simpleTabsRefService.getAllItems(data, 'materialTechniques'),
      this.simpleTabsRefService.getAllItems(data, 'eras'),
      this.simpleTabsRefService.getAllItems(data, 'authors'),
      this.simpleTabsRefService.getAllItems(data, 'propertyStatusCategories'),
      this.simpleTabsRefService.getAllItems(data, 'depositors'),
      this.simpleTabsRefService.getAllItems(data, 'entryModes'),
    ]).subscribe(
      ([
        fieldsResults,
        denominationResults,
        styleResults,
        materialTechniquesResults,
        eraResults,
        authorResults,
        categoriesResults,
        depositorsResults,
        entryModesData,
      ]) => {
        this.domainData = this.getTabRefData(fieldsResults['results']);
        this.denominationData = denominationResults['results'];
        this.denominations = denominationResults['results'];
        this.styleData = this.getTabRefData(styleResults['results']);
        this.materialTechniquesData = materialTechniquesResults['results'];
        this.materialTechniques = materialTechniquesResults['results'];
        this.authorData = this.getTabRefData(authorResults['results']);
        this.categoriesData = this.getTabRefData(categoriesResults['results']);
        this.depositorsData = this.getTabRefData(depositorsResults['results']);
        this.eraData = this.getTabRefData(eraResults['results']);
        this.entryModesData = this.getTabRefData(entryModesData['results']);
      }
    );
  }
  onMultiselectChange(key = 'field') {
    let selectedData = this.descriptifForm.get(key).value;
    let selectedDataId: any[] = [];
    if (Array.isArray(selectedData)) {
      selectedData.forEach((selectedDataValue: any) => {
        selectedDataId.push(selectedDataValue.id);
      });
    }

    const apiData = {
      page: 1,
      'active[eq]': 1,
    };
    switch (key) {
      case 'field':
        let materialApiData = Object.assign({}, apiData);
        apiData['field[in]'] = JSON.stringify(selectedDataId);
        materialApiData['field'] = JSON.stringify(selectedDataId);
        forkJoin([
          this.denominationsService.getAllDenominations(apiData),
          this.materialTechniqueService.getFilteredMaterialTechnique(materialApiData),
        ]).subscribe(([denominationResults, materialTechniquesResults]) => {
          this.denominationData = this.getTabRefData(denominationResults['results']);
          this.materialTechniquesData = this.getTabRefData(materialTechniquesResults['results']);
        });
        break;
      case 'denomination':
        apiData['denomination'] = JSON.stringify(selectedDataId);
        selectedData = this.descriptifForm.get('field').value;
        selectedDataId = [];
        if (Array.isArray(selectedData)) {
          selectedData.forEach((selectedDataValue: any) => {
            selectedDataId.push(selectedDataValue.id);
          });
        }

        apiData['field'] = JSON.stringify(selectedDataId);
        this.materialTechniqueService.getFilteredMaterialTechnique(apiData).subscribe((materialTechniquesResults) => {
          this.materialTechniquesData = this.getTabRefData(materialTechniquesResults['results']);
        });

        break;
    }
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
  onSelect(value: any, item: string) {
    if (item == 'field') {
      this.selectedDomain = value.value.name;
      this.denominationData = this.denominations.filter((denomination: any) => {
        return denomination.field.id == value.value.id;
      });
    }
    if (item == 'denomination') {
      this.selectedDomain = value.value.field.label;
      this.materialTechniquesData = this.materialTechniques.filter((material: any) => {
        return material.denominations.filter((denomination: any) => {
          denomination.label == value.value.label;
        });
      });
    }
    console.log('mat', this.materialTechniquesData);
  }
  onDenominationSelect(item: any) {
    this.denomination = item;
  }
  onAuthorSelect(item: any) {}
  onSelectAll(items: any) {}
}
