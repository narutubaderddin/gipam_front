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
import { map } from 'rxjs/operators';
import { ArtWorkService } from '@app/about/services/art-work.service';

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
  items: any = [];
  domain = '';
  @Input() denominations: any;
  isCollapsed = true;
  dropdownSettings: IDropdownSettings;
  @Input() domainData: any[];
  @Input() denominationData: any[];
  @Input() styleData: any[];
  materialTechniquesData: any[];
  @Input() authorData: any[];
  @Input() depositorsData: any[];
  @Input() eraData: any[];
  materialTechniques: any;
  attributeToShow: any;
  descriptiveWords: any[] = [];
  page = 1;
  query = '';
  same = true;
  authorForm: FormGroup;
  selectedAuthor: any;
  btnLoading: any = null;
  myModal: any;
  activeTypes: any;
  activePeople: any;
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
    private workOfArtService: WorkOfArtService,
    public fb: FormBuilder,
    private renderer: Renderer2,
    private messageService: MessageService,
    private modalService: NgbModal,
    private artWorkService: ArtWorkService
  ) {}

  ngOnInit(): void {
    this.descriptifForm.get('descriptiveWords').value
      ? (this.descriptiveWords = this.descriptifForm.get('descriptiveWords').value)
      : (this.descriptiveWords = []);
    this.simpleTabsRefService.tabRef = 'authors';
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
          this.materialTechniquesData = this.simpleTabsRefService.getTabRefFilterData(
            materialTechniquesResults['results']
          );
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
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      type: ['', []],
      people: [[], []],
      active: [true],
    });
  }
  getAttributes() {
    this.workOfArtService.getAttributes(this.field, this.denomination).subscribe((result) => {
      this.attributeToShow = result;
    });
  }
  public requestAutocompleteItems = (text: string) => {
    return this.artWorkService.getAutocompleteData(text, 'description').pipe(map((data) => data));
  };
  addWord(event: any) {
    console.log(event);
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
        console.log(value);
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
        materialApiData['denominations'] = JSON.stringify([this.denomination]);
        forkJoin([this.materialTechniqueService.getFilteredMaterialTechnique(materialApiData)]).subscribe(
          ([materialTechniquesResults]) => {
            this.materialTechniquesData = this.simpleTabsRefService.getTabRefFilterData(
              materialTechniquesResults['results']
            );
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
        forkJoin([this.simpleTabsRefService.getAllItems(this.data, 'authors')]).subscribe(([authorResults]) => {
          this.authorData = this.simpleTabsRefService.getTabRefFilterData(authorResults['results']);
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
