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

@NgModule({
  declarations: [
    HomePageComponent,
    PublicHeaderComponent,
    ItemDetailsComponent,
    ActionsComponent,
    AddActionModalComponent,
    EditActionModalComponent,
    MovementsComponent,
    TimelineComponent,
    ItemImagesComponent,
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
  ],
  providers: [MovementsService],
})
export class AboutModule {}
