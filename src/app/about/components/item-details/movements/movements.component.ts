import { AfterViewInit, Component, EventEmitter, Output } from '@angular/core';
import * as L from 'leaflet';
import { MovementsService } from '@app/about/components/item-details/movements/movements.service';
import { DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';

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
  @Output() closeMvtHistory = new EventEmitter();

  public rowData: any;

  map: any;
  showDetailsMvt: boolean = false;
  mvtActions: any = [
    {
      date: this.datePipe.transform(new Date('01/01/2021'), 'dd/MM/yyyy'),
      movementType: 'Depôt',
      author: 'Jean T',
      status: 'terminé',
    },
    {
      date: this.datePipe.transform(new Date('03/01/2021'), 'dd/MM/yyyy'),
      movementType: 'Déplacement',
      author: 'Olivier T',
      status: 'alert',
    },
    {
      date: this.datePipe.transform(new Date(), 'dd/MM/yyyy'),
      movementType: 'Prêt',
      author: 'Paul T',
      status: 'en cours',
    },
  ];
  query = 'Tunis';

  // columnDefs: ColDef[] = [
  //   {
  //     headerName: 'Date',
  //     field: 'date',
  //   },
  //   {
  //     headerName: 'Type mouvement',
  //     field: 'movementType',
  //   },
  //   {
  //     headerName: "Type d'action",
  //     field: 'actionType',
  //   },
  //   {
  //     headerName: 'Sigle Ministère',
  //     field: 'ministerSigle',
  //   },
  //   {
  //     headerName: 'Sigle Etab/Dir',
  //     field: 'directionSigle',
  //   },
  //   {
  //     headerName: 'Sigle Service',
  //     field: 'directionSigle',
  //   },
  //   {
  //     headerName: 'Sigle Site',
  //     field: 'directionSigle',
  //   },
  //   {
  //     headerName: 'Sigle Batiment',
  //     field: 'directionSigle',
  //   },
  //   {
  //     headerName: 'Correspondants',
  //     field: 'correspondant',
  //   },
  //   {
  //     headerName: 'Détails',
  //     flex: 0.5,
  //     cellRenderer: 'showMovementDetailsRenderer',
  //     tooltipValueGetter: () => {
  //       return 'Voir plus de détails sur le mouvement';
  //     },
  //   },
  // ];

  movements = [
    {
      date: this.datePipe.transform(new Date('01/01/2021'), 'dd/MM/yyyy'),
      movementType: 'Installation',
      actionType: '',
      ministerSigle: 'MDI',
      directionSigle: 'CAB',
    },
    {
      date: this.datePipe.transform(new Date('03/01/2021'), 'dd/MM/yyyy'),
      movementType: 'Mise en réserve pour restitution',
      actionType: 'En réserve pour restitution',
      ministerSigle: 'CG',
      directionSigle: 'PGT',
    },
  ];
  defaultColDef = {
    sortable: true,
    filter: false,
    resizable: true,
    flex: 1,
  };

  countryCellRenderer(params: any) {
    var flag = 'hello';
    return 'hello';
  }
  isFullWidth(data: any) {
    console.log(data);
    return ['Peru', 'France', 'Italy'].indexOf(data.name) >= 0;
  }
  fullWidthCellRenderer = 'fullWidthCellRenderer';

  isFullWidthCell = function (rowNode: any) {
    console.log(rowNode.data);

    return true;
  };

  detailCellRenderer = 'myDetailCellRenderer';

  gridReady = false;

  constructor(private movementsService: MovementsService, private datePipe: DatePipe, private http: HttpClient) {}

  ngAfterViewInit(): void {
    // this.initMap();
    // this.movementsService.makeCapitalMarkers(this.map);
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
    this.showDetailsMvt = false;
    this.closeMvtHistory.emit(this.showDetailsMvt);
    console.log(this.showDetailsMvt);
  }

  rowData1 = [
    {
      name: 'Ireland',
      continent: 'Europe',
      language: 'English',
      code: 'ie',
      population: 4000000,
      summary: 'Master Drinkers',
    },
    {
      name: 'Spain',
      continent: 'Europe',
      language: 'Spanish',
      code: 'es',
      population: 4000000,
      summary: 'Bull Fighters',
    },
    {
      name: 'United Kingdom',
      continent: 'Europe',
      language: 'English',
      code: 'gb',
      population: 4000000,
      summary: 'Center of the World',
    },
    {
      name: 'France',
      continent: 'Europe',
      language: 'French',
      code: 'fr',
      population: 4000000,
      summary: 'Best Lovers',
    },
    {
      name: 'Germany',
      continent: 'Europe',
      language: 'German',
      code: 'de',
      population: 4000000,
      summary: 'Always on Time',
    },
    {
      name: 'Sweden',
      continent: 'Europe',
      language: 'Swedish',
      code: 'se',
      population: 4000000,
      summary: 'Home of Vikings',
    },
    {
      name: 'Norway',
      continent: 'Europe',
      language: 'Norwegian',
      code: 'no',
      population: 4000000,
      summary: 'Best Vikings',
    },
    {
      name: 'Italy',
      continent: 'Europe',
      language: 'Italian',
      code: 'it',
      population: 4000000,
      summary: 'Pizza Pizza',
    },
    {
      name: 'Greece',
      continent: 'Europe',
      language: 'Greek',
      code: 'gr',
      population: 4000000,
      summary: 'Many Gods',
    },
    {
      name: 'Iceland',
      continent: 'Europe',
      language: 'Icelandic',
      code: 'is',
      population: 4000000,
      summary: 'Exploding Volcano',
    },
    {
      name: 'Portugal',
      continent: 'Europe',
      language: 'Portuguese',
      code: 'pt',
      population: 4000000,
      summary: 'Ship Builders',
    },
    {
      name: 'Malta',
      continent: 'Europe',
      language: 'Maltese',
      code: 'mt',
      population: 4000000,
      summary: 'Fishermen',
    },
    {
      name: 'Brazil',
      continent: 'South America',
      language: 'Portuguese',
      code: 'br',
      population: 4000000,
      summary: 'Best Footballers',
    },
    {
      name: 'Argentina',
      continent: 'South America',
      language: 'Spanish',
      code: 'ar',
      population: 4000000,
      summary: 'Beef Steaks',
    },
    {
      name: 'Colombia',
      continent: 'South America',
      language: 'Spanish',
      code: 'co',
      population: 4000000,
      summary: 'Wonderful Hospitality',
    },
    {
      name: 'Peru',
      continent: 'South America',
      language: 'Spanish',
      code: 'pe',
      population: 4000000,
      summary: 'Paddington Bear',
    },
    {
      name: 'Venezuela',
      continent: 'South America',
      language: 'Spanish',
      code: 've',
      population: 4000000,
      summary: 'Never Been, Dunno',
    },
    {
      name: 'Uruguay',
      continent: 'South America',
      language: 'Spanish',
      code: 'uy',
      population: 4000000,
      summary: 'Excellent Food',
    },
  ];
}
