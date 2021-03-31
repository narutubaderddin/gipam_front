import { Component, OnInit } from '@angular/core';
import { NgbSlideEvent } from '@ng-bootstrap/ng-bootstrap';
import { ColDef, ColumnApi, GridApi } from 'ag-grid-community';

@Component({
  selector: 'app-item-images',
  templateUrl: './item-images.component.html',
  styleUrls: ['./item-images.component.scss'],
})
export class ItemImagesComponent implements OnInit {
  slide = 1;

  columnDefs: ColDef[] = [
    {
      headerName: 'source',
      field: 'src',
      width: 100,
    },
  ];

  images = [
    {
      src: 'assets/images/573.jpg',
    },
    {
      src: 'assets/images/573a.jpg',
    },
    {
      src: 'assets/images/573b.jpg',
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
