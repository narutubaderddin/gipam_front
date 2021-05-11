import { WorkOfArtService } from '@app/@shared/services/work-of-art.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-in-progress-alerts',
  templateUrl: './in-progress-alerts.component.html',
  styleUrls: ['./in-progress-alerts.component.scss'],
})
export class InProgressAlertsComponent implements OnInit {
  remarquers: any;

  // ColDef: ColDef[] = [
  //   {
  //     cellClass: 'link',
  //     headerName: 'N° inventaire',
  //     field: 'reference',
  //     cellRenderer: 'detailsLink',
  //     sortable: false,
  //     filter: false,
  //     width: 70,
  //     headerTooltip: 'Réf',
  //     tooltipField: 'reference',
  //   },
  //   {
  //     headerName: 'Titre',
  //     field: 'titre',
  //     width: 70,
  //   },
  //   {
  //     headerName: 'Auteurs',
  //     field: 'auteur',
  //     width: 70,
  //   },
  //   {
  //     headerName: "Type d'action",
  //     field: 'actiontype',
  //   },
  //   {
  //     headerName: 'Date début',
  //     field: 'startDate',
  //     width: 90,
  //   },
  //   {
  //     headerName: 'Date fin',
  //     field: 'endDate',
  //   },
  //   {
  //     headerName: 'Délai',
  //     field: 'delai',
  //   },
  //   {
  //     headerName: 'Statut',
  //     field: 'status',
  //   },
  //   {
  //     headerName: 'Créé par',
  //     field: 'createdBy',
  //     width: 90,
  //   },
  //   {
  //     headerName: 'Actions',
  //     field: 'action',
  //     cellRenderer: 'gridActionRenderer',
  //     sortable: false,
  //     filter: false,
  //     width: 70,
  //   },
  // ];

  gridReady = false;
  rowCount: any = 5;
  constructor(private router: Router, private WorkOfArtService: WorkOfArtService) {}

  ngOnInit(): void {
    this.remarquers = this.WorkOfArtService.alerts;
  }
}
