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
        this.authorData = this.getTabRefData(authorResults['results']);
        this.categoriesData = this.getTabRefData(categoriesResults['results']);
        this.depositorsData = this.getTabRefData(depositorsResults['results']);
        this.eraData = this.getTabRefData(eraResults['results']);
        this.entryModesData = this.getTabRefData(entryModesData['results']);
      }
    );
  }

  onTagEdited(e: any) {
    console.log(e);
  }

  onCollapse() {
    this.isCollapsed = !this.isCollapsed;
  }
  onSelect(value: any, key: string) {
    const apiData = {
      page: 1,
      'active[eq]': 1,
    };
    const materialApiData = Object.assign({}, apiData);

    switch (key) {
      case 'field':
        this.selectedDomain = value.value.name;
        this.denominationData = this.denominations.filter((denomination: any) => {
          return denomination.field.id === value.value.id;
        });
        materialApiData['denominations'] = JSON.stringify(this.denominationData);
        forkJoin([this.materialTechniqueService.getFilteredMaterialTechnique(materialApiData)]).subscribe(
          ([materialTechniquesResults]) => {
            this.materialTechniquesData = this.getTabRefData(materialTechniquesResults['results']);
          }
        );
        break;
      case 'denomination':
        const selectedDomain = this.getTabRefData([value.value.field]);
        if (!this.descriptifForm.get('field').value.length) {
          this.descriptifForm.get('field').setValue(selectedDomain[0]);
        }

        materialApiData['denominations'] = JSON.stringify([value.value]);
        forkJoin([this.materialTechniqueService.getFilteredMaterialTechnique(materialApiData)]).subscribe(
          ([materialTechniquesResults]) => {
            this.materialTechniquesData = this.getTabRefData(materialTechniquesResults['results']);
          }
        );
        break;
    }
  }
}
