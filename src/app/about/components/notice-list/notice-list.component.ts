import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { WorkOfArtService } from '@app/@shared/services/work-of-art.service';

@Component({
  selector: 'app-notice-list',
  templateUrl: './notice-list.component.html',
  styleUrls: ['./notice-list.component.scss'],
})
export class NoticeListComponent implements OnInit {
  remarquers: any;
  columns: any[] = [
    {
      header: 'N° inventaire',
      field: 'id',
      sortable: true,
      filter: true,
      filterType: 'text',
      checkBoxSelection: false,
      type: 'app-remarquer-details-link-render',
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
      header: 'Domaine',
      field: 'domaine',
      sortable: true,
      width: '150px',
      filter: true,
      filterType: 'multiselect',
      placeholder: 'Choisir des Domaine',
      selectData: this.WorkOfArtService.domaine,
      type: 'key',
    },
    {
      header: 'Dénomination',
      field: 'denomination',
      sortable: true,
      width: '150px',
      filter: true,
      filterType: 'multiselect',
      selectData: this.WorkOfArtService.denominations,
      type: 'key',
    },
    {
      header: 'Matière',
      field: 'matiere',
      sortable: true,
      width: '150px',
      filter: true,
      filterType: 'text',
      type: 'key',
    },
    {
      header: 'Style',
      field: 'style',
      sortable: true,
      width: '150px',
      filter: true,
      filterType: 'text',
      type: 'key',
    },
    {
      header: 'Date création',
      field: 'creationDate',
      sortable: true,
      width: '150px',
      filter: true,
      type: 'key',
      filterType: 'range-date',
    },
    {
      header: 'Type de Statut',
      field: 'property',
      cellRenderer: 'statusTypeRender',
      width: '200px',
      sortable: false,
      filter: true,
      type: 'app-status-component-render',
      filterType: 'select',
      selectData: this.WorkOfArtService.statusType,
    },
  ];

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
    this.remarquers = this.WorkOfArtService.oeuvres[0].items;
    this.filter = this.activatedRoute.snapshot.queryParams['filter'].length > 0;
    console.log(this.filter);
  }

  resetFilter() {}

  onRowsSelection(event: any) {
    this.selectedItem = event.selectedRows;
  }
}
