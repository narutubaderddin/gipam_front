import { Component, OnInit } from '@angular/core';
import { WorkOfArtService } from '@shared/services/work-of-art.service';

@Component({
  selector: 'app-add-property-remarquer',
  templateUrl: './add-property-remarquer.component.html',
  styleUrls: ['./add-property-remarquer.component.scss'],
})
export class AddPropertyRemarquerComponent implements OnInit {
  domains = this.WorkOfArtService.domaine;
  keyword = 'name';
  constructor(public WorkOfArtService: WorkOfArtService) {}

  ngOnInit(): void {}

  selectEvent(item: any) {}

  onChangeSearch(val: string) {
    // fetch remote data from here
    // And reassign the 'data' which is binded to 'data' property.
  }

  onFocused(e: any) {
    // do something when input is focused
  }
}
