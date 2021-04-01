import { Component, OnInit } from '@angular/core';
import { ColDef, ColumnApi, GridApi } from 'ag-grid-community';

@Component({
  selector: 'app-attachments',
  templateUrl: './attachments.component.html',
  styleUrls: ['./attachments.component.scss'],
})
export class AttachmentsComponent implements OnInit {
  columnDefs: ColDef[] = [
    {
      headerName: 'pièce jointes',
      field: 'attachments',
      width: 100,
    },
    {
      headerName: 'date de création',
      field: 'date',
      width: 100,
    },
    {
      headerName: 'Type',
      field: 'type',
      width: 100,
    },
    {
      headerName: 'Responsable',
      field: 'responsable',
      width: 100,
    },
  ];

  attachments = [
    {
      attachments: 'details.pdf',
      date: '01/01/2020',
      type: 'type',
      responsable: 'Jean',
    },
    {
      attachments: 'details.pdf',
      date: '01/03/2020',
      type: 'type1',
      responsable: 'Paul',
    },
    {
      attachments: 'details.pdf',
      date: '01/01/2020',
      type: 'type',
      responsable: 'Jean',
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
}
