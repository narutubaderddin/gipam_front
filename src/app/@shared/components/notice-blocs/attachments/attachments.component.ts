import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';

@Component({
  selector: 'app-attachments',
  templateUrl: './attachments.component.html',
  styleUrls: ['./attachments.component.scss'],
})
export class AttachmentsComponent implements OnInit {
  @Input() add = false;
  @Input() attachmentForm: FormGroup;

  attachmentType: any[];
  files: any[] = [];
  validation = true;
  selectedAttachment = 0;
  attachmentInsertionNumber = 0;
  addedFile: any;
  edit = false;
  display = false;

  slide = 1;
  types = ['type 1', 'type 2', 'type 3'];

  dragDropConfig = {
    showList: false,
    showProgress: true,
    lang: {},
  };

  columnDefs: any[] = [
    {
      headerName: 'pièce jointes',
      field: 'attachments',
      width: 40,
    },
    {
      headerName: 'date de création',
      field: 'date',
      width: 40,
    },
    {
      headerName: 'Type',
      field: 'type',
      width: 15,
    },
    {
      headerName: 'Responsable',
      field: 'responsable',
      width: 30,
    },
  ];

  existingAttachments = [
    {
      title: 'details.pdf',
      date: '01/01/2020',
      type: 'type A',
      creator: 'Olivier',
    },
    {
      title: 'details.pdf',
      date: '01/03/2020',
      type: 'type',
      creator: 'Paul',
    },
    {
      title: 'details.pdf',
      date: '01/01/2020',
      type: 'type',
      creator: 'Jean',
    },
    {
      title: 'details.pdf',
      date: '01/01/2020',
      type: 'type',
      creator: 'Jean',
    },
  ];

  defaultColDef = {
    sortable: true,
    filter: false,
    resizable: true,
    flex: 1,
  };

  gridReady = false;
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
  get attachments(): FormArray {
    return this.attachmentForm.get('attachments') as FormArray;
  }
  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {}

  initData(photography?: any, photographyType?: any) {
    this.addedFile = photography;
    this.attachmentType = photographyType;
  }
  createAttachment(attachment?: any, attachmentType?: any): FormGroup {
    return this.fb.group({
      attachment: [attachment, [Validators.required]],
      attachmentType: [attachmentType, [Validators.required]],
    });
  }
  editAttachmentForm(index?: any, attachment?: any, attachmentType?: any) {
    this.attachments.value[index].attachment = attachment;
    this.attachments.value[index].attachmentType = attachmentType;
  }
  getUploadedFiles(files: any) {
    this.addedFile = files[files.length - 1];
  }

  deleteAttachment(index: number) {
    this.files.splice(index, 1);
  }

  validate() {
    console.log(this.attachments);
    if (!this.addedFile || !this.attachmentType) {
      this.validation = false;
    } else {
      if (this.selectedAttachment == this.attachments.value.length) {
        this.files.push(this.addedFile);
        this.attachments.push(this.createAttachment(this.addedFile, this.attachmentType));
      } else {
        this.editAttachmentForm(this.selectedAttachment, this.addedFile, this.attachmentType);
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
}
