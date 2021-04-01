import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-add-img-modal',
  templateUrl: './add-img-modal.component.html',
  styleUrls: ['./add-img-modal.component.scss'],
})
export class AddImgModalComponent implements OnInit {
  photographyForm: FormGroup;
  types = ['Numérique', 'type 2', 'type 3'];
  observations = ['Non vu', 'Vu'];
  observationExplications = ['Retrouvé', 'Disparu', "A fait l'objet d'un dédommagement"];
  conservationsStatus = ['Bon', 'Voir commentaire'];
  constructor(private fb: FormBuilder, public ngbActiveModal: NgbActiveModal) {}
  ngOnInit(): void {
    this.initForm();
  }

  initForm() {
    this.photographyForm = this.fb.group({
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
