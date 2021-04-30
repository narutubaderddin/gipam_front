import { Component, Input, OnInit } from '@angular/core';
import { ColDef, ColumnApi, GridApi } from 'ag-grid-community';
import { NgbSlideEvent } from '@ng-bootstrap/ng-bootstrap';
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

  slide = 1;
  types = ['type 1', 'type 2', 'type 3'];

  dragDropConfig = {
    showList: false,
    showProgress: true,
    lang: {},
  };

  columnDefs: ColDef[] = [
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
  ];

  defaultColDef = {
    sortable: true,
    filter: false,
    resizable: true,
    flex: 1,
  };
  gridApi: GridApi;
  gridColumnApi: ColumnApi;
  gridReady = false;

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
    }
  }

  showItem(index: number) {
    let data = this.attachments.value[index];
    this.initData(data.attachment, data.attachmentType);
    this.selectedAttachment = index;
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
}
