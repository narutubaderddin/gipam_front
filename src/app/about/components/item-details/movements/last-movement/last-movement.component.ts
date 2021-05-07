import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import * as L from 'leaflet';

import { DatePipe } from '@angular/common';
import { ColDef, ColumnApi, GridApi, ICellEditorParams } from 'ag-grid-community';

import { MovementsService } from '@app/about/components/item-details/movements/movements.service';
import { ShowMovementDetailsRendererComponent } from '@shared/components/datatables/show-movement-details-renderer/show-movement-details-renderer.component';
const iconRetinaUrl = 'assets/marker-icon-2x.png';
const iconUrl = 'assets/marker-icon.png';
const shadowUrl = 'assets/marker-shadow.png';
@Component({
  selector: 'app-last-movement',
  templateUrl: './last-movement.component.html',
  styleUrls: ['./last-movement.component.scss'],
  providers: [DatePipe],
})
export class LastMovementComponent implements OnInit {
  @Output() openMvtHistory = new EventEmitter();

  map: any;
  showDetailsMvt: boolean = false;
  mvtActions: any = [
    {
      date: this.datePipe.transform(new Date('01/01/2021'), 'dd/MM/yyyy'),
      movementType: 'En réserve pour restitution',
      author: 'Jean T',
      status: 'alert',
    },
    {
      date: this.datePipe.transform(new Date('03/01/2021'), 'dd/MM/yyyy'),
      movementType: 'En réserve pour restitution',
      author: 'Olivier T',
      status: 'en cours',
    },
  ];
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

  ngOnInit(): void {
    console.log(this.showDetailsMvt);
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

  openDetailsMvt() {
    // this.showDetailsMvt = !this.showDetailsMvt;
    this.showDetailsMvt = true;
    this.openMvtHistory.emit(this.showDetailsMvt);
    console.log(this.showDetailsMvt);
  }
}
