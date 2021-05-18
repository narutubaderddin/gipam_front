import { WorkOfArtService } from '@shared/services/work-of-art.service';
import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { FormBuilder, FormGroup } from '@angular/forms';
import { FieldsService } from '@shared/services/fields.service';
import { DenominationsService } from '@shared/services/denominations.service';
import { StylesService } from '@shared/services/styles.service';
import { SimpleTabsRefService } from '@shared/services/simple-tabs-ref.service';
import { MaterialTechniqueService } from '@shared/services/material-technique.service';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-descritif',
  templateUrl: './descritif.component.html',
  styleUrls: ['./descritif.component.scss'],
})
export class DescritifComponent implements OnInit, OnChanges {
  domains: any;
  @Input() keyword: string;
  @Input() edit = false;
  @Input() addDepot = false;
  @Input() addProperty = true;
  @Input() descriptifForm: FormGroup;
  @Input() artwork: any;

  items: any = [];
  domain = '';
  denominations: any;
  // denomination: any;
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
  attributeToShow: any;
  constructor(
    private fieldService: FieldsService,
    private denominationsService: DenominationsService,
    private styleService: StylesService,
    private simpleTabsRefService: SimpleTabsRefService,
    private materialTechniqueService: MaterialTechniqueService,
    public fb: FormBuilder,
    private workOfArtService: WorkOfArtService
  ) {}
  get item() {
    console.log(this.artwork);
    return this.artwork;
  }
  get field() {
    return this.descriptifForm.get('field').value;
  }
  get denomination() {
    return this.descriptifForm.get('denomination').value;
  }

  getAttributes() {
    let field = this.artwork.field.id;
    let denomination = this.artwork.denomination.id;
    if (this.edit) {
      field = this.field;
      denomination = this.denomination;
    }
    this.workOfArtService.getAttributes(field, denomination).subscribe((result) => {
      this.attributeToShow = result;
      console.log('attributeToShow', result);
    });
  }
  ngOnInit(): void {
    this.getAttributes();
    this.initFilterData();
    this.initData();
  }
  ngOnChanges() {
    if (this.artwork) {
      console.log('artwork', this.artwork);
    }
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

  private initData() {
    if (this.artwork) {
      this.selectedDomain = this.artwork['field'];
      console.log(this.selectedDomain, this.artwork['field']);
    }
  }
}
