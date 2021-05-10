import { Component, OnInit } from '@angular/core';
import { OPERATORS, TYPES } from '@shared/services/column-filter.service';
import { ActivatedRoute, Router } from '@angular/router';
import { WorkOfArtService } from '@app/@shared/services/work-of-art.service';

@Component({
  selector: 'app-recolement-list',
  templateUrl: './recolement-list.component.html',
  styleUrls: ['./recolement-list.component.scss'],
})
export class RecolementListComponent implements OnInit {
  defaultColDef = {
    headerComponent: 'customHeader',
    sortable: true,
    filter: true,
    resizable: true,
    headerValueGetter: (params: any) => {
      return params.colDef.headerName;
    },
    headerComponentParams: {
      menuIcon: 'fa-filter',
      operator: OPERATORS.like,
      type: TYPES.text,
    },
  };

  remarquers: any;
  columns: any[] = [
    {
      header: 'Titre de récolement',
      field: 'titre',
      type: 'key',
      width: '100px',
      filter: true,
      filterType: 'text',
      sortable: true,
    },
    {
      header: 'Date création',
      field: 'creationDate',
      sortable: true,
      width: '100px',
      filter: true,
      type: 'key',
      filterType: 'range-date',
    },
    {
      header: "Nombre d'oeuvres à récoler",
      field: 'nombre_prood_a_recole',
      type: 'key',
      width: '100px',
      filter: true,
      filterType: 'text',
      sortable: true,
    },
    {
      header: "Nombre d'oeuvres récolées",
      field: 'nombre_prood_recole',
      type: 'key',
      width: '100px',
      filter: true,
      filterType: 'text',
      sortable: true,
    },
    {
      header: 'Créé par',
      field: 'created_by',
      type: 'key',
      width: '100px',
      filter: true,
      filterType: 'text',
      sortable: true,
    },
    {
      header: 'Ministère',
      field: 'minister',
      type: 'key',
      width: '100px',
      filter: true,
      filterType: 'text',
      sortable: true,
    },
    {
      header: 'Etab/Dir.',
      field: 'etab',
      type: 'key',
      width: '100px',
      filter: true,
      filterType: 'text',
      sortable: true,
    },
    {
      header: 'Service',
      field: 'service',
      type: 'key',
      width: '100px',
      filter: true,
      filterType: 'text',
      sortable: true,
    },
    {
      header: 'Site',
      field: 'service',
      type: 'key',
      width: '100px',
      filter: true,
      filterType: 'text',
      sortable: true,
    },
    {
      header: 'Bâtiment',
      field: 'service',
      type: 'key',
      width: '100px',
      filter: true,
      filterType: 'text',
      sortable: true,
    },
  ];
  ColDef: any[] = [
    {
      headerName: 'Titre de récolement ',
      field: 'titre',
      headerTooltip: 'Titre de récolement',
      width: 70,
    },
    {
      headerName: 'Date création',
      field: 'creationDate',
      headerComponentParams: {
        ...this.defaultHeaderParams,
        type: TYPES.date,
        operator: OPERATORS.in,
      },
      width: 90,
    },
    {
      headerName: "Nombre d'oeuvres à récoler",
      field: 'nombre_prood_a_recole',
      width: 50,
    },
    {
      headerName: "Nombre d'oeuvres récolées",
      field: 'nombre_prood_recole',
      width: 50,
    },
    {
      headerName: 'Créé par',
      field: 'created_by',
      width: 70,
    },
    {
      headerName: 'Ministère',
      field: 'minister',
      width: 185,
    },
    {
      headerName: 'Etab/Dir.',
      field: 'etab',
      width: 185,
    },
    {
      headerName: 'Service',
      field: 'service',
      width: 185,
    },
    {
      headerName: 'Site',
      field: 'service',
      width: 185,
    },
    {
      headerName: 'Bâtiment ',
      field: 'service',
      width: 182,
    },
    {
      headerName: 'Actions',
      field: 'action',
      cellRenderer: 'gridActionRenderer',
      sortable: false,
      filter: false,
      width: 100,
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

  get defaultHeaderParams() {
    return this.defaultColDef.headerComponentParams;
  }

  ngOnInit(): void {
    this.remarquers = this.WorkOfArtService.proofs;
    this.filter =
      this.activatedRoute.snapshot.queryParams['filter'] &&
      this.activatedRoute.snapshot.queryParams['filter'].length > 0;
  }

  resetFilter() {}
  onRowsSelection(event: any) {
    this.selectedItem = event.selectedRows;
  }
}
