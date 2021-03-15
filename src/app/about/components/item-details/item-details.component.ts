import { Component, ElementRef, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { NgbCarouselConfig } from '@ng-bootstrap/ng-bootstrap';
import { NotificationsService } from 'angular2-notifications';

@Component({
  selector: 'app-item-details',
  templateUrl: './item-details.component.html',
  styleUrls: ['./item-details.component.scss'],
})
export class ItemDetailsComponent implements OnInit {
  @ViewChildren('accordionSectionDOM', { read: ElementRef }) accordionsDOM: QueryList<ElementRef>;
  @ViewChild('accordionDOM') public parentRef: ElementRef<HTMLElement>;
  page: any = 2;
  edit = false;
  moreDetails = ['19-01-2020', '23-02-2020', '01-03-2020', '25-03-2020', '20-04-2020'];
  isCollapsed: boolean = false;
  constructor(config: NgbCarouselConfig, private notificationsService: NotificationsService) {
    config.interval = 10000;
    config.wrap = false;
    config.keyboard = false;
    config.pauseOnHover = false;
  }

  ngOnInit() {}

  page1() {
    this.page = 1;
  }
  page2() {
    this.page = 2;
  }
  page3() {
    this.page = 3;
  }
  page4() {
    this.page = 4;
  }
  page5() {
    this.page = 5;
  }
  page6() {
    this.page = 6;
  }
  page7() {
    this.page = 7;
  }
  onEditMode() {
    this.edit = !this.edit;
  }
  onSave() {
    this.notificationsService.success('Succès', 'l\'Oeuvre "n° inventaire" a été mise à jour avec succès');
    this.edit = false;
  }
}
