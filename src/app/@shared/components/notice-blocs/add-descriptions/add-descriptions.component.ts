import { Component, EventEmitter, Input, OnInit, Output, Renderer2, TemplateRef, ViewChild } from '@angular/core';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { WorkOfArtService } from '@shared/services/work-of-art.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { forkJoin } from 'rxjs';
import { DenominationsService } from '@app/@shared/services/denominations.service';
import { FieldsService } from '@app/@shared/services/fields.service';
import { StylesService } from '@app/@shared/services/styles.service';
import { SimpleTabsRefService } from '@app/@shared/services/simple-tabs-ref.service';
import { MaterialTechniqueService } from '@app/@shared/services/material-technique.service';
import { getMultiSelectIds } from '@shared/utils/helpers';
import { MessageService } from 'primeng/api';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-add-descriptions',
  templateUrl: './add-descriptions.component.html',
  styleUrls: ['./add-descriptions.component.scss'],
})
export class AddDescriptionsComponent implements OnInit {
  @ViewChild('content') modalRef: TemplateRef<any>;
  domains: any;
  @Input() keyword: string;
  @Input() addDepot = false;
  @Input() descriptifForm: FormGroup;
  @Input() addProperty: boolean;
  @Output() isLoading: EventEmitter<boolean> = new EventEmitter();
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
  descriptiveWords: any[] = [];
  page = 1;
  query = '';
  same = true;
  authorForm: FormGroup;
  selectedAuthor: any;
  selectedAuthorType: any;
  selectedPeople: any;
  btnLoading: any = null;
  myModal: any;
  activeTypes: any;
  activePeople: any;
  constructor(
    private fieldService: FieldsService,
    private denominationsService: DenominationsService,
    private styleService: StylesService,
    private simpleTabsRefService: SimpleTabsRefService,
    private materialTechniqueService: MaterialTechniqueService,
    private workOfArtService: WorkOfArtService,
    public fb: FormBuilder,
    private renderer: Renderer2,
    private messageService: MessageService,
    private modalService: NgbModal
  ) {}

  ngOnInit(): void {
    this.initFilterData();
    if (this.denomination && this.field) {
      this.getAttributes();
      const apiData = {
        page: 1,
        'active[eq]': 1,
      };
      const materialApiData = Object.assign({}, apiData);
      materialApiData['denominations'] = JSON.stringify([this.denomination]);
      forkJoin([this.materialTechniqueService.getFilteredMaterialTechnique(materialApiData)]).subscribe(
        ([materialTechniquesResults]) => {
          this.materialTechniquesData = this.getTabRefData(materialTechniquesResults['results']);
        }
      );
    }
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
  initForm() {
    this.authorForm = this.fb.group({
      firstName: [this.selectedAuthor ? this.selectedAuthor.firstName : '', [Validators.required]],
      lastName: [this.selectedAuthor ? this.selectedAuthor.lastName : '', [Validators.required]],
      type: [this.selectedAuthorType ? this.selectedAuthorType : '', []],
      people: [this.selectedPeople ? this.selectedPeople : [], []],
      active: [this.selectedAuthor ? this.selectedAuthor?.active : true],
    });
  }
  getAttributes() {
    this.workOfArtService.getAttributes(this.field, this.denomination).subscribe((result) => {
      this.attributeToShow = result;
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
    const authorData = {
      page: 1,
      'active[eq]': 1,
      serializer_group: JSON.stringify(['response', 'short']),
    };
    forkJoin([
      this.fieldService.getAllFields(data),
      this.denominationsService.getAllDenominations(data),
      this.styleService.getAllItems(data),
      this.simpleTabsRefService.getAllItems(data, 'eras'),
      this.simpleTabsRefService.getAllItems(authorData, 'authors'),
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
        this.isLoading.emit(false);
      }
    );
  }

  addWord(event: any) {
    this.descriptiveWords.push(event.value);
    this.descriptifForm.get('descriptiveWords').setValue(this.descriptiveWords);
  }

  onCollapse() {
    this.isCollapsed = !this.isCollapsed;
  }
  onChange(event: Date) {
    if (event && !isNaN(event.getFullYear())) {
      this.descriptifForm.get('creationDate').setValue(event.getFullYear());
    }
  }
  onSelect(value: any, key: string) {
    const apiData = {
      page: 1,
      'active[eq]': 1,
    };
    const materialApiData = Object.assign({}, apiData);

    switch (key) {
      case 'field':
        console.log(this.denominations);
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
        materialApiData['denominations'] = JSON.stringify([this.denomination]);
        forkJoin([this.materialTechniqueService.getFilteredMaterialTechnique(materialApiData)]).subscribe(
          ([materialTechniquesResults]) => {
            this.materialTechniquesData = this.getTabRefData(materialTechniquesResults['results']);
          }
        );
        break;
    }
  }

  submit() {
    this.btnLoading = true;
    const item = {
      firstName: this.authorForm.value.firstName,
      lastName: this.authorForm.value.lastName,
      type: this.authorForm.value.type.id,
      people: getMultiSelectIds(this.authorForm.value.people),
      active: this.authorForm.value.active,
    };
    this.simpleTabsRefService.addItem(item).subscribe(
      (result: any) => {
        this.myModal.dismiss('Cross click');
        this.addSingle('success', 'Ajout', 'Auteur ' + item.firstName + ' ' + item.lastName + ' ajoutée avec succés');
      },
      (error) => {
        this.addSingle('error', 'Ajout', error.error.message);
        this.simpleTabsRefService.getFormErrors(error.error.errors, 'Ajout');
      }
    );
  }
  addSingle(type: string, sum: string, msg: string) {
    this.messageService.add({ severity: type, summary: sum, detail: msg });
    this.btnLoading = null;
  }
  getActiveRelatedEntities() {
    const data = {
      page: 1,
      serializer_group: JSON.stringify(['short']),
      'active[eq]': 1,
    };
    this.authorForm.get('people').disable();
    this.authorForm.get('type').disable();

    forkJoin([
      this.simpleTabsRefService.getAllItems(data, 'authorTypes'),
      this.simpleTabsRefService.getAllItems(data, 'persons'),
    ]).subscribe(
      ([typesResults, peopleResults]) => {
        this.activeTypes = typesResults.results;
        this.activePeople = peopleResults.results;
        this.authorForm.get('people').enable();
        this.authorForm.get('type').enable();
      },
      (error: any) => {
        this.addSingle('error', 'Erreur Technique', ' Message: ' + error.error.message);
      }
    );
  }
  openModal() {
    this.initForm();
    this.getActiveRelatedEntities();
    this.myModal = this.modalService.open(this.modalRef, { centered: true });
  }
}
