import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { NgbModal, NgbModalOptions, NgbSlideEvent } from '@ng-bootstrap/ng-bootstrap';
import { AddImgModalComponent } from '@app/about/components/item-details/item-images/add-img-modal/add-img-modal.component';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-item-images',
  templateUrl: './item-images.component.html',
  styleUrls: ['./item-images.component.scss'],
})
export class ItemImagesComponent implements OnInit {
  @ViewChild('file') file: any;
  @Input() add = false;
  slide = 1;
  editType = false;
  photographiesForm: FormGroup;
  photography: string;
  photographyDate: Date = new Date();
  photographyType: any;
  types = [
    { name: 'Identification' },
    { name: 'Autre vue' },
    { name: 'Détail' },
    { name: 'Etat' },
    { name: 'Ancien cliché' },
  ];
  fileToUpload: any;
  imageName: any;
  images: any = [];
  photographyInsertionNumber = 0;
  selectedPhotography = 1;
  get photographies(): FormArray {
    return this.photographiesForm.get('photographies') as FormArray;
  }
  constructor(private modalService: NgbModal, public fb: FormBuilder) {}
  ngOnInit(): void {
    this.initForm();
  }
  initForm() {
    this.photographiesForm = new FormGroup({
      photographies: this.fb.array([this.createPhotography()]),
    });
  }
  initData(photography?: string, photographyDate?: Date, photographyType?: any, imageName?: string) {
    this.photography = photography;
    this.photographyDate = photographyDate;
    this.photographyType = photographyType;
    this.imageName = imageName;
  }
  createPhotography(
    photography?: string,
    photographyDate?: Date,
    photographyType?: any,
    imageName?: string
  ): FormGroup {
    return this.fb.group({
      photographyDate: [photographyDate, [Validators.required]],
      photography: [photography, [Validators.required]],
      photographyType: [photographyType, [Validators.required]],
      photographyName: [imageName, [Validators.required]],
    });
  }

  addPhotography(): void {
    console.log(this.photographies.value.length);
    if (this.selectedPhotography == this.photographies.value.length) {
      this.images.push({
        i: this.photographyInsertionNumber,
        imageUrl: this.photography,
        alt: 'description',
        image: this.imageName,
      });
      this.photographies.push(
        this.createPhotography(this.photography, this.photographyDate, this.photographyType, this.imageName)
      );
    } else {
      this.photographies.value[this.selectedPhotography + 1].photographyType = this.photographyType;
      this.photographies.value[this.selectedPhotography + 1].photographyDate = this.photographyDate;
      this.photographies.value[this.selectedPhotography + 1].photographyName = this.imageName;
      this.photographies.value[this.selectedPhotography + 1].photography = this.photography;
      this.images[this.selectedPhotography].imageUrl = this.photography;
      this.images[this.selectedPhotography].image = this.imageName;
    }
    this.initData('', new Date());
    this.photographyInsertionNumber++;
    this.selectedPhotography = this.photographies.value.length;
    console.log(this.photographies.value);
  }

  handleFileInput(file: FileList) {
    this.fileToUpload = file.item(0);

    //Show image preview
    let reader = new FileReader();
    reader.onload = (event: any) => {
      this.photography = event.target.result;
    };
    reader.readAsDataURL(this.fileToUpload);
    reader.onloadend = (_event: any) => {
      console.log(this.fileToUpload.name);
      this.imageName = this.fileToUpload.name;
    };
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
  addFile() {
    this.file.nativeElement.click();
  }
  show(item: any) {
    console.log(item);
    let data = this.photographies.value[item.i + 1];
    console.log(data);
    this.initData(data.photography, data.photographyDate, data.photographyType, item.image);
    this.selectedPhotography = item.i;
  }
}
