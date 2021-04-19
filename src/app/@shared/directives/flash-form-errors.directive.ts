import { Directive, EventEmitter, HostListener, Input, OnInit, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { NotificationsService } from 'angular2-notifications';
import { markAsDirtyDeep } from '@shared/utils/helpers';
const INVALID_FILEDS_MSG = 'Veuillez vérifier tous les champs encadrés en rouge';

@Directive({
  selector: '[appFlashFormErrors]',
})
export class FlashFormErrorsDirective {
  @Input() formGroup: FormGroup;
  @Input() customError: string;
  @Output() appFormSubmit = new EventEmitter();
  private errorTitle = 'Erreur';
  private errorMessage = INVALID_FILEDS_MSG;

  constructor(private notificationService: NotificationsService) {}

  ngOnInit(): void {}

  @HostListener('submit', ['$event']) onClick() {
    if (this.formGroup.invalid) {
      markAsDirtyDeep(this.formGroup);
      this.notificationService.error(this.errorTitle, this.errorMessage);
    } else {
      this.appFormSubmit.emit(this.formGroup);
    }
  }
}
