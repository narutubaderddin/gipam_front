import { Component, Input, OnInit } from '@angular/core';
import ArtWorksDataModel from '@app/about/models/art-works-model';
import { ArtWorkService } from '@app/about/services/art-work.service';
import { WorkOfArtService } from '@shared/services/work-of-art.service';

@Component({
  selector: 'app-links',
  templateUrl: './links.component.html',
  styleUrls: ['./links.component.scss'],
})
export class LinksComponent implements OnInit {
  @Input() add: false;
  artWorksData: any;
  constructor(private artWorkService: ArtWorkService, private workOfArtService: WorkOfArtService) {}

  ngOnInit(): void {
    const filter = {
      page: 1,
      limit: 10,
    };
    this.workOfArtService.getOeuvres(filter).subscribe(
      (response) => {
        this.artWorksData = response.results;
      },
      (error) => {
        //   //error() callback
        //   this.loading = this.loadingScroll = this.loadingScrollUp = false;
        // },
        // () => {
        //   //complete() callback
        //   this.loading = this.loadingScroll = this.loadingScrollUp = false;
      }
    );
  }

  search(event: any) {
    console.log(event);
    const filter = {
      page: 1,
      limit: 10,
      search: event.query,
    };
    this.workOfArtService.getOeuvres(filter).subscribe(
      (response) => {
        this.artWorksData = response.results;
        console.log(response);
      },
      (error) => {
        //   //error() callback
        //   this.loading = this.loadingScroll = this.loadingScrollUp = false;
        // },
        // () => {
        //   //complete() callback
        //   this.loading = this.loadingScroll = this.loadingScrollUp = false;
      }
    );
  }
}
