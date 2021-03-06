import { WorkOfArtService } from '@shared/services/work-of-art.service';
import {Component, Input, OnChanges, OnInit, Output, EventEmitter, ViewChild, TemplateRef} from '@angular/core';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import { FieldsService } from '@shared/services/fields.service';
import { DenominationsService } from '@shared/services/denominations.service';
import { StylesService } from '@shared/services/styles.service';
import { SimpleTabsRefService } from '@shared/services/simple-tabs-ref.service';
import { MaterialTechniqueService } from '@shared/services/material-technique.service';
import { forkJoin } from 'rxjs';
import {getMultiSelectIds} from "@shared/utils/helpers";
import {MessageService} from "primeng/api";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: 'app-descritif',
  templateUrl: './descritif.component.html',
  styleUrls: ['./descritif.component.scss'],
})
export class DescritifComponent implements OnInit, OnChanges {
  @ViewChild('content') modalRef: TemplateRef<any>;
  domains: any;
  @Input() keyword: string;
  @Input() edit = false;
  @Input() addDepot = false;
  @Input() addProperty = true;
  @Input() descriptifForm: FormGroup;
  @Input() artwork: any;
  @Output() attributes = new EventEmitter<boolean>();
  items: any = [];
  domain = '';
  denominations: any;
  // descriptiveWords: any[] = [];
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
  activeTypes: any;
  activePeople: any;
  authorForm: FormGroup;
  selectedAuthor: any;
  myModal: any;
  btnLoading: any = null;
  noData=' - '
  unit=' cm '
  data = {
    page: 1,
    serializer_group: JSON.stringify(['short']),
    'active[eq]': 1,
  };
  constructor(
    private fieldService: FieldsService,
    private denominationsService: DenominationsService,
    private styleService: StylesService,
    private simpleTabsRefService: SimpleTabsRefService,
    private materialTechniqueService: MaterialTechniqueService,
    public fb: FormBuilder,
    private workOfArtService: WorkOfArtService,
    private messageService: MessageService,
    private modalService: NgbModal,
  ) {}
  get item() {
    console.log(this.artwork);
    return this.artwork;
  }
  get field() {
    return this.descriptifForm.get('field')?.value;
  }
  get denomination() {
    return this.descriptifForm.get('denomination')?.value;
  }
  get descriptiveWords(){
    return this.descriptifForm.get('descriptiveWords')?.value;
  }

  getAttributes() {
    let field = this.artwork?.field?.id;
    let denomination = this.artwork?.denomination?.id;
    if (this.edit && this.field && this.denomination) {
      field = this.field.id;
      denomination = this.denomination.id;
    }
    if (this.field && this.denomination) {
      this.workOfArtService.getAttributes(field, denomination).subscribe((result) => {
        this.attributeToShow = result;
        this.attributes.emit(result);
      });
    }
  }
  ngOnInit(): void {
    this.getAttributes();
    this.initFilterData();
    this.initData();
  }
  ngOnChanges() {
    if (this.artwork) {
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
        this.authorData = authorResults['results'];
        this.categoriesData = this.getTabRefData(categoriesResults['results']);
        this.depositorsData = this.getTabRefData(depositorsResults['results']);
        this.eraData = this.getTabRefData(eraResults['results']);
        this.entryModesData = this.getTabRefData(entryModesData['results']);
        if (this.field && this.denomination && this.denominationData) {
          this.getMaterialData();
        }
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
          return denomi.field.id === value.value.id;
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

  getMaterialData() {
    const apiData = {
      page: 1,
      'active[eq]': 1,
    };
    const materialApiData = Object.assign({}, apiData);

    this.field ? (materialApiData['fields'] = JSON.stringify([this.field])) : '';
    materialApiData['denominations'] = JSON.stringify([this.denomination]);
    forkJoin([this.materialTechniqueService.getFilteredMaterialTechnique(materialApiData)]).subscribe(
      ([materialTechniquesResults]) => {
        this.materialTechniquesData = this.getTabRefData(materialTechniquesResults['results']);
      }
    );
  }
  onChange(event: Date) {

    if (event && !isNaN(event.getFullYear())) {
      this.descriptifForm.get('creationDate').setValue(event.getFullYear());
    }
  }
  initData() {
    if (this.artwork) {
      this.selectedDomain = this.artwork['field'];
    }
  }

  addWord(event: any) {
    this.descriptifForm.get('descriptiveWords').setValue(this.descriptiveWords);
  }

  openModal() {
    this.initForm();
    this.getActiveRelatedEntities();
    this.myModal = this.modalService.open(this.modalRef, { centered: true });
  }
  initForm() {
    this.authorForm = this.fb.group({
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      type: ['', []],
      people: [[], []],
      active: [true],
    });
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
        this.addSingle('error', 'Erreur Technique', 'Une erreur servenu lors de l\'ajout');
      }
    );
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
    this.simpleTabsRefService.addItem(item, 'authors').subscribe(
      (result: any) => {
        this.myModal.dismiss('Cross click');

        this.addSingle('success', 'Ajout', 'Auteur ' + item.firstName + ' ' + item.lastName + ' ajout??e avec succ??s');
        forkJoin([this.simpleTabsRefService.getAllItems(this.data, 'authors')]).subscribe(([authorResults]) => {
          this.authorData = authorResults['results'];
        });
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

  closeModal() {
    this.myModal.dismiss('Cross click');
  }
}
