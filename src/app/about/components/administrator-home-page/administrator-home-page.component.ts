import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { WorkOfArtService } from '@shared/services/work-of-art.service';
import { DemandService } from '@shared/services/demand.service';
import { forkJoin } from 'rxjs';
@Component({
  selector: 'app-administrator-home-page',
  templateUrl: './administrator-home-page.component.html',
  styleUrls: ['./administrator-home-page.component.scss'],
})
export class AdministratorHomePageComponent implements OnInit {
  imageObject: Array<object> = [
    {
      image: 'assets/images/1.jpg',
      thumbImage: 'assets/images/1.jpg',
      alt: 'alt of image',
      title: 'title of image',
    },
    {
      image: 'assets/images/2.jpg',
      thumbImage: 'assets/images/2.jpg',
      title: 'Image title', //Optional: You can use this key if want to show image with title
      alt: 'Image alt', //Optional: You can use this key if want to show image with alt
    },
    {
      image: 'assets/images/9.jpg',
      thumbImage: 'assets/images/9.jpg',
      title: 'Image title', //Optional: You can use this key if want to show image with title
      alt: 'Image alt', //Optional: You can use this key if want to show image with alt
    },
    {
      image: 'assets/images/4.jpg',
      thumbImage: 'assets/images/4.jpg',
      title: 'Image title', //Optional: You can use this key if want to show image with title
      alt: 'Image alt', //Optional: You can use this key if want to show image with alt
    },
    {
      image: 'assets/images/12.jpg',
      thumbImage: 'assets/images/12.jpg',
      title: 'Image title', //Optional: You can use this key if want to show image with title
      alt: 'Image alt', //Optional: You can use this key if want to show image with alt
    },
  ];
  remarquersResult: any[] = [];
  demandeResult: any[] = [];
  searchQuery: any;

  constructor(
    private router: Router,
    private workOfArtService: WorkOfArtService,
    private demandService: DemandService
  ) {}
  ngOnInit(): void {
    this.initData();
  }

  initData() {
    let params = {
      page: 1,
      limit: 2,
    };
    let filter = '?limit=2&page=' + 1 + '&requestStatus[in]=["En cours"]';
    forkJoin([this.workOfArtService.getInProgressNotices(params), this.demandService.getDemands(filter)]).subscribe(
      ([workOfArtResults, demandeResults]) => {
        this.remarquersResult = workOfArtResults;
        this.demandeResult = demandeResults;
      }
    );
  }
  onNoticeClick() {
    this.router.navigate(['notices-list'], { queryParams: { filter: 'en-cours' } });
  }
  onDemandeClick() {
    this.router.navigate(['demandes-en-cours']);
  }

  onRecolementClick() {
    this.router.navigate(['recolements-list'], { queryParams: { filter: 'en-cours' } });
  }
  onAlertClick() {
    this.router.navigate(['alerts-list'], { queryParams: { filter: 'en-cours' } });
  }

  onSeachClick() {
    this.router.navigate(['oeuvres-list'], { queryParams: { search: this.searchQuery } });
  }
}
