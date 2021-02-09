import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { WorkOfArtService } from '@shared/services/work-of-art.service';
import { TreeviewConfig, TreeviewItem } from 'ngx-treeview';
import { Options } from '@angular-slider/ngx-slider';

@Component({
  selector: 'app-portail',
  templateUrl: './portail.component.html',
  styleUrls: ['./portail.component.scss'],
})
export class PortailComponent implements OnInit {
  oeuvres = this.WorkOfArtService.oeuvres;
  oeuvreToShow: any;
  openType = false;
  filter = false;
  keyword = 'name';
  domains = this.WorkOfArtService.getDomains();

  dropdownEnabled = true;
  values: number[];
  config = TreeviewConfig.create({
    hasAllCheckBox: true,
    hasFilter: true,
    hasCollapseExpand: true,
    decoupleChildFromParent: false,
    maxHeight: 400,
  });
  value: number = 40;
  highValue: number = 60;
  options: Options = {
    floor: 0,
    ceil: 9999,
  };
  constructor(private WorkOfArtService: WorkOfArtService, private router: Router) {}

  ngOnInit(): void {
    this.oeuvreToShow = this.oeuvres;
  }
  search(event: any) {}

  openFilter() {
    if (!this.filter) {
      return (this.filter = true);
    }
    return (this.filter = false);
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

  onFilterChange(value: string): void {
    console.log('filter:', value);
  }

  details() {
    this.router.navigate(['item-details']);
  }
}
