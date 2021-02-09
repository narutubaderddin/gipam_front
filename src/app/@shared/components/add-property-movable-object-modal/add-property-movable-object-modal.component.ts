import { WorkOfArtService } from '@shared/services/work-of-art.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-add-property-movable-object-modal',
  templateUrl: './add-property-movable-object-modal.component.html',
  styleUrls: ['./add-property-movable-object-modal.component.scss'],
})
export class AddPropertyMovableObjectModalComponent implements OnInit {
  domains = this.WorkOfArtService.domaine;
  openType = false;
  filter = false;
  keyword = 'name';
  constructor(private WorkOfArtService: WorkOfArtService) {}

  ngOnInit(): void {
    console.log(this.domains);
  }
  selectEvent(item: any) {
    // do something with selected item
  }

  onChangeSearch(val: string) {
    // fetch remote data from here
    // And reassign the 'data' which is binded to 'data' property.
  }

  onFocused(e: any) {
    // do something when input is focused
  }
}
