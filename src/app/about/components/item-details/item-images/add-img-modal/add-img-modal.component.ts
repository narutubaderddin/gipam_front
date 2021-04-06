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

  constructor(private fb: FormBuilder, public ngbActiveModal: NgbActiveModal) {}
  ngOnInit(): void {
    this.initForm();
  }

  initForm() {
    this.photographyForm = this.fb.group({
      date: ['', [Validators.required]],
      photography: ['', [Validators.required]],
      photographyType: ['', [Validators.required]],
    });
  }

  onSubmit() {}
}
