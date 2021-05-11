import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { WorkOfArtService } from '@app/@shared/services/work-of-art.service';

@Component({
  selector: 'app-alert-list',
  templateUrl: './alert-list.component.html',
  styleUrls: ['./alert-list.component.scss'],
})
export class AlertListComponent implements OnInit {
  remarquers: any;
  columns: any[] = [
    {
      header: 'N° inventaire',
      field: 'reference',
      type: 'app-remarquer-details-link-render',
      width: '150px',
      filter: true,
      filterType: 'text',
      sortable: true,
    },
    {
      header: 'Titre',
      field: 'titre',
      type: 'key',
      width: '150px',
      filter: true,
      filterType: 'text',
      sortable: true,
    },
    {
      header: 'Auteur',
      field: 'author',
      width: '150px',
      sortable: true,
      filter: true,
      filterType: 'text',
      type: 'key',
    },
    {
      header: "Type d'action",
      field: 'actiontype',
      width: '150px',
      sortable: true,
      filter: true,
      filterType: 'text',
      type: 'key',
    },
    {
      header: 'Date début',
      field: 'startDate',
      width: '150px',
      sortable: true,
      filter: true,
      filterType: 'text',
      type: 'key',
    },
    {
      header: 'Date fin',
      field: 'endDate',
      width: '150px',
      sortable: true,
      filter: true,
      filterType: 'text',
      type: 'key',
    },
    {
      header: 'Délai',
      field: 'delai',
      width: '150px',
      sortable: true,
      filter: true,
      filterType: 'text',
      type: 'key',
    },
    {
      header: 'Statut',
      field: 'status',
      width: '150px',
      sortable: true,
      filter: true,
      filterType: 'text',
      type: 'key',
    },
    {
      header: 'Créé par',
      field: 'createdBy',
      width: '150px',
      sortable: true,
      filter: true,
      filterType: 'text',
      type: 'key',
    },
    // {
    //   headerName: 'Actions',
    //   field: 'action',
    //   cellRenderer: 'gridActionRenderer',
    //   sortable: false,
    //   filter: false,
    //   width: 70,
    // },
  ];
  ColDef: any[] = [
    {
      cellClass: 'link',
      headerName: 'N° inventaire',
      field: 'reference',
      cellRenderer: 'detailsLink',
      sortable: false,
      filter: false,
      width: 70,
      headerTooltip: 'Réf',
      tooltipField: 'reference',
    },
    {
      headerName: 'Titre',
      field: 'titre',
      width: 70,
    },
    {
      headerName: 'Auteurs',
      field: 'auteur',
      width: 70,
    },
    {
      headerName: "Type d'action",
      field: 'actiontype',
    },
    {
      headerName: 'Date début',
      field: 'startDate',
      width: 90,
    },
    {
      headerName: 'Date fin',
      field: 'endDate',
    },
    {
      headerName: 'Délai',
      field: 'delai',
    },
    {
      headerName: 'Statut',
      field: 'status',
    },
    {
      headerName: 'Créé par',
      field: 'createdBy',
      width: 90,
    },
    {
      headerName: 'Actions',
      field: 'action',
      cellRenderer: 'gridActionRenderer',
      sortable: false,
      filter: false,
      width: 70,
    },
  ];
  pinnedCols: string[] = ['action'];
  leftPinnedCols: string[] = ['id'];

  gridReady = false;
  rowCount: any = 5;
  filter: boolean = false;
  selectedItem: any;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private WorkOfArtService: WorkOfArtService
  ) {}

  ngOnInit(): void {
    this.remarquers = this.WorkOfArtService.alerts;
    this.filter =
      this.activatedRoute.snapshot.queryParams['filter'] &&
      this.activatedRoute.snapshot.queryParams['filter'].length > 0;
  }

  resetFilter() {}

  onRowsSelection(event: any) {
    this.selectedItem = event.selectedRows;
  }
}
