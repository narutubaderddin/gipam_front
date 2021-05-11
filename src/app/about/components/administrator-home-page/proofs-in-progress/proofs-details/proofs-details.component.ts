import { WorkOfArtService } from '@app/@shared/services/work-of-art.service';
import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-proofs-details',
  templateUrl: './proofs-details.component.html',
  styleUrls: ['./proofs-details.component.scss'],
})
export class ProofsDetailsComponent implements OnInit {
  @Input() show: boolean;

  remarquers: any;
  //
  // ColDef: ColDef[] = [
  //   {
  //     headerName: 'N° inventaire',
  //     field: 'inventaire',
  //     headerTooltip: 'N° inventaire',
  //     // width: 140,
  //   },
  //   {
  //     headerName: 'Titre',
  //     field: 'Titre',
  //     headerTooltip: 'Titre',
  //     // width: 120
  //   },
  //   {
  //     headerName: 'Domaine',
  //     field: 'Domaine',
  //     // width: 120,
  //   },
  //   {
  //     headerName: 'Dénomination',
  //     field: 'Denomination',
  //     // width: 150,
  //   },
  //   {
  //     headerName: 'Auteur',
  //     field: 'Auteur',
  //     // width: 120,
  //   },
  //   {
  //     headerName: 'Total récolement',
  //     field: 'Total_recole',
  //     //   width: 90,
  //   },
  //   {
  //     headerName: 'Date dernier récolement',
  //     field: 'Date_last_recole',
  //     headerComponentParams: {
  //       ...this.defaultHeaderParams,
  //       type: TYPES.date,
  //       operator: OPERATORS.in,
  //     },
  //     // width: 90,
  //   },
  //   {
  //     headerName: 'Récolé',
  //     field: 'Recole',
  //     cellRenderer: 'recoleRenderer',
  //
  //     // width: 100,
  //   },
  //   {
  //     headerName: 'Actions',
  //     field: 'action',
  //     cellRenderer: 'gridActionRenderer',
  //
  //     sortable: false,
  //     filter: false,
  //     width: 138,
  //   },
  // ];
  pinnedCols: string[] = ['action'];

  gridReady = false;
  rowCount: any = 5;

  constructor(private router: Router, private WorkOfArtService: WorkOfArtService) {}

  ngOnInit(): void {
    this.remarquers = this.WorkOfArtService.proofsDetails;
  }
}
