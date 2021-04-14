import { Component, Input, OnInit } from '@angular/core';
import { ColDef, ColumnApi, GridApi } from 'ag-grid-community';
import { NgbSlideEvent } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-attachments',
  templateUrl: './attachments.component.html',
  styleUrls: ['./attachments.component.scss'],
})
export class AttachmentsComponent implements OnInit {
  @Input() add = false;
  slide = 1;
  types = ['type 1', 'type 2', 'type 3'];

  dragDropConfig = {
    showList: true,
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

  attachments = [
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

  constructor() {}

  ngOnInit(): void {}
  getUploadedFiles(files: any) {
    console.log('My uploaded files', files);
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
