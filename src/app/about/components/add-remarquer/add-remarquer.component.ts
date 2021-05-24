import { ChangeDetectorRef, Component, ElementRef, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { WorkOfArtService } from '@shared/services/work-of-art.service';
import { NgWizardConfig, NgWizardService, StepChangedArgs, StepValidationArgs, THEME } from 'ng-wizard';
import { forkJoin, Observable, of, Subscription } from 'rxjs';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { DatePipe } from '@angular/common';
import { FieldsService } from '@shared/services/fields.service';
import { DenominationsService } from '@shared/services/denominations.service';
import { StylesService } from '@shared/services/styles.service';
import { SimpleTabsRefService } from '@shared/services/simple-tabs-ref.service';

@Component({
  selector: 'app-add-remarquer',
  templateUrl: './add-remarquer.component.html',
  styleUrls: ['./add-remarquer.component.scss'],
  providers: [DatePipe],
})
export class AddRemarquerComponent implements OnInit, OnDestroy {
  @ViewChild('content') ngTemplate: ElementRef;
  domainData: any[];
  denominationData: any[];
  styleData: any[];
  authorData: any[];
  depositorsData: any[];
  eraData: any[];
  data = {
    page: 1,
    serializer_group: JSON.stringify(['short']),
    'active[eq]': 1,
  };
  btnLoading: any = null;
  descriptifForm: FormGroup;
  attachmentForm: FormGroup;
  photographiesForm: FormGroup;
  linksForm: FormGroup;
  linkArtWorkForm: FormGroup;
  propertyStatusForm: FormGroup;
  depositStatusForm: FormGroup;
  addProperty = false;
  addDeposit = false;
  descriptionTitle = '';
  domains: any[] = [];
  keyword = 'name';
  display: Observable<boolean>;
  config: NgWizardConfig = {
    selected: 0,
    theme: THEME.dots,
    lang: { next: 'Suivant', previous: 'Précédent' },
    toolbarSettings: {
      toolbarExtraButtons: [
        {
          text: 'Quitter',
          class: 'btn btn-info',
          event: () => {
            this.open(this.ngTemplate.nativeElement);
          },
        },
      ],
    },
  };
  closeResult = '';
  isValidTypeBoolean = true;
  isDirty = false;
  value: boolean;
  url: string;
  inProgressNotice: any = [];
  id: string;
  routeSubscription: Subscription;
  isLoading = false;
  loadingData = true;
  strIntoObj: any[] = [];
  createdNoticeId: any = null;
  toCreateNoticeId = 'null';
  submitted = false;
  attachmentData: any[] = [];
  photographyData: any[] = [];
  hyperLinkData: any[] = [];
  existingLink: any;
  constructor(
    public workOfArtService: WorkOfArtService,
    private ngWizardService: NgWizardService,
    private modalService: NgbModal,
    public fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private messageService: MessageService,
    private datePipe: DatePipe,
    private cdr: ChangeDetectorRef,
    private fieldService: FieldsService,
    private denominationsService: DenominationsService,
    private styleService: StylesService,
    private simpleTabsRefService: SimpleTabsRefService
  ) {
    this.routeSubscription = this.route.data.subscribe((res: any) => {
      if (res) {
        this.inProgressNotice = res.addRemarquer;
        console.log(this.inProgressNotice);
        this.inProgressNotice.hyperlinks ? (this.hyperLinkData = this.inProgressNotice.hyperlinks) : null;
        this.inProgressNotice.attachments ? (this.attachmentData = this.inProgressNotice.attachments) : null;
        this.inProgressNotice.photographies ? (this.photographyData = this.inProgressNotice.photographies) : null;
        this.inProgressNotice.parent ? (this.existingLink = this.inProgressNotice.parent) : null;
        if (this.inProgressNotice.status && this.inProgressNotice.status.descriptiveWords) {
          let str: string = this.inProgressNotice.status.descriptiveWords;
          let strIntoOb = str.split(',');
          strIntoOb.forEach((value: any) => {
            this.strIntoObj.push(value);
          });
        }
      }
    });
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    const type = this.route.snapshot.paramMap.get('type');
    if (type === 'propriété') {
      this.addProperty = true;
      this.addDeposit = false;
      this.descriptionTitle = "Création d'une notice en propriété";
    } else {
      this.addDeposit = true;
      this.addProperty = false;
      this.descriptionTitle = "Création d'une notice en dépôt";
    }
  }

  ngOnDestroy(): void {
    // this.inProgressNotice = [];
    // this.initForms();
  }

  ngOnInit(): void {
    this.initForms();
    this.initFilterData();
    this.descriptifForm.valueChanges.subscribe((e) => ((this.isDirty = true), this.cdr.detectChanges()));
  }
  initFilterData() {
    forkJoin([
      this.fieldService.getAllFields(this.data),
      this.denominationsService.getAllDenominations(this.data),
      this.styleService.getAllItems(this.data),
      this.simpleTabsRefService.getAllItems(this.data, 'eras'),
      this.simpleTabsRefService.getAllItems(this.data, 'authors'),
      this.simpleTabsRefService.getAllItems(this.data, 'depositors'),
    ]).subscribe(([fieldsResults, denominationResults, styleResults, eraResults, authorResults, depositorsResults]) => {
      this.domainData = this.simpleTabsRefService.getTabRefFilterData(fieldsResults['results']);
      this.denominationData = denominationResults['results'];
      this.styleData = this.simpleTabsRefService.getTabRefFilterData(styleResults['results']);
      this.authorData = this.simpleTabsRefService.getTabRefFilterData(authorResults['results']);
      this.depositorsData = this.simpleTabsRefService.getTabRefFilterData(depositorsResults['results']);
      this.eraData = this.simpleTabsRefService.getTabRefFilterData(eraResults['results']);
      this.loadingData = false;
    });
  }

  canDeactivate(): boolean | Observable<boolean> {
    this.isDirty && !this.submitted ? this.submit() : null;
    return true;
  }
  initForms() {
    this.inProgressNotice ? this.initPropertyStatusForm(this.inProgressNotice) : this.initPropertyStatusForm();
    this.inProgressNotice ? this.initDepositStatusForm(this.inProgressNotice) : this.initDepositStatusForm();
    this.initAttachmentForm();
    this.initPhotographiesForm();
    this.initHyperLink();
    this.initLinks();
    this.inProgressNotice ? this.initDescriptifForm(this.inProgressNotice) : this.initDescriptifForm();
  }
  initDescriptifForm(data?: any) {
    this.descriptifForm = this.fb.group({
      title: data && data.title ? this.inProgressNotice.title : '',
      field: data && data.field ? this.inProgressNotice.field.id : null,
      denomination: data && data.denomination ? data.denomination.id : null,
      materialTechnique: [data && data.materialTechnique ? this.formatArray(data.materialTechnique) : null],
      numberOfUnit: data && data.numberOfUnit ? data.numberOfUnit : null,
      authors: [data && data.authors ? this.formatArray(data.authors) : null],
      creationDate: [
        data && data.creationDate ? this.datePipe.transform(this.inProgressNotice.creationDate, 'yyyy') : null,
      ],
      length: data && data.length ? data.length : null,
      lengthUnit: ['1'],
      width: data && data.width ? data.width : null,
      widthUnit: ['1'],
      height: [data && data.height ? data.height : null],
      heightUnit: ['1'],
      depth: [data && data.depth ? data.depth : null],
      depthUnit: ['1'],
      weight: [data && data.weight ? data.weight : null],
      weightUnit: ['1'],
      diameter: [data && data.diameter ? data.diameter : null],
      diameterUnit: ['1'],
      era: data && data.era ? data.era.id : null,
      style: data && data.style ? data.style.id : null,
      totalLength: [data && data.totalLength ? data.totalLength : null],
      totlLengthUnit: ['1'],
      totalWidth: [data && data.totalWidth ? data.totalWidth : null],
      totalWidthUnit: [1],
      totalHeight: [data && data.totalHeight ? data.totalHeight : null],
      totalHeightUnit: ['1'],
      descriptiveWords: [data && data.status.descriptiveWords ? this.strIntoObj : null],
      description: [data && data.status ? data.status.description : null],
      registrationSignature: [data && data.status ? data.status.registrationSignature : null],
      otherRegistrations: [data && data.status ? data.status.otherRegistrations : null],
      marking: [data && data.status ? data.status.marking : null],
      photographies: null,
      status: this.addProperty ? this.propertyStatusForm : this.depositStatusForm,
      parent: null,
      hyperlinks: null,
      attachments: null,
    });
  }
  initPropertyStatusForm(data?: any) {
    this.propertyStatusForm = this.fb.group({
      entryMode: [data && data.status.entryMode ? data.status.entryMode.id : null],
      entryDate: [
        data && data.status ? this.datePipe.transform(this.inProgressNotice.status.entryDate, 'yyyy-MM-dd') : null,
      ],
      marking: [''],
      category: [data && data.status.category ? data.status.category.id : null],
      registrationSignature: [''],
      descriptiveWords: [''],
      insuranceValue: [data && data.status ? data.status.insuranceValue : null],
      insuranceValueDate: [
        data && data.status ? this.datePipe.transform(data.status.insuranceValueDate, 'yyyy-MM-dd') : null,
      ],
      otherRegistrations: [''],
      description: [''],
    });
  }
  initDepositStatusForm(data?: any) {
    this.depositStatusForm = this.fb.group({
      depositDate: [data && data.status ? this.datePipe.transform(data.status.depositDate, 'yyyy-MM-dd') : null],
      stopNumber: [data && data.status ? data.status.stopNumber : null],
    });
  }
  initHyperLink() {
    this.linksForm = new FormGroup({
      hyperlinks: this.fb.array([]),
    });
  }
  initLinks() {
    this.linkArtWorkForm = this.fb.group({
      parent: this.inProgressNotice && this.inProgressNotice.parent ? this.inProgressNotice.parent.id : null,
    });
  }
  initAttachmentForm() {
    this.attachmentForm = new FormGroup({
      attachments: this.fb.array([]),
    });
  }
  initPhotographiesForm() {
    this.photographiesForm = new FormGroup({
      photographies: this.fb.array([]),
    });
  }

  addSingle(type: string, sum: string, msg: string) {
    this.messageService.add({ severity: type, summary: sum, detail: msg });
  }
  open(content: any) {
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title', size: 'lg' }).result.then(
      (result) => {
        this.closeResult = `Closed with: ${result}`;
      },
      (reason) => {
        this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      }
    );
  }

  getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

  stepChanged(args: StepChangedArgs) {
    console.log(args.step);
  }

  isValidFunctionReturnsBoolean(args: StepValidationArgs) {
    return true;
  }

  isValidFunctionReturnsObservable(args: StepValidationArgs) {
    return of(true);
  }
  formatArray(array: any) {
    let test: any[] = [];
    if (array.length) {
      array.forEach((value: any) => {
        test.push(value.id);
      });
      return test;
    }
    return null;
  }
  formatData() {
    const keys = ['height', 'width', 'length', 'totalHeight', 'totalWidth', 'totalLength', 'depth', 'diameter'];
    keys.forEach((key: string) => {
      if (this.descriptifForm.get(key).value) {
        this.descriptifForm
          .get(key)
          .setValue(+this.descriptifForm.get(key).value * +this.descriptifForm.get(key.concat('Unit')).value);
      }
    });
  }

  buildFormData(formData: FormData) {
    for (let dataKey in this.descriptifForm.value) {
      if (dataKey == 'photographies' || dataKey == 'attachments' || dataKey == 'hyperlinks') {
        // append nested object
        for (let previewKey in this.descriptifForm.value[dataKey]) {
          for (let key in this.descriptifForm.value[dataKey][previewKey]) {
            console.log([dataKey][previewKey][key], this.descriptifForm.value[dataKey][previewKey]);
            formData.append(`${dataKey}[${previewKey}][${key}]`, this.descriptifForm.value[dataKey][previewKey][key]);
          }
        }
      } else if (dataKey == 'status') {
        for (let previewKey in this.descriptifForm.value[dataKey]) {
          formData.append(`${dataKey}[${previewKey}]`, this.descriptifForm.value[dataKey][previewKey]);
        }
      } else {
        if (['field', 'denomination'].includes(dataKey)) {
          formData.append(dataKey, this.descriptifForm.value[dataKey]);
        } else {
          if (this.descriptifForm.value[dataKey] !== null) {
            formData.append(dataKey, this.descriptifForm.value[dataKey]);
          }
        }
      }
    }
  }

  submit() {
    this.isLoading = true;
    this.descriptifForm.get('photographies').setValue(this.photographiesForm.value.photographies);
    this.descriptifForm.get('hyperlinks').setValue(this.linksForm.value.hyperlinks);
    this.descriptifForm.get('parent').setValue(this.linkArtWorkForm.value.parent);
    this.descriptifForm.get('attachments').setValue(this.attachmentForm.value.attachments);

    this.formatData();

    let formData = new FormData();
    this.inProgressNotice
      ? (this.toCreateNoticeId = this.inProgressNotice.id)
      : (this.toCreateNoticeId = this.createdNoticeId);
    if (!this.toCreateNoticeId) {
      if (this.addProperty) {
        this.propertyStatusForm.get('marking').setValue(this.descriptifForm.get('marking').value);
        this.propertyStatusForm
          .get('registrationSignature')
          .setValue(this.descriptifForm.get('registrationSignature').value);
        this.propertyStatusForm.get('descriptiveWords').setValue(this.descriptifForm.get('descriptiveWords').value);
        this.propertyStatusForm.get('description').setValue(this.descriptifForm.get('description').value);
        this.buildFormData(formData);
        this.workOfArtService.addWorkOfArt(formData).subscribe(
          (result) => {
            this.addSingle('success', 'Ajout', result.msg);
            this.isLoading = false;
            this.submitted = true;
            this.createdNoticeId = result.res.id;
          },
          (err) => {
            this.addSingle('error', 'Ajout', "Une erreur est survenue lors de l'ajout");
          }
        );
      } else {
        this.buildFormData(formData);
        this.workOfArtService.addDepositWorkOfArt(formData).subscribe(
          (result) => {
            this.isLoading = false;
            this.submitted = true;
            this.createdNoticeId = result.res.id;
            this.addSingle('success', 'Ajout', 'La notice a été ajoutée avec succès');
          },
          (err) => {
            this.addSingle('error', 'Ajout', "Une erreur est survenue lors de l'ajout");
          }
        );
      }
    } else {
      this.buildFormData(formData);
      this.workOfArtService.updateInProgressArtWork(formData, this.toCreateNoticeId).subscribe(
        (result) => {
          this.addSingle('success', 'Ajout', result.msg);
          this.isLoading = false;
          this.submitted = true;
          this.createdNoticeId = result.res.id;
        },
        (err) => {
          this.addSingle('error', 'Ajout', "Une erreur est survenue lors de l'ajout");
        }
      );
    }
  }
}
