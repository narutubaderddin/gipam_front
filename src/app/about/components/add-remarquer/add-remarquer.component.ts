import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { WorkOfArtService } from '@shared/services/work-of-art.service';
import { NgWizardConfig, NgWizardService, StepChangedArgs, StepValidationArgs, THEME } from 'ng-wizard';
import { Observable, of, Subscription } from 'rxjs';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-add-remarquer',
  templateUrl: './add-remarquer.component.html',
  styleUrls: ['./add-remarquer.component.scss'],
})
export class AddRemarquerComponent implements OnInit {
  @ViewChild('content') ngTemplate: ElementRef;
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
            console.log(this.ngTemplate.nativeElement);
            // alert('veuillez enregistrer');
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
  inProgressNotice: any;
  id: string;
  routeSubscription: Subscription;
  isLoading = false;
  loadingData = false;
  strIntoObj: any[] = [];
  constructor(
    public workOfArtService: WorkOfArtService,
    private ngWizardService: NgWizardService,
    private modalService: NgbModal,
    public fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private messageService: MessageService
  ) {
    this.routeSubscription = this.route.data.subscribe((res: any) => {
      if (res) {
        this.inProgressNotice = res.addRemarquer;
        if (this.inProgressNotice.status && this.inProgressNotice.status.descriptiveWords) {
          let str: string = this.inProgressNotice.status.descriptiveWords;
          let strIntoOb = str.split(',');
          strIntoOb.forEach((value: any) => {
            this.strIntoObj.push({ display: value, value: value });
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

  ngOnInit(): void {
    this.initForms();
    this.descriptifForm.valueChanges.subscribe((e) => (this.isDirty = true));
  }

  canDeactivate(): boolean | Observable<boolean> {
    // this.submit();
    return true;
  }
  initForms() {
    this.initPropertyStatusForm();
    this.initDepositStatusForm();
    this.initAttachmentForm();
    this.initPhotographiesForm();
    this.initHyperLink();
    this.initLinks();
    this.initDescriptifForm();
  }
  initDescriptifForm() {
    this.descriptifForm = this.fb.group({
      title: this.inProgressNotice && this.inProgressNotice.title ? this.inProgressNotice.title : '',
      field: this.inProgressNotice && this.inProgressNotice.field ? this.inProgressNotice.field.id : null,
      denomination:
        this.inProgressNotice && this.inProgressNotice.denomination ? this.inProgressNotice.denomination.id : null,
      materialTechnique: [
        this.inProgressNotice && this.inProgressNotice.materialTechnique
          ? this.inProgressNotice.materialTechnique
          : null,
      ],
      numberOfUnit:
        this.inProgressNotice && this.inProgressNotice.numberOfUnit ? this.inProgressNotice.numberOfUnit : null,
      authors: [this.inProgressNotice && this.inProgressNotice.authors ? this.inProgressNotice.authors : null],
      creationDate: [
        this.inProgressNotice && this.inProgressNotice.creationDate ? this.inProgressNotice.creationDate : null,
      ],
      length: this.inProgressNotice && this.inProgressNotice.length ? this.inProgressNotice.length : null,
      lengthUnit: ['1'],
      width: this.inProgressNotice && this.inProgressNotice.width ? this.inProgressNotice.width : null,
      widthUnit: ['1'],
      height: [this.inProgressNotice && this.inProgressNotice.height ? this.inProgressNotice.height : null],
      heightUnit: ['1'],
      depth: [this.inProgressNotice && this.inProgressNotice.depth ? this.inProgressNotice.depth : null],
      depthUnit: ['1'],
      weight: [this.inProgressNotice && this.inProgressNotice.weight ? this.inProgressNotice.weight : null],
      weightUnit: ['1'],
      diameter: [this.inProgressNotice && this.inProgressNotice.diameter ? this.inProgressNotice.diameter : null],
      diameterUnit: ['1'],
      era: this.inProgressNotice && this.inProgressNotice.era ? this.inProgressNotice.era.id : null,
      style: this.inProgressNotice && this.inProgressNotice.style ? this.inProgressNotice.style.id : null,
      totalLength: [
        this.inProgressNotice && this.inProgressNotice.totalLength ? this.inProgressNotice.totalLength : null,
      ],
      totlLengthUnit: ['1'],
      totalWidth: [this.inProgressNotice && this.inProgressNotice.totalWidth ? this.inProgressNotice.totalWidth : null],
      totalWidthUnit: [1],
      totalHeight: [
        this.inProgressNotice && this.inProgressNotice.totalHeight ? this.inProgressNotice.totalHeight : null,
      ],
      totalHeightUnit: ['1'],
      descriptiveWords: [
        this.inProgressNotice && this.inProgressNotice.status.descriptiveWords ? this.strIntoObj : null,
      ],
      description: [
        this.inProgressNotice && this.inProgressNotice.status ? this.inProgressNotice.status.description : null,
      ],
      registrationSignature: [
        this.inProgressNotice && this.inProgressNotice.status
          ? this.inProgressNotice.status.registrationSignature
          : null,
      ],
      otherRegistrations: [
        this.inProgressNotice && this.inProgressNotice.status ? this.inProgressNotice.status.otherRegistrations : null,
      ],
      marking: [this.inProgressNotice && this.inProgressNotice.status ? this.inProgressNotice.status.marking : null],
      photographies: null,
      status: this.addProperty ? this.propertyStatusForm : this.depositStatusForm,
      parent: null,
      hyperlinks: null,
      attachments: null,
    });
  }
  initPropertyStatusForm() {
    this.propertyStatusForm = this.fb.group({
      entryMode: [
        this.inProgressNotice && this.inProgressNotice.status.entryMode
          ? this.inProgressNotice.status.entryMode.id
          : null,
      ],
      entryDate: [
        this.inProgressNotice && this.inProgressNotice.status ? this.inProgressNotice.status.entryDate : null,
      ],
      marking: [''],
      category: [
        this.inProgressNotice && this.inProgressNotice.status.category
          ? this.inProgressNotice.status.category.id
          : null,
      ],
      registrationSignature: [''],
      descriptiveWords: [''],
      insuranceValue: [
        this.inProgressNotice && this.inProgressNotice.status ? this.inProgressNotice.status.insuranceValue : null,
      ],
      insuranceValueDate: [
        this.inProgressNotice && this.inProgressNotice.status ? this.inProgressNotice.status.insuranceValueDate : null,
      ],
      otherRegistrations: [''],
      description: [''],
    });
  }
  initDepositStatusForm() {
    this.depositStatusForm = this.fb.group({
      depositDate: [
        this.inProgressNotice && this.inProgressNotice.status ? this.inProgressNotice.status.depositDate : null,
      ],
      stopNumber: [
        this.inProgressNotice && this.inProgressNotice.status ? this.inProgressNotice.status.stopNumber : null,
      ],
    });
  }
  initHyperLink() {
    this.linksForm = new FormGroup({
      hyperlinks: this.fb.array([]),
    });
  }
  initLinks() {
    this.linkArtWorkForm = this.fb.group({
      parent: [],
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
            formData.append(`${dataKey}[${previewKey}][${key}]`, this.descriptifForm.value[dataKey][previewKey][key]);
          }
        }
      } else if (dataKey == 'status') {
        console.log(this.descriptifForm.value[dataKey]);
        for (let previewKey in this.descriptifForm.value[dataKey]) {
          console.log(`${dataKey}[${previewKey}]`, this.descriptifForm.value[dataKey][previewKey]);
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
          this.initForms();
          this.isLoading = false;
        },
        (err) => {
          this.addSingle('error', 'Ajout', "Une erreur est survenue lors de l'ajout");
        }
      );
    } else {
      this.buildFormData(formData);
      this.workOfArtService.addDepositWorkOfArt(formData).subscribe(
        (res) => {
          this.addSingle('success', 'Ajout', 'La notice a été ajoutée avec succès');
          this.initForms();
        },
        (err) => {
          this.addSingle('error', 'Ajout', "Une erreur est survenue lors de l'ajout");
        }
      );
    }
  }
}
