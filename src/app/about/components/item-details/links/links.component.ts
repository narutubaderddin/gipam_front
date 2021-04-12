import { Component, Input, OnInit } from '@angular/core';
import { ColDef, ColumnApi, GridApi } from 'ag-grid-community';

@Component({
  selector: 'app-links',
  templateUrl: './links.component.html',
  styleUrls: ['./links.component.scss'],
})
export class LinksComponent implements OnInit {
  @Input() add: false;
  types = [' 125', ' 222', ' 342'];

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
      attachments: 'details.pdf',
      date: '01/01/2020',
      type: 'type',
      creator: 'Jean',
    },
    {
      attachments: 'details.pdf',
      date: '01/03/2020',
      type: 'type1',
      creator: 'Paul',
    },
    {
      attachments: 'details.pdf',
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
}
