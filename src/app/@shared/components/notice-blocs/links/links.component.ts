import { Component, Input, OnInit } from '@angular/core';
import ArtWorksDataModel from '@app/about/models/art-works-model';
import { ArtWorkService } from '@app/about/services/art-work.service';
import { ColDef, ColumnApi, GridApi } from 'ag-grid-community';
import { IDropdownSettings } from 'ng-multiselect-dropdown';

@Component({
  selector: 'app-links',
  templateUrl: './links.component.html',
  styleUrls: ['./links.component.scss'],
})
export class LinksComponent implements OnInit {
  @Input() add: false;
  refs = [' 125', ' 222', ' 342'];
  artWorksData: any;
  constructor(private artWorkService: ArtWorkService) {}

  ngOnInit(): void {
    this.artWorkService.getArtWorksData().subscribe((artWorksData: ArtWorksDataModel) => {
      this.artWorksData = artWorksData.results;
      console.log(this.artWorksData);
    });
  }
}
