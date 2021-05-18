import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { WorkOfArtService } from '@app/@shared/services/work-of-art.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-notice-list',
  templateUrl: './notice-list.component.html',
  styleUrls: ['./notice-list.component.scss'],
})
export class NoticeListComponent implements OnInit {
  remarquers: any[] = [];
  columns: any[];
  rowCount: any = 5;
  selectedItem: any;
  frozenCols: any = [];
  filter: any;
  totalFiltred: any;
  total: any;
  limit = 5;
  page = 1;
  end: number;
  start: number;
  loading = false;
  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private workOfArtService: WorkOfArtService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.filter = this.activatedRoute.snapshot.queryParams['filter'].length > 0;
    this.initData();
  }
  initData() {
    let params = {
      page: this.page,
      limit: this.limit,
    };
    this.workOfArtService.getInProgressNotices(params).subscribe((res) => {
      this.remarquers = res.result;
      this.total = res.totalQuantity;
      this.totalFiltred = this.total;
      this.start = (this.page - 1) * this.limit + 1;
      this.end = (this.page - 1) * this.limit + this.remarquers.length;
    });
    this.initColumnsDef();
  }
  initColumnsDef() {
    this.columns = [
      {
        header: 'N° inventaire',
        field: 'id',
        sortable: true,
        filter: true,
        filterType: 'text',
        type: 'app-in-progress-notice-renderer',
      },
      {
        header: 'Titre',
        field: 'title',
        type: 'key',
        width: '150px',
        filter: true,
        filterType: 'text',
        sortable: true,
      },
      {
        header: 'Domaine',
        field: 'field',
        sortable: true,
        width: '150px',
        filter: true,
        filterType: 'multiselect',
        placeholder: 'Choisir des Domaine',
        selectData: this.workOfArtService.domaine,
        type: 'key-array',
        key_data: ['field', 'label'],
      },
      {
        header: 'Dénomination',
        field: 'denomination',
        sortable: true,
        width: '150px',
        filter: true,
        filterType: 'multiselect',
        selectData: this.workOfArtService.denominations,
        type: 'key-array',
        key_data: ['denomination', 'label'],
      },
      {
        header: 'Matière',
        field: 'materialTechnique',
        sortable: true,
        width: '150px',
        filter: true,
        filterType: 'text',
        type: 'key-multiple-data',
        key_multiple_data: ['materialTechnique', 'label'],
      },
      {
        header: 'Style',
        field: 'style',
        sortable: true,
        width: '150px',
        filter: true,
        filterType: 'text',
        type: 'key-array',
        key_data: ['style', 'label'],
      },
      {
        header: 'Epoque',
        field: 'era',
        sortable: true,
        width: '150px',
        filter: true,
        filterType: 'text',
        type: 'key-array',
        key_data: ['era', 'label'],
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
        field: 'status',
        cellRenderer: 'statusTypeRender',
        width: '200px',
        sortable: false,
        filter: true,
        type: 'app-status-component-render',
        filterType: 'select',
        selectData: this.workOfArtService.statusType,
      },
    ];
  }
  pagination(e: any) {
    if (e.page < this.total / parseInt(this.limit.toString(), 0)) {
      this.page = e.page + 1;
    } else {
      this.page = this.total / parseInt(this.limit.toString(), 0);
    }
    this.cdr.detectChanges();
    this.initData();
  }
  resetFilter() {}

  onRowsSelection(event: any) {
    this.selectedItem = event.selectedRows;
  }
}
