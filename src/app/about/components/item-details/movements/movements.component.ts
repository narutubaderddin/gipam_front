/// <reference types="@types/leaflet" />
import { AfterViewInit, Component } from '@angular/core';
import * as L from 'leaflet';
import { MovementsService } from '@app/about/components/item-details/movements/movements.service';
import { DatePipe } from '@angular/common';
import { ColDef, ColumnApi, GridApi, ICellEditorParams } from 'ag-grid-community';
import { ShowMovementDetailsRendererComponent } from '@shared/components/datatables/show-movement-details-renderer/show-movement-details-renderer.component';
const iconRetinaUrl = 'assets/marker-icon-2x.png';
const iconUrl = 'assets/marker-icon.png';
const shadowUrl = 'assets/marker-shadow.png';
L.Marker.prototype.options.icon = L.icon({
  iconRetinaUrl,
  iconUrl,
  shadowUrl,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  tooltipAnchor: [16, -28],
  shadowSize: [41, 41],
});

@Component({
  selector: 'app-movements',
  templateUrl: './movements.component.html',
  styleUrls: ['./movements.component.scss'],
  providers: [DatePipe],
})
export class MovementsComponent implements AfterViewInit {
  map: any;
  query = 'Tunis';
  frameworkComponent = {
    showMovementDetailsRenderer: ShowMovementDetailsRendererComponent,
  };
  columnDefs: ColDef[] = [
    {
      headerName: 'Date',
      field: 'date',
    },
    {
      headerName: 'Type mouvement',
      field: 'movementType',
    },
    {
      headerName: 'Sigle Ministère',
      field: 'ministerSigle',
    },
    {
      headerName: 'Sigle Etab/Dir',
      field: 'directionSigle',
    },
    {
      headerName: 'Sigle Service',
      field: 'directionSigle',
    },
    {
      headerName: 'Sigle Site',
      field: 'directionSigle',
    },
    {
      headerName: 'Sigle Batiment',
      field: 'directionSigle',
    },
    {
      headerName: 'Correspondants',
      field: 'correspondant',
    },
    {
      headerName: 'Détails',
      flex: 0.5,
      cellRenderer: 'showMovementDetailsRenderer',
      tooltipValueGetter: () => {
        return 'Voir plus de détails sur le mouvement';
      },
    },
  ];

  movements = [
    {
      date: this.datePipe.transform(new Date('01/01/2021'), 'dd/MM/yyyy'),
      movementType: 'Depôt',
      ministerSigle: 'MDI',
      directionSigle: 'CAB',
    },
    {
      date: this.datePipe.transform(new Date('03/01/2021'), 'dd/MM/yyyy'),
      movementType: 'Déplacement',
      ministerSigle: 'CG',
      directionSigle: 'PGT',
    },
    {
      date: this.datePipe.transform(new Date(), 'dd/MM/yyyy'),
      movementType: "Inscription à l'inventaire",
      ministerSigle: 'MDI',
      directionSigle: 'CAB',
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

  constructor(private movementsService: MovementsService, private datePipe: DatePipe) {}

  ngAfterViewInit(): void {
    this.initMap();
    this.movementsService.makeCapitalMarkers(this.map);
  }

  onGridReady(params: ICellEditorParams) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    this.gridReady = true;
  }

  initMap(): void {
    this.map = L.map('map', {
      center: [46, 2],
      zoom: 4,
    });
    const tiles = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 20,
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    });

    tiles.addTo(this.map);
  }
  addMovement() {}
}
