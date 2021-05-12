import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { WorkOfArtService } from '@shared/services/work-of-art.service';
import { NgWizardConfig, NgWizardService, StepChangedArgs, StepValidationArgs, THEME } from 'ng-wizard';
import { of } from 'rxjs';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
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

  display = false;
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
  isValidTypeBoolean: boolean = true;
  constructor(
    public workOfArtService: WorkOfArtService,
    private ngWizardService: NgWizardService,
    private modalService: NgbModal,
    public fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private messageService: MessageService
  ) {
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
      title: ['', Validators.required],
      field: ['', Validators.required],
      denomination: ['', Validators.required],
      materialTechnique: ['', Validators.required],
      numberOfUnit: [''],
      authors: [],
      creationDate: [],
      length: [],
      lengthUnit: ['1'],
      width: [],
      widthUnit: ['1'],
      height: [],
      heightUnit: ['1'],
      depth: [],
      depthUnit: [],
      weight: [],
      weightUnit: ['1'],
      diameter: [],
      diameterUnit: ['1'],
      era: [],
      style: [],
      totalLength: [],
      totlLengthUnit: ['1'],
      totalWidth: [],
      totalWidthUnit: [1],
      totalHeight: [],
      totalHeightUnit: ['1'],
      descriptiveWords: [],
      description: [],
      registrationSignature: [],
      otherRegistrations: [],
      marking: [],
      photographies: [],
      status: this.addProperty ? this.propertyStatusForm : this.depositStatusForm,
      parent: [],
      hyperlinks: [],
      attachments: this.attachmentForm.value.attachments,
    });
  }
  initPropertyStatusForm() {
    this.propertyStatusForm = this.fb.group({
      entryMode: [''],
      entryDate: [''],
      marking: [''],
      category: [''],
      registrationSignature: [''],
      descriptiveWords: [''],
      insuranceValue: [''],
      insuranceValueDate: [''],
      otherRegistrations: [''],
      description: [''],
    });
  }
  initDepositStatusForm() {
    this.depositStatusForm = this.fb.group({
      depositDate: [''],
      stopNumber: [''],
    });
  }
  initHyperLink() {
    this.linksForm = new FormGroup({
      hyperlinks: this.fb.array([]),
    });
  }
  initLinks() {
    this.linkArtWorkForm = this.fb.group({
      parent: [1],
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
    this.descriptifForm.get('height').value
      ? this.descriptifForm
          .get('height')
          .setValue(+this.descriptifForm.get('height').value * +this.descriptifForm.get('heightUnit').value)
      : '';
    this.descriptifForm.get('length').value
      ? this.descriptifForm
          .get('length')
          .setValue(+this.descriptifForm.get('length').value * +this.descriptifForm.get('lengthUnit').value)
      : '';
    this.descriptifForm.get('width').value
      ? this.descriptifForm
          .get('width')
          .setValue(+this.descriptifForm.get('width').value * +this.descriptifForm.get('widthUnit').value)
      : '';
    this.descriptifForm.get('depth').value
      ? this.descriptifForm
          .get('depth')
          .setValue(+this.descriptifForm.get('depth').value * +this.descriptifForm.get('depthUnit').value)
      : '';
    this.descriptifForm.get('diameter').value
      ? this.descriptifForm
          .get('diameter')
          .setValue(+this.descriptifForm.get('diameter').value * +this.descriptifForm.get('diameterUnit').value)
      : '';
    this.descriptifForm.get('totalHeight').value
      ? this.descriptifForm
          .get('totalHeight')
          .setValue(+this.descriptifForm.get('totalHeight').value * +this.descriptifForm.get('totalHeight').value)
      : '';
    this.descriptifForm.get('totalLength').value
      ? this.descriptifForm
          .get('totalLength')
          .setValue(+this.descriptifForm.get('totalLength').value * +this.descriptifForm.get('totalLength').value)
      : '';
    this.descriptifForm.get('totalWidth').value
      ? this.descriptifForm
          .get('totalWidth')
          .setValue(+this.descriptifForm.get('totalWidth').value * +this.descriptifForm.get('totalWidth').value)
      : '';
  }
  submit() {
    if (!this.descriptifForm.valid) {
      this.display = true;
    } else {
      this.descriptifForm.get('photographies').setValue(this.photographiesForm.value.photographies);
      this.descriptifForm.get('hyperlinks').setValue(this.linksForm.value.hyperlinks);
      this.descriptifForm.get('parent').setValue(this.linkArtWorkForm.value.parent);
      this.propertyStatusForm.get('marking').setValue(this.descriptifForm.get('marking').value);
      this.propertyStatusForm
        .get('registrationSignature')
        .setValue(this.descriptifForm.get('registrationSignature').value);
      this.propertyStatusForm.get('descriptiveWords').setValue(this.descriptifForm.get('descriptiveWords').value);
      this.propertyStatusForm.get('description').setValue(this.descriptifForm.get('description').value);
      this.display = false;
      this.descriptifForm.get('materialTechnique').setValue(this.descriptifForm.get('materialTechnique').value[0]);
      this.formatData();
      this.workOfArtService.addWorkOfArt(this.descriptifForm.value).subscribe(
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
