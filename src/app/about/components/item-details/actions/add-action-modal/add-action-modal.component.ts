import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-add-action-modal',
  templateUrl: './add-action-modal.component.html',
  styleUrls: ['./add-action-modal.component.scss'],
})
export class AddActionModalComponent implements OnInit {
  actionForm: FormGroup;
  actionTypes = ['action1', 'action2'];

  constructor(private fb: FormBuilder, public ngbActiveModal: NgbActiveModal) {}

  ngOnInit(): void {
    this.initForm();
  }

  initForm() {
    this.actionForm = this.fb.group({
      date: ['', [Validators.required]],
      observation: ['', [Validators.required]],
      observationExplication: ['', [Validators.required]],
      conservationStatus: ['', [Validators.required]],
      conservationComment: ['', [Validators.required]],
      actionType: ['', [Validators.required]],
    });
  }

  onSubmit() {}
}
