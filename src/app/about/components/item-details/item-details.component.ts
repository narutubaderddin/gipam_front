import { Component, ElementRef, OnInit, QueryList, ViewChild, ViewChildren, Input } from '@angular/core';
import { NgbCarouselConfig } from '@ng-bootstrap/ng-bootstrap';
import { NotificationsService } from 'angular2-notifications';
import { SharedService } from '@shared/services/shared.service';

@Component({
  selector: 'app-item-details',
  templateUrl: './item-details.component.html',
  styleUrls: ['./item-details.component.scss'],
})
export class ItemDetailsComponent implements OnInit {
  @ViewChildren('accordionSectionDOM', { read: ElementRef }) accordionsDOM: QueryList<ElementRef>;
  @ViewChild('accordionDOM') public parentRef: ElementRef<HTMLElement>;
  // @Input() collapseSideNav: boolean;
  page: any = 2;
  edit = false;
  moreDetails = ['19-01-2020', '23-02-2020', '01-03-2020', '25-03-2020', '20-04-2020'];
  // isCollapsed: boolean = false;
  dynamic: boolean = false;
  openImg: boolean = false;

  get menuClosed(): boolean {
    console.log('menuOpened', this.sharedService.collapseMenu);

    return this.sharedService.collapseMenu;
  }

  constructor(
    config: NgbCarouselConfig,
    private notificationsService: NotificationsService,
    private sharedService: SharedService
  ) {
    config.interval = 10000;
    config.wrap = false;
    config.keyboard = false;
    config.pauseOnHover = false;
  }

  ngOnInit() {
    this.menuClosed;
  }
  f1(e: any) {
    this.dynamic = e;
    console.log(this.dynamic);
  }
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

  showImg() {
    this.openImg = !this.openImg;
    // console.log(this.openImg);
  }
}
