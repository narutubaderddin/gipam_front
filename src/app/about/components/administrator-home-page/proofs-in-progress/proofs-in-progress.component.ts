import { WorkOfArtService } from '@app/@shared/services/work-of-art.service';
import { Component, OnInit } from '@angular/core';
import { OPERATORS, TYPES } from '@app/@shared/services/column-filter.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-proofs-in-progress',
  templateUrl: './proofs-in-progress.component.html',
  styleUrls: ['./proofs-in-progress.component.scss'],
})
export class ProofsInProgressComponent implements OnInit {
  remarquers: any;

  pinnedCols: string[] = ['action'];

  gridReady = false;
  rowCount: any = 5;
  idShow: number;

  constructor(private router: Router, private WorkOfArtService: WorkOfArtService) {}

  ngOnInit(): void {
    this.remarquers = this.WorkOfArtService.proofs;
  }
  methodFromParent(cell: any, id: number) {
    // alert("Parent Component Method from " + id + "!");
    this.idShow = id;
  }
}
