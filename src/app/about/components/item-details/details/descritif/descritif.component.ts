import { WorkOfArtService } from '@shared/services/work-of-art.service';
import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-descritif',
  templateUrl: './descritif.component.html',
  styleUrls: ['./descritif.component.scss'],
})
export class DescritifComponent implements OnInit {
  domains: any;
  @Input() keyword: string;
  @Input() edit = true;
  domain = 'Sculpture';
  denomination: any;
  selectedDomain = 'Sculpture';
  isCollapsed = false;
  autocompleteItems = ['Item1', 'item2', 'item3'];

  constructor(public WorkOfArtService: WorkOfArtService) {}

  ngOnInit(): void {
    this.domains = this.WorkOfArtService.domaine;
  }
  selectDomain(item: any) {
    this.denomination = item.denominations;
    this.selectedDomain = item.name;
  }
  selectEvent(item: any) {}

  onChangeSearch(val: string) {
    // fetch remote data from here
    // And reassign the 'data' which is binded to 'data' property.
  }

  onFocused(e: any) {
    // do something when input is focused
  }

  onCollapse() {
    this.isCollapsed = !this.isCollapsed;
  }
}
