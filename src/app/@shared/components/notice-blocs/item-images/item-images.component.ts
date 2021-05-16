import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { NgbModal, NgbModalOptions, NgbSlideEvent } from '@ng-bootstrap/ng-bootstrap';
import { AddImgModalComponent } from '@shared/components/notice-blocs/item-images/add-img-modal/add-img-modal.component';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SimpleTabsRefService } from '@shared/services/simple-tabs-ref.service';
import { viewDateFormat } from '@shared/utils/helpers';
@Component({
  selector: 'app-item-images',
  templateUrl: './item-images.component.html',
  styleUrls: ['./item-images.component.scss'],
})
export class ItemImagesComponent implements OnInit, OnChanges {
  @ViewChild('file') file: any;
  @Input() add = false;
  @Input() edit = false;
  @Input() images: any[] = [];
  @Input() photographiesForm: FormGroup;
  @Output() imgToShow = new EventEmitter();
  addImage = false;
  activeIndex = 0;
  editType = false;
  photography: string = '';
  photographyDate: Date = new Date();
  photographyType: any[] = [];
  previousPhotographyType: any[] = [];
  types: any[] = [
    { name: 'Identification' },
    { name: 'Autre vue' },
    { name: 'Détail' },
    { name: 'Etat' },
    { name: 'Ancien cliché' },
  ];
  fileToUpload: any;
  imageName: any = '';
  // images: any = [];
  photographyInsertionNumber = 0;
  selectedPhotography = 0;
  validate = true;
  isIdentification = false;
  identification = 0;
  imagePreview: any;
  deleteDialog: boolean = false;
  itemToDelete: any;
  viewDateFormat = viewDateFormat;

  get photographies(): FormArray {
    return this.photographiesForm.get('photographies') as FormArray;
  }
  constructor(private modalService: NgbModal, public fb: FormBuilder, private simpleTabsRef: SimpleTabsRefService) {}
  ngOnInit(): void {
    this.getAllTypes();
    this.initForm();
    this.images.map((el: any) =>
      this.photographies.push(
        this.createPhotography(el.photography, el.photographyDate, el.photographyType, el.imageName)
      )
    );
    if (this.images[this.activeIndex]) {
      this.initData(
        this.images[this.activeIndex].photography,
        this.images[this.activeIndex].photographyDate,
        this.images[this.activeIndex].photographyType,
        this.images[this.activeIndex].image
      );
    }
  }
  ngOnChanges(changements: SimpleChanges) {}

  initForm() {
    this.photographiesForm = new FormGroup({
      photographies: this.fb.array([]),
    });
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
    photography?: FormData,
    photographyDate?: Date,
    photographyType?: any,
    imageName?: string
  ): FormGroup {
    return this.fb.group({
      date: [photographyDate],
      imagePreview: [photography],
      photographyType: [photographyType.id],
      // imageName: [imageName],
    });
  }
  editPhotographyForm(i: number, photography: string, photographyType: any, photographyDate: Date, imageName: string) {
    this.photographies.value[i].photographyType = photographyType;
    this.photographies.value[i].date = photographyDate;
    // this.photographies.value[i].imageName = imageName;
    this.photographies.value[i].imagePreview = photography;
    this.images[i].imageUrl = photography;
    this.images[i].image = imageName;
  }
  verifyIdentification() {
    this.identification = 0;
    if (this.photographies.value.length > 1) {
      this.photographies.value.forEach((photography: any) => {
        if (photography.photographyType.name != 'Identification') {
          this.identification++;
        }
      });
      if (this.identification < this.photographies.value.length) {
        this.isIdentification = true;
        this.types[0].disabled = true;
      } else {
        this.isIdentification = false;
        this.types[0].disabled = false;
      }
    }
  }
  addPhotography(): void {
    if (!this.photography.length || !this.photographyType || !this.imageName.length) {
      this.validate = false;
    } else {
      if (this.selectedPhotography == this.photographies.value.length || this.addImage) {
        this.images.push({
          i: this.photographyInsertionNumber,
          imageUrl: this.photography,
          alt: 'description',
          image: this.imageName,
        });
        console.log(typeof this.buildFormData(this.fileToUpload));
        this.photographies.push(
          this.createPhotography(
            this.buildFormData(this.fileToUpload),
            this.photographyDate,
            this.photographyType,
            this.imageName
          )
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
  buildFormData(file: File): FormData {
    const formData = new FormData();
    formData.append('imagePreview', file, file.name);
    return formData;
  }
  handleFileInput(file: FileList) {
    this.fileToUpload = file.item(0);
    console.log(this.buildFormData(this.fileToUpload));
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
    this.addImage = true;
    this.editType = false;
    this.initData('', new Date());
  }

  addFile() {
    this.file.nativeElement.click();
  }
  show(item: any) {
    let data = this.images[item.i];
    this.initData(data.photography, data.photographyDate, data.photographyType, item.image);
    this.selectedPhotography = item.i;
    this.imgToShow.emit(item.imageUrl);
    this.activeIndex = item.i;
    this.addImage = false;
    this.editType = false;
  }

  saveEditType() {
    if (!this.photographyType) {
      this.validate = false;
    } else {
      this.editPhotographyForm(
        this.selectedPhotography,
        this.photography,
        this.photographyType,
        this.photographyDate,
        this.imageName
      );
      this.verifyIdentification();
      this.photographyInsertionNumber++;
      this.validate = true;
    }
    this.editType = false;
  }

  cancelEditType() {
    this.editType = !this.editType;
    this.photographyType = this.previousPhotographyType;
  }
  editImgType() {
    this.editType = !this.editType;
    this.previousPhotographyType = this.photographyType;
  }

  delete() {
    // this.photographies.removeAt(this.activeIndex);
    this.images.splice(this.activeIndex, 1);
  }

  deleteItem(item: string) {
    this.itemToDelete = item;
    this.deleteDialog = true;
  }
  cancelDelete() {
    this.deleteDialog = false;
  }
}
