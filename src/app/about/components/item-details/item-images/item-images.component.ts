import { Component, Input, OnInit } from '@angular/core';
import { NgbModal, NgbModalOptions, NgbSlideEvent } from '@ng-bootstrap/ng-bootstrap';
import { AddImgModalComponent } from '@app/about/components/item-details/item-images/add-img-modal/add-img-modal.component';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-item-images',
  templateUrl: './item-images.component.html',
  styleUrls: ['./item-images.component.scss'],
})
export class ItemImagesComponent implements OnInit {
  @Input() add = false;
  slide = 1;
  editType = false;
  photographyForm: FormGroup;
  types = ['Identification', 'Autre vue', 'Détail', 'Etat', 'Ancien cliché'];

  constructor(private modalService: NgbModal, public fb: FormBuilder) {}
  ngOnInit(): void {
    this.initForm();
    console.log(this.add);
  }
  initForm() {
    this.photographyForm = this.fb.group({
      photographyDate: ['', [Validators.required]],
      photography: ['', [Validators.required]],
      photographyType: ['', [Validators.required]],
    });
  }
  addImg() {
    const ngbModalOptions: NgbModalOptions = {
      backdropClass: 'modal-container',
      centered: true,
    };
    this.modalService.open(AddImgModalComponent, ngbModalOptions);
  }
  onChange(event: NgbSlideEvent) {
    switch (event.current) {
      case 'slide1':
        this.slide = 1;
        break;
      case 'slide2':
        this.slide = 2;
        break;
      case 'slide3':
        this.slide = 3;
        break;
      case 'slide4':
        this.slide = 4;
        break;
    }
  }
  editPhotoType() {}
}
