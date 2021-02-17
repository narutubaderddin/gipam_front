import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AboutRoutingModule } from './about-routing.module';
import { SharedModule } from '@shared';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HomePageComponent } from '@app/about/components/home-page/home-page.component';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { PublicHeaderComponent } from '@app/about/components/public-header/public-header.component';
import { ItemDetailsComponent } from '@app/about/components/item-details/item-details.component';
import { NgbCarouselModule, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ActionsComponent } from './components/item-details/actions/actions.component';
import { AgGridModule } from 'ag-grid-angular';
import { AddActionModalComponent } from './components/item-details/actions/add-action-modal/add-action-modal.component';
import { EditActionModalComponent } from './components/item-details/actions/edit-action-modal/edit-action-modal.component';
import { MovementsComponent } from './components/item-details/movements/movements.component';
import { MovementsService } from '@app/about/components/item-details/movements/movements.service';
import { TimelineComponent } from './components/item-details/timeline/timeline.component';
import { ItemImagesComponent } from './components/item-details/item-images/item-images.component';
import { AboutComponent } from '@app/about/about.component';
import { AutocompleteLibModule } from 'angular-ng-autocomplete';
import { ListWorkOfArtsComponent } from './components/list-work-of-arts/list-work-of-arts.component';
import { AdministratorHomePageComponent } from './components/administrator-home-page/administrator-home-page.component';
import { RequestComponent } from '@app/about/components/list-work-of-arts/request/request.component';
import { PortailComponent } from './components/portail/portail.component';
import { TreeviewModule } from 'ngx-treeview';
import { NgxSliderModule } from '@angular-slider/ngx-slider';
import { AddPropertyRemarquerComponent } from './components/add-property-remarquer/add-property-remarquer.component';

@NgModule({
  declarations: [
    AboutComponent,
    HomePageComponent,
    PublicHeaderComponent,
    ItemDetailsComponent,
    ActionsComponent,
    AddActionModalComponent,
    EditActionModalComponent,
    MovementsComponent,
    TimelineComponent,
    ItemImagesComponent,
    ListWorkOfArtsComponent,
    AdministratorHomePageComponent,
    RequestComponent,
    PortailComponent,
    AddPropertyRemarquerComponent,
  ],
  exports: [PublicHeaderComponent, AddActionModalComponent],
  imports: [
    CommonModule,
    AboutRoutingModule,
    SharedModule,
    ReactiveFormsModule,
    FormsModule,
    NgMultiSelectDropDownModule,
    NgbCarouselModule,
    NgbModule,
    AgGridModule.withComponents([]),
    AutocompleteLibModule,
    TreeviewModule.forRoot(),
    NgxSliderModule,
  ],
  providers: [MovementsService],
})
export class AboutModule {}
