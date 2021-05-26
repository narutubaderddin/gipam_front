import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { WorkOfArtService } from '@shared/services/work-of-art.service';
import { RequestService } from '@shared/services/request.service';

@Component({
  selector: 'app-portail-img-details',
  templateUrl: './portail-img-details.component.html',
  styleUrls: ['./portail-img-details.component.scss'],
})
export class PortailImgDetailsComponent implements OnInit {
  source: string;
  showMore: boolean;

  constructor(
    private route: ActivatedRoute,
    private workOfArtService: WorkOfArtService,
    private requestService: RequestService
  ) {}
  isCollapsed: boolean = true;
  artWorkId: string;
  artWork: any;
  loading: boolean = false;
  ngOnInit(): void {
    this.artWorkId = this.route.snapshot.paramMap.get('id');
    this.loading = true;
    this.workOfArtService.getOeuvreDetails(this.artWorkId).subscribe(
      (response) => {
        this.artWork = response.artwork;
        this.loading = false;
      },
      (error) => {
        //error() callback
        this.loading = false;
      },
      () => {
        //complete() callback
        this.loading = false;
      }
    );
  }
  showDetails(e: any) {
    this.showMore = e;
  }
  exportArtWork() {
    const artWorksIds: any = [this.artWorkId];
    this.requestService.exportRequest(artWorksIds).subscribe((response: Response | any) => {
      this.requestService.manageFileResponseDownload(response, 'Oeuvre Graphique');
    });
  }
}
