import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { WorkOfArtService } from '@shared/services/work-of-art.service';
import { NgWizardConfig, NgWizardService, StepChangedArgs, StepValidationArgs, STEP_STATE, THEME } from 'ng-wizard';
import { of } from 'rxjs';
import { BsModalService } from 'ngx-bootstrap/modal';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-add-property-remarquer',
  templateUrl: './add-property-remarquer.component.html',
  styleUrls: ['./add-property-remarquer.component.scss'],
})
export class AddPropertyRemarquerComponent implements OnInit {
  @ViewChild('content') ngTemplate: ElementRef;

  createDepot: false;
  createProperty: true;
  descriptifForm: FormGroup;
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
    public fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.initDescriptifForm();
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
