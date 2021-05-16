import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { SimpleTabsRefService } from '@shared/services/simple-tabs-ref.service';

@Component({
  selector: 'app-attachments',
  templateUrl: './attachments.component.html',
  styleUrls: ['./attachments.component.scss'],
})
export class AttachmentsComponent implements OnInit {
  @Input() add = false;
  @Input() attachmentForm: FormGroup;
  @Input() itemDetails: boolean = false;

  attachmentType: any;
  files: any[] = [];
  validation = true;
  selectedAttachment = 0;
  attachmentInsertionNumber = 0;
  addedFile: any;
  edit = false;
  display = false;
  types: any;
  slide = 1;

  dragDropConfig = {
    showList: false,
    showProgress: true,
    lang: {},
  };

  existingAttachments = [
    {
      attachment: {
        name: 'details.pdf',
      },
      attachmentType: 'type 2',
    },
    {
      attachment: {
        name: 'fichier',
      },
      attachmentType: 'type 2',
    },
    {
      attachment: {
        name: 'exemple.pdf',
      },
      attachmentType: 'type 1',
    },
  ];

  responsiveOptions = [
    {
      breakpoint: '1500px',
      numVisible: 2,
      numScroll: 2,
    },
    {
      breakpoint: '560px',
      numVisible: 1,
      numScroll: 1,
    },
  ];
  editAttachement: boolean = false;
  filesProperties: any[] = [];

  previousType: any;
  deleteDialog: boolean = false;
  itemToDelete: string;

  get attachments(): FormArray {
    return this.attachmentForm.get('attachments') as FormArray;
  }
  constructor(private fb: FormBuilder, private simpleTabsRef: SimpleTabsRefService) {}

  ngOnInit(): void {
    this.getAllTypes();
    if (this.itemDetails) {
      this.existingAttachments.map((el: any) => {
        this.files.push(el.attachment);
        this.attachments.push(this.createAttachment(el.attachment, el.attachementType));
      });
    }
  }

  initData(photography?: any, photographyType?: any) {
    this.addedFile = photography;
    this.attachmentType = photographyType;
  }
  getAllTypes() {
    this.simpleTabsRef.tabRef = 'attachmentTypes';
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
  createAttachment(attachment?: any, attachmentType?: any): FormGroup {
    this.filesProperties.push({ edit: false, delete: false });
    return this.fb.group({
      link: [attachment, [Validators.required]],
      attachmentType: [attachmentType, [Validators.required]],
      comment: [''],
    });
  }
  editAttachmentForm(index?: any, attachment?: any, attachmentType?: any) {
    this.attachments.value[index].link = attachment;
    this.attachments.value[index].attachmentType = attachmentType;
    this.filesProperties[index].edit = false;
  }
  getUploadedFiles(files: any) {
    this.addedFile = files[files.length - 1];
  }

  deleteAttachment(index: number) {
    this.files.splice(index, 1);
    this.attachments.removeAt(index);
    this.deleteDialog = false;
  }

  validate() {
    if (!this.addedFile || !this.attachmentType) {
      this.validation = false;
    } else {
      if (this.itemDetails) {
        this.existingAttachments.push({ attachment: this.addedFile, attachmentType: this.attachmentType });
      }
      if (this.selectedAttachment == this.attachments.value.length || this.itemDetails) {
        this.files.push(this.addedFile);
        this.attachments.push(this.createAttachment(this.addedFile.name, this.attachmentType));
      } else {
        this.editAttachmentForm(this.selectedAttachment, this.addedFile.name, this.attachmentType);
      }
      this.initData();
      this.attachmentInsertionNumber++;
      this.selectedAttachment = this.attachments.value.length;
      this.validation = true;
      this.edit = false;
      this.display = false;
    }
  }

  showItem(attachment: any) {
    let data = attachment;
    this.initData(data.attachment, data.attachmentType);
    this.selectedAttachment = 0;
    this.edit = true;
  }

  addAttachment() {
    this.display = true;
  }
  editAttachment(value: any, index: number) {
    this.filesProperties[index] = {
      ...this.filesProperties[index],
      edit: true,
      delete: false,
    };
    this.previousType = value;
  }
  cancelEditAttachment(el: any, index: number) {
    this.filesProperties[index] = {
      ...this.filesProperties[index],
      edit: false,
      delete: false,
    };
    this.editAttachmentForm(index, el.attachment, this.previousType);
    this.existingAttachments[index].attachmentType = this.previousType;
  }
  getIndex(el: any) {
    return this.existingAttachments.indexOf(el);
  }
  delete(item: string) {
    this.deleteDialog = true;
    this.itemToDelete = item;
  }
  cancelDelete() {
    this.deleteDialog = false;
    this.itemToDelete = '';
  }
}
