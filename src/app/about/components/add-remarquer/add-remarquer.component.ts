import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { WorkOfArtService } from '@shared/services/work-of-art.service';
import { NgWizardConfig, NgWizardService, StepChangedArgs, StepValidationArgs, STEP_STATE, THEME } from 'ng-wizard';
import { of } from 'rxjs';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Route, Router } from '@angular/router';

@Component({
  selector: 'app-add-remarquer',
  templateUrl: './add-remarquer.component.html',
  styleUrls: ['./add-remarquer.component.scss'],
})
export class AddRemarquerComponent implements OnInit {
  @ViewChild('content') ngTemplate: ElementRef;

  descriptifForm: FormGroup;
  attachmentForm: FormGroup;
  photographiesForm: FormGroup;
  propertyStatusForm: FormGroup;
  depositStatusForm: FormGroup;
  addProperty = false;
  addDeposit = false;
  domains = this.WorkOfArtService.domaine;
  keyword = 'name';
  stepStates = {
    normal: STEP_STATE.normal,
    disabled: STEP_STATE.disabled,
    error: STEP_STATE.error,
    hidden: STEP_STATE.hidden,
  };
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

  constructor(
    public WorkOfArtService: WorkOfArtService,
    private ngWizardService: NgWizardService,
    private modalService: NgbModal,
    public fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    const type = this.route.snapshot.paramMap.get('type');
    if (type === 'propriété') {
      this.addProperty = true;
      this.addDeposit = false;
    } else {
      this.addDeposit = true;
      this.addProperty = false;
    }
  }

  ngOnInit(): void {
    this.initDescriptifForm();
    this.initPropertyStatusForm();
    this.initDepositStatusForm();
    this.initAttachmentForm();
    this.initPhotographiesForm();
  }
  initDescriptifForm() {
    this.descriptifForm = this.fb.group({
      title: ['', Validators.required],
      domain: ['', Validators.required],
      denomination: ['', Validators.required],
      material: ['', Validators.required],
      unit_number: ['', Validators.required],
      items: [],
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
  openVerticallyCentered(content: any) {
    this.modalService.open(content, { centered: true });
  }
  closeResult = '';

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

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }
  selectEvent(item: any) {}

  onChangeSearch(val: string) {
    // fetch remote data from here
    // And reassign the 'data' which is binded to 'data' property.
  }

  onFocused(e: any) {
    // do something when input is focused
  }

  showPreviousStep(event?: Event) {
    this.ngWizardService.previous();
  }

  showNextStep(event?: Event) {
    this.ngWizardService.next();
  }

  resetWizard(event?: Event) {
    this.ngWizardService.reset();
  }

  setTheme(theme: THEME) {
    this.ngWizardService.theme(theme);
  }

  stepChanged(args: StepChangedArgs) {
    console.log(args.step);
  }

  isValidTypeBoolean: boolean = true;

  isValidFunctionReturnsBoolean(args: StepValidationArgs) {
    return true;
  }

  isValidFunctionReturnsObservable(args: StepValidationArgs) {
    return of(true);
  }
  submit() {
    if (!this.descriptifForm.valid) {
      console.log(this.descriptifForm);
      this.display = true;
    }
  }
}
