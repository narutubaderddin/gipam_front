import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { NgbModal, NgbModalOptions, NgbSlideEvent } from '@ng-bootstrap/ng-bootstrap';
import { AddImgModalComponent } from '@shared/components/notice-blocs/item-images/add-img-modal/add-img-modal.component';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SimpleTabsRefService } from '@shared/services/simple-tabs-ref.service';

@Component({
  selector: 'app-item-images',
  templateUrl: './item-images.component.html',
  styleUrls: ['./item-images.component.scss'],
})
export class ItemImagesComponent implements OnInit {
  @ViewChild('file') file: any;
  @Input() add = false;
  @Input() photographiesForm: FormGroup;

  slide = 1;
  editType = false;
  photography: string = '';
  photographyDate: Date = new Date();
  photographyType: any[] = [];
  types: any[] = [
    { name: 'Identification' },
    { name: 'Autre vue' },
    { name: 'Détail' },
    { name: 'Etat' },
    { name: 'Ancien cliché' },
  ];
  fileToUpload: any;
  imageName: any = '';
  images: any = [];
  photographyInsertionNumber = 0;
  selectedPhotography = 0;
  validate = true;
  isIdentification = false;
  identification = 0;
  imagePreview: any;
  get photographies(): FormArray {
    return this.photographiesForm.get('photographies') as FormArray;
  }
  constructor(private modalService: NgbModal, public fb: FormBuilder, private simpleTabsRef: SimpleTabsRefService) {}
  ngOnInit(): void {
    this.getAllTypes();
  }

  initData(photography?: string, photographyDate?: Date, photographyType?: any, imageName?: string) {
    this.photography = photography;
    this.photographyDate = photographyDate;
    this.photographyType = photographyType;
    this.imageName = imageName;
  }

  getAllTypes() {
    this.simpleTabsRef.tabRef = 'photographyTypes';
    const params = {
      limit: 40,
      page: 1,
    };
    this.simpleTabsRef.getAllItems(params).subscribe(
      (result: any) => {
        console.log(result);
        this.types = result.results;
      },
      (error: any) => {}
    );
  }
  createPhotography(
    photography?: string,
    photographyDate?: Date,
    photographyType?: any,
    imageName?: string
  ): FormGroup {
    return this.fb.group({
      date: [photographyDate],
      imagePreview: [photography],
      photographyType: [photographyType.id],
      // photographyName: [imageName],
    });
  }
  editPhotographyForm(i: number, photography: string, photographyType: any, photographyDate: Date, imageName: string) {
    this.photographies.value[i].photographyType = photographyType;
    this.photographies.value[i].date = photographyDate;
    // this.photographies.value[i].photographyName = imageName;
    this.photographies.value[i].imagePreview = photography;
    this.images[i].imageUrl = photography;
    this.images[i].image = imageName;
  }
  verifyIdentification() {
    this.identification = 0;
    // if (this.photographies.value.length > 1) {
    //   this.photographies.value.forEach((photography: any) => {
    //     if (photography.photographyType.name != 'Identification') {
    //       this.identification++;
    //     }
    //   });
    //   if (this.identification < this.photographies.value.length) {
    //     this.isIdentification = true;
    //     this.types[0].disabled = true;
    //   } else {
    //     this.isIdentification = false;
    //     this.types[0].disabled = false;
    //   }
    //   console.log(this.isIdentification);
    // }
  }
  addPhotography(): void {
    if (!this.photography.length || !this.photographyType || !this.imageName.length) {
      this.validate = false;
    } else {
      if (this.selectedPhotography == this.photographies.value.length) {
        this.images.push({
          i: this.photographyInsertionNumber,
          imageUrl: this.photography,
          alt: 'description',
          image: this.imageName,
        });
        this.photographies.push(
          this.createPhotography(this.imagePreview, this.photographyDate, this.photographyType, this.imageName)
        );
        console.log('validation', this.photographies);
      } else {
        this.editPhotographyForm(
          this.selectedPhotography,
          this.photography,
          this.photographyType,
          this.photographyDate,
          this.imageName
        );
      }
      this.verifyIdentification();
      this.initData('', new Date());
      this.photographyInsertionNumber++;
      this.selectedPhotography = this.photographies.value.length;
      this.validate = true;
    }
  }

  handleFileInput(file: FileList) {
    this.fileToUpload = file.item(0);

    const formData: FormData = new FormData();
    formData.append('fileKey', file.item(0), file.item(0).name);
    this.imagePreview = formData;

    let reader = new FileReader();
    reader.onload = (event: any) => {
      this.photography = event.target.result;
    };
    reader.readAsDataURL(this.fileToUpload);
    reader.onloadend = (_event: any) => {
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
    let data = this.photographies.value[item.i];
    this.initData(data.photography, data.photographyDate, data.photographyType, item.image);
    this.selectedPhotography = item.i;
  }
}
