import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { SimpleTabsRefService } from '@shared/services/simple-tabs-ref.service';
import { viewDateFormat } from '@shared/utils/helpers';
import { PhotographyService } from '@shared/services/photography.service';
import { MessageService } from 'primeng/api';
import { ParentComponentApi } from '@app/about/components/item-details/item-details.component';
import { DatePipe } from '@angular/common';
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
  photographyType: any[] = [];
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

  get photographies(): FormArray {
    return this.photographiesForm.get('photographies') as FormArray;
  }
  constructor(
    private modalService: NgbModal,
    public fb: FormBuilder,
    private simpleTabsRef: SimpleTabsRefService,
    private photographyService: PhotographyService,
    private messageService: MessageService,
    private datePipe: DatePipe
  ) {}
  ngOnInit(): void {
    this.getAllTypes();

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
  }
  ngOnChanges(changements: SimpleChanges) {}
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
      photographyType: [photographyType.id],
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
  verifyIdentification() {
    this.identification = 0;
    const identificationId = this.types.filter((type: any) => {
      return type.type == 'Identification';
    });
    if (this.photographies.value.length > 1) {
      this.photographies.value.forEach((photography: any) => {
        console.log(photography);
        if (photography.photographyType == identificationId) {
          this.types.forEach((type) => {
            if (type.type == 'Identification') {
              console.log(type);
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
      if (this.selectedPhotography == this.photographies.value.length || this.addImage) {
        this.photographies.push(
          this.createPhotography(
            this.fileToUpload,
            new Date(this.photographyDate),
            this.photographyType,
            this.imageName
          )
        );
        if (this.addImage) {
          let data = this.buildFormData(this.photographies.value[this.photographies.value.length - 1]);
          this.addItem(data);
        } else {
          this.images.push({
            i: this.photographyInsertionNumber,
            imageUrl: this.photography,
            alt: 'description',
            image: this.imageName,
            photographyType: this.photographyType,
            photographyDate: this.photographyDate,
          });
        }
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
    this.initData(item.imageUrl, item.photographyDate, item.photographyType, item.image);
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
      this.editTypePhotography(this.photographyType);
      console.log('photographyType', this.photographyType, this.images);
      this.verifyIdentification();
      // this.photographyInsertionNumber++;
    }
  }
  editTypePhotography(type: any) {
    this.btnLoading = '';
    const data = { photographyType: type.id };
    this.photographyService.updatePhotography(data, this.images[this.selectedPhotography].id).subscribe(
      (result) => {
        this.callParent();
        this.addSingle('success', 'Modification', 'Photographie " ' + result.imageName + ' " modifiée avec succés');
        this.editType = false;
        this.validate = true;
        this.btnLoading = null;
      },
      (error) => {
        console.log(error);
        this.photographyService.getFormErrors(error.error.errors, 'Modification');
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
        this.addSingle('success', 'Suppresion', 'Photographie supprimée avec succés');
        this.btnLoading = null;
        this.deleteDialog = false;
      },
      (error) => {
        console.log(error);
        this.addSingle('error', 'Suppresion', error.error.message);
        this.btnLoading = null;
      }
    );
  }

  deleteItem(item: string) {
    this.itemToDelete = item;
    this.deleteDialog = true;
  }
  cancelDelete() {
    this.deleteDialog = false;
  }
  addItem(data: any) {
    this.btnLoading = '';
    this.photographyService.addPhotography(data).subscribe(
      (result: any) => {
        this.callParent();
        this.addSingle('success', 'Ajout', 'Photographie ajoutée avec succés');
      },
      (error) => {
        this.addSingle('error', 'Ajout', error.error.message);
        this.photographyService.getFormErrors(error.error.errors, 'Ajout');
        this.btnLoading = null;
      }
    );
  }
  addSingle(type: string, sum: string, msg: string) {
    this.messageService.add({ severity: type, summary: sum, detail: msg });
    this.btnLoading = null;
  }

  callParent() {
    this.parentApi.callParentMethod(this.images[this.selectedPhotography].workArtId);
  }
  removePhotography(item: any) {
    this.photographies.removeAt(item.i);
    const index = this.images.indexOf(item, 0);
    if (index > -1) {
      this.images.splice(index, 1);
    }
    this.photographyInsertionNumber = this.photographyInsertionNumber - 1;
    this.selectedPhotography = this.selectedPhotography - 1;
  }
}
