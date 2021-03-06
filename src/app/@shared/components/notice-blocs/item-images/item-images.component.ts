import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { SimpleTabsRefService } from '@shared/services/simple-tabs-ref.service';
import { viewDateFormat } from '@shared/utils/helpers';
import { PhotographyService } from '@shared/services/photography.service';
import { MessageService } from 'primeng/api';
import { ParentComponentApi } from '@app/about/components/item-details/item-details.component';
import { DatePipe } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-item-images',
  templateUrl: './item-images.component.html',
  styleUrls: ['./item-images.component.scss'],
  providers: [DatePipe],
})
export class ItemImagesComponent implements OnInit, OnChanges {
  @ViewChild('file') file: any;
  @Input() add = false;
  @Input() edit = false;
  @Input() images: any[] = [];
  @Input() photographiesForm: FormGroup;
  @Input() existingPhotographies: any[] = [];
  @Output() imgToShow = new EventEmitter();
  @Input() parentApi: ParentComponentApi;
  @Input() artWorkId: any;
  addImage = false;
  activeIndex = 0;
  editType = false;
  photography: string = '';
  photographyDate = this.datePipe.transform(new Date(), 'yyyy-MM-dd');
  photographyType: any = [];
  previousPhotographyType: any[] = [];
  types: any[];
  fileToUpload: any;
  imageName: any = '';
  photographyInsertionNumber = 0;
  selectedPhotography = 0;
  validate = true;
  isIdentification = false;
  identification = 0;
  imagePreview: any;
  deleteDialog: boolean = false;
  itemToDelete: any;
  viewDateFormat = viewDateFormat;
  btnLoading: any = null;
  existingPhotographyForm: FormGroup;
  inputFileDisabled = false;
  workArtId: any;
  isSelectedImage = false;
  get photographies(): FormArray {
    return this.photographiesForm.get('photographies') as FormArray;
  }
  get existingPhotography(): FormArray {
    return this.existingPhotographyForm.get('existingPhotography') as FormArray;
  }
  constructor(
    private modalService: NgbModal,
    public fb: FormBuilder,
    private simpleTabsRef: SimpleTabsRefService,
    private photographyService: PhotographyService,
    private messageService: MessageService,
    private datePipe: DatePipe,
    private route: ActivatedRoute
  ) {}
  ngOnInit(): void {
    this.workArtId = this.route.snapshot.queryParams.id;
    this.getAllTypes();
    this.initExistingPhotography();
    this.images.map((el: any) => {
      this.photographies.push(this.createPhotography(el.imagePreview, el.date, el.photographyType, el.imageName));
    });

    if (this.images[this.activeIndex]) {
      this.initData(
        this.images[this.activeIndex].photography,
        this.images[this.activeIndex].photographyDate,
        this.images[this.activeIndex].photographyType,
        this.images[this.activeIndex].image
      );
    }

    if (this.existingPhotographies.length) {
      this.existingPhotographies.map((el: any, index: number) => {
        console.log(el);
        this.existingPhotography.push(
          this.addExistingPhotography(el.id, el.imagePreview, el.date, el.photographyType.id)
        );
        this.images.push({
          imageUrl: el.imagePreview,
          photographyType: el.photographyType,
          photographyDate: el.date,
          image: el.imageName,
          i: index,
        });
      });
      this.selectedPhotography = this.existingPhotographies.length;
      this.initData();
    }
  }

  getActivePicture() {
    if (this.images[this.activeIndex]) {
      return this.images[this.activeIndex].imageUrl;
    }
  }

