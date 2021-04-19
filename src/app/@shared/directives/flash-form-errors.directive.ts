import { Directive, EventEmitter, HostListener, Input, OnInit, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { NotificationsService } from 'angular2-notifications';
import { markAsDirtyDeep } from '@shared/utils/helpers';
const INVALID_FILEDS_MSG = 'Veuillez vérifier tous les champs encadrés en rouge';

@Directive({
  selector: '[appFlashFormErrors]',
})
export class FlashFormErrorsDirective {
  @Input('appFlashFormErrors') formGroup: FormGroup;
  @Input('customErrorMessage') customErrorMessage: any;
  @Output('appFormSubmit') submitTrigger = new EventEmitter();

  constructor(private notificationService: NotificationsService) {}

  ngOnInit(): void {}

  @HostListener('click', ['$event']) onClick() {
    if (this.formGroup.invalid) {
      markAsDirtyDeep(this.formGroup);
      let errorMessage = INVALID_FILEDS_MSG;
      if (this.customErrorMessage) {
        errorMessage = this.customErrorMessage;
      }
      this.notificationService.error('Erreur Formulaire', errorMessage, true);
    } else {
      this.submitTrigger.emit(this.formGroup);
    }
  }
}
