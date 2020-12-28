import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-edit-action-modal',
  templateUrl: './edit-action-modal.component.html',
  styleUrls: ['./edit-action-modal.component.scss'],
})
export class EditActionModalComponent implements OnInit {
  actionForm: FormGroup;
  actionTypes = ['Dépôt de plainte', 'Enregistrement MGPAM', 'Inventaire', 'Mise en reserve', 'Récolement', 'Rendu'];
  observations = ['Non vu', 'Vu'];
  observationExplications = ['Retrouvé', 'Disparu', "A fait l'objet d'un dédommagement"];
  conservationsStatus = ['Bon', 'Voir commentaire'];

  date: Date;
  observation: string;
  observationExplication: string;
  conservationStatus: string;
  conservationComment: string;
  actionType: string;

  constructor(private fb: FormBuilder, public ngbActiveModal: NgbActiveModal) {}

  ngOnInit(): void {
    this.initForm();
  }

  initForm() {
    this.actionForm = this.fb.group({
      date: [this.date, [Validators.required]],
      observation: [this.observation, [Validators.required]],
      observationExplication: [this.observationExplication, [Validators.required]],
      conservationStatus: [this.conservationsStatus, [Validators.required]],
      conservationComment: [this.conservationComment, [Validators.required]],
      actionType: [this.actionType, [Validators.required]],
    });
  }

  onSubmit() {}
}
