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
import { retry } from 'rxjs/operators';

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
  isCollapsed = true;
  dropdownSettings: IDropdownSettings;
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
    private workOfArtService: WorkOfArtService,
    public fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.initFilterData();
    // if (this.denomination && this.field) {
    //   this.getAttributes();
    // }
  }
  get f() {
    return this.descriptifForm.controls;
  }
  get field() {
    return this.descriptifForm.get('field').value;
  }
  get denomination() {
    return this.descriptifForm.get('denomination').value;
  }
  getAttributes() {
    this.workOfArtService.getAttributes(this.field, this.denomination).subscribe((result) => {
      this.attributeToShow = result;
      console.log(result);
    });
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
        this.denominationData = this.denominations.filter((denomi: any) => {
          return denomi.field.id === value.value;
        });
        const isTrue = this.denominationData.filter((den: any) => {
          return den.id === this.denomination && den.field.id === this.field;
        });
        if (!isTrue.length) {
          this.descriptifForm.get('denomination').setValue(null);
        }
        this.field && this.denomination ? this.getAttributes() : '';
        break;
      case 'denomination':
        this.field && this.denomination ? this.getAttributes() : '';
        const denomination = this.denominationData.filter((den: any) => {
          return den.id === value.value;
        });
        this.field ? (materialApiData['fields'] = JSON.stringify([this.field])) : '';
        materialApiData['denominations'] = JSON.stringify([this.denomination]);
        forkJoin([this.materialTechniqueService.getFilteredMaterialTechnique(materialApiData)]).subscribe(
          ([materialTechniquesResults]) => {
            this.materialTechniquesData = this.getTabRefData(materialTechniquesResults['results']);
          }
        );
        break;
    }
  }
}