  ngOnChanges(changements: SimpleChanges) {
    if (this.images[this.activeIndex]) {
      this.show(this.images[this.activeIndex]);
    }
  }
  get items() {
    return this.images;
  }
  initData(photography?: string, photographyDate?: any, photographyType?: any, imageName?: string) {
    this.photography = photography;
    this.photographyDate = this.datePipe.transform(photographyDate, 'yyyy-MM-dd');
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
        this.types = result.results;
      },
      (error: any) => {}
    );
  }

  createPhotography(
    photography?: FormData,
    photographyDate?: any,
    photographyType?: any,
    imageName?: string
  ): FormGroup {
    return this.fb.group({
      date: [this.datePipe.transform(photographyDate, 'yyyy-MM-dd')],
      imagePreview: [photography],
      photographyType: [photographyType],
    });
  }
  initExistingPhotography() {
    this.existingPhotographyForm = this.fb.group({
      existingPhotography: this.fb.array([]),
    });
  }
  addExistingPhotography(id?: number, photography?: FormData, photographyDate?: any, photographyType?: any) {
    return this.fb.group({
      id: [id],
      date: [this.datePipe.transform(photographyDate, 'yyyy-MM-dd')],
      imagePreview: [photography],
      photographyType: [photographyType],
    });
  }
  editPhotographyForm(i: number, photography: string, photographyType: any, photographyDate: any, imageName: string) {
    this.photographies.value[i].photographyType = photographyType;
    this.photographies.value[i].date = this.datePipe.transform(photographyDate, 'yyyy-MM-dd');
    this.photographies.value[i].imagePreview = photography;
    this.images[i].imageUrl = photography;
    this.images[i].image = imageName;
    this.images[i].photographyType = photographyType;
    this.photography = photography;
  }
  verifyIdentification(event: any) {
    this.identification = 0;
    if (this.images) {
      this.images.forEach((photography: any) => {
        if (photography.photographyType.type == 'Identification') {
          this.types.forEach((type) => {
            if (type.type == 'Identification') {
              type.disabled = true;
            }
          });
        }
      });
    }
  }
  buildFormData(data: any) {
    const formData = new FormData();
    formData.append('imagePreview', data.imagePreview);
    formData.append('photographyType', data.photographyType);
    formData.append('date', data.date);
    formData.append('furniture', this.artWorkId);

    return formData;
  }
  addPhotography(): void {
    if (!this.photography.length || !this.photographyType || !this.imageName.length) {
      this.validate = false;
    } else {
      if (
        (this.selectedPhotography >= this.existingPhotography.value.length &&
          this.selectedPhotography - this.existingPhotography.value.length == this.photographies.value.length) ||
        this.addImage
      ) {
        this.photographies.push(
          this.createPhotography(
            this.fileToUpload,
            new Date(this.photographyDate),
            this.photographyType.id,
            this.imageName
          )
        );
        if (this.addImage) {
          console.log(this.photographies.value[this.photographies.value.length - 1]);
          let data = this.buildFormData(this.photographies.value[this.photographies.value.length - 1]);
          this.addItem(data);
        } else {
          this.images.push({
            i: this.photographyInsertionNumber + this.existingPhotographies.length,
            imageUrl: this.photography,
            image: this.imageName,
            photographyType: this.photographyType,
            photographyDate: this.photographyDate,
          });
        }
        this.photographyInsertionNumber++;
        this.validate = true;
      } else {
        if (this.selectedPhotography > this.existingPhotographies.length) {
          this.editPhotographyForm(
            this.selectedPhotography - this.existingPhotographies.length,
            this.photography,
            this.photographyType.id,
            this.photographyDate,
            this.imageName
          );
          this.photographyInsertionNumber++;
          this.validate = true;
        }
      }
      this.initData('', new Date());
      this.inputFileDisabled = false;
      this.selectedPhotography = this.images.length;
      this.isSelectedImage = false;
    }
  }
  handleFileInput(e: any) {
    const file = e.target.files.item(0);
    this.fileToUpload = file;

    const fReader = new FileReader();
    fReader.readAsDataURL(file);
    fReader.onload = (event: any) => {
      this.photography = event.target.result;
    };
    fReader.onloadend = (_event: any) => {
      this.imageName = file.name;
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
    console.log(item);
    item.i < this.existingPhotographies.length ? (this.inputFileDisabled = true) : (this.inputFileDisabled = false);
    this.selectedPhotography = item.i;
    this.initData(item.imageUrl, item.photographyDate, item.photographyType, item.image);
    this.imgToShow.emit(item.imageUrl);
    this.activeIndex = item.i;
    this.addImage = false;
    this.editType = false;
    this.isSelectedImage = true;
  }

  saveEditType() {
    if (!this.photographyType) {
      this.validate = false;
    } else {
      this.editTypePhotography(this.photographyType);
    }
  }
  editTypePhotography(type: any) {
    this.btnLoading = '';
    const data = { photographyType: type.id };
    this.photographyService.updatePhotography(data, this.artWorkId).subscribe(
      (result) => {
        this.callParent();
        this.addSingle('success', 'Modification', 'Photographie " ' + result.imageName + ' " modifi??e avec succ??s');
        this.editType = false;
        this.validate = true;
        this.btnLoading = null;
      },
      (error) => {
        if (error.error.msg) {
          this.addSingle('error', 'Modification', error.error.msg);
        }else {
          this.addSingle('error', 'Modification', 'Erreur Servenue lors de la modification');
        }
        this.btnLoading = null;
      }
    );
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
    this.btnLoading = '';
    const el = this.images[this.activeIndex];
    this.photographyService.deletePhotography({ furniture: el.workArtId }, el.id).subscribe(
      (result) => {
        this.callParent();
        this.addSingle('success', 'Suppresion', 'Photographie supprim??e avec succ??s');
        this.btnLoading = null;
        this.deleteDialog = false;
      },
      (error) => {
        this.addSingle('error', 'Suppresion', error.error.message);
        this.btnLoading = null;
      }
    );
  }

  deleteItem(item: string) {
    console.log(item);
    this.itemToDelete = item;
    this.deleteDialog = true;
  }
  cancelDelete() {
    this.deleteDialog = false;
  }
  addItem(data: any) {
    this.btnLoading = '';
    console.log(data)
    this.photographyService.addPhotography(data).subscribe(
      (result: any) => {
        this.callParent();
        this.addSingle('success', 'Ajout', 'Photographie ajout??e avec succ??s');
      },
      (error) => {
        this.btnLoading = null;

        if (error.error.msg) {
          this.addSingle('error', 'Ajout', error.error.msg);
        }else {
        if(error.error.code==500){
          this.addSingle('error', 'Erreur Technique', 'Une erreur est servenue lors de l\'ajout');
        }else{
          this.addSingle('error', 'Ajout', 'Une erreur est servenue lors de l\'ajout');
        }
        }
      }
    );
  }
  addSingle(type: string, sum: string, msg: string) {
    this.messageService.add({ severity: type, summary: sum, detail: msg });
    this.btnLoading = null;
  }

  callParent() {
    this.parentApi.callParentMethod(this.artWorkId);
  }
  removePhotography(item: any) {
    if (item.i >= this.existingPhotographies.length) {
      this.photographies.removeAt(item.i - this.existingPhotographies.length);
    } else {
      this.inputFileDisabled = false;
      this.photographyService
        .deletePhotography({ furniture: this.workArtId }, this.existingPhotography.value[item.i].id)
        .subscribe(
          (result) => {},
          (error) => {
            this.addSingle('error', 'Suppresion', error.error.message);
            this.btnLoading = null;
          }
        );
      this.existingPhotography.removeAt(item.i);
    }
    const index = this.images.indexOf(item, 0);
    if (index > -1) {
      this.images.splice(index, 1);
    }
    this.selectedPhotography = this.images.length;
    this.types.forEach((type) => {
      if (type.type == 'Identification') {
        type.disabled = false;
      }
    });
    this.initData();
    this.isSelectedImage = false;
  }
}
