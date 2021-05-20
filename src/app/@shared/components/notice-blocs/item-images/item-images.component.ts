import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { SimpleTabsRefService } from '@shared/services/simple-tabs-ref.service';
import { viewDateFormat } from '@shared/utils/helpers';
import {PhotographyService} from "@shared/services/photography.service";
import {MessageService} from "primeng/api";
import {ParentComponentApi} from "@app/about/components/item-details/item-details.component";
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
  @Output() imgToShow = new EventEmitter();
  @Input() parentApi: ParentComponentApi

  addImage = false;
  activeIndex = 0;
  editType = false;
  photography: string = '';
  photographyDate: Date = new Date();
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
  constructor(private modalService: NgbModal,
              public fb: FormBuilder,
              private  simpleTabsRef:SimpleTabsRefService,
              private photographyService: PhotographyService,
              private messageService: MessageService,
              private datePipe: DatePipe
              ) {}
  ngOnInit(): void {
    this.getAllTypes();
    this.images.map((el: any) => {
        this.photographies.push(
          this.createPhotography(el.photography, el.photographyDate, el.photographyType, el.imageName)
        )
       }
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
  get items() {
    console.log("images", this.images)
    return this.images;
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
        this.types = result.results;
      },
      (error: any) => {}
    );
  }

  createPhotography(
    photography?: any,
    photographyDate?: Date,
    photographyType?: any,
    imageName?: string
  ): FormGroup {
    return this.fb.group({
      date: [this.datePipe.transform(photographyDate, 'yyyy-MM-dd')],
      imagePreview: [photography],
      photographyType: [photographyType.id],
      // imageName: [imageName],
    });
  }
  editPhotographyForm(i: number, photography: string, photographyType: any, photographyDate: Date, imageName: string) {
    this.photographies.value[i].photographyType = photographyType;
    this.photographies.value[i].date = this.datePipe.transform(photographyDate, 'yyyy-MM-dd');
    // this.photographies.value[i].imageName = imageName;
    this.photographies.value[i].imagePreview = photography;
    this.images[i].imageUrl = photography;
    this.images[i].image = imageName;
    this.images[i].photographyType = photographyType;
    this.photography = photography;
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
          photographyType: this.photographyType,
          photographyDate: this.photographyDate,
        });

        this.photographies.push(
          this.createPhotography(
            this.buildFormData(this.fileToUpload),
            new Date(this.photographyDate),
            this.photographyType,
            this.imageName
          )
        );
        if(this.addImage){
          this.addItem(this.photographies.value[this.photographies.value.length-1]);
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
      // this.verifyIdentification();
      this.initData('', new Date());
      this.photographyInsertionNumber++;
      this.selectedPhotography = this.photographies.value.length;
      this.validate = true;
    }
  }
  buildFormData(file: File) {
    const formData = new FormData();
    formData.append('imagePreview', file, file.name);
    return formData;
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
      console.log("photographyType",this.photographyType, this.images);
      this.verifyIdentification();
      // this.photographyInsertionNumber++;
    }

  }
  editTypePhotography(type:any){
    this.btnLoading = '';
    const data={ photographyType:type.id }
    console.log(data, this.images[this.selectedPhotography].id);
    this.photographyService.updatePhotography(data, this.images[this.selectedPhotography].id).subscribe(
      result=>{
        this.callParent();
        this.addSingle('success', 'Modification', 'Photographie " ' + result.imageName + ' " modifiée avec succés');
        this.editType = false;
        this.validate = true;
      },
      error=>{
        console.log(error)
        this.photographyService.getFormErrors(error.error.errors, 'Modification');
        this.btnLoading = null;
      }
    )
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
    this.photographies.removeAt(this.activeIndex);
    this.images.splice(this.activeIndex, 1);
  }

  deleteItem(item: string) {
    this.itemToDelete = item;
    this.deleteDialog = true;
  }
  cancelDelete() {
    this.deleteDialog = false;
  }
  addItem(data:any){
    this.btnLoading = '';
    console.log('data', data)
    this.photographyService.addPhotography(data).subscribe(
      (result: any) => {
        this.addSingle('success', 'Ajout', 'Photographie ' + data + ' ajoutée avec succés');
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
    this.parentApi.callParentMethod(this.images[this.selectedPhotography].workArtId)
  }
}
