import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AboutRoutingModule } from './about-routing.module';
import { SharedModule } from '@shared';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
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
import { PortailItemDetailsComponent } from './components/portail-item-details/portail-item-details.component';
import { PortailItemImageComponent } from './components/portail-item-details/portail-item-image/portail-item-image.component';
import { ObservationsComponent } from './components/item-details/observations/observations.component';
import { DescritifComponent } from './components/item-details/details/descritif/descritif.component';
import { StatusComponent } from './components/item-details/details/status/status.component';
import { AuthorComponent } from './components/item-details/details/author/author.component';
import { TagInputModule } from 'ngx-chips';
import { ProofsInProgressComponent } from './components/administrator-home-page/proofs-in-progress/proofs-in-progress.component';
import { Ng7BootstrapBreadcrumbModule } from 'ng7-bootstrap-breadcrumb';
import { InProgressAlertsComponent } from './components/administrator-home-page/in-progress-alerts/in-progress-alerts.component';
import { DepositorComponent } from './components/item-details/details/depositor/depositor.component';
import { ProofsDetailsComponent } from './components/administrator-home-page/proofs-in-progress/proofs-details/proofs-details.component';
import { PortailImgDetailsComponent } from './components/portail-item-details/portail-img-details/portail-img-details.component';
import { SidebarNavComponent } from './components/public-header/sidebar-nav/sidebar-nav.component';
import { DynamicComponent } from './components/item-details/dynamic/dynamic.component';
import { AddImgModalComponent } from './components/item-details/item-images/add-img-modal/add-img-modal.component';
import { AttachmentsComponent } from './components/item-details/attachments/attachments.component';
import { NgxHorizontalTimelineModule } from 'ngx-horizontal-timeline';
import { LinksComponent } from './components/item-details/links/links.component';
import { LastMovementComponent } from './components/item-details/movements/last-movement/last-movement.component';
import { NgImageSliderModule } from 'ng-image-slider';
import { NgWizardModule, NgWizardConfig, THEME } from 'ng-wizard';
import { FullWidthCellRendererComponent as FullWidthCellRenderer } from '@app/@shared/components/datatables/full-width-cell-renderer/full-width-cell-renderer.component';
import { NoticeBeingCreatedComponent } from './components/administrator-home-page/notice-being-created/notice-being-created.component';
import { NgFileDragDropModule } from 'ng-file-drag-drop';
import { HypertextLinksComponent } from './components/item-details/links/hypertext-links/hypertext-links.component';
import { BsDatepickerModule, BsDatepickerConfig, DatepickerModule } from 'ngx-bootstrap/datepicker';
import { setTheme } from 'ngx-bootstrap/utils';
setTheme('bs4');
const ngWizardConfig: NgWizardConfig = {
  theme: THEME.default,
};
@NgModule({
  declarations: [
    AboutComponent,
    PublicHeaderComponent,
    ItemDetailsComponent,
    ActionsComponent,
    AddActionModalComponent,
    EditActionModalComponent,
    MovementsComponent,
    ItemImagesComponent,
    ListWorkOfArtsComponent,
    AdministratorHomePageComponent,
    RequestComponent,
    PortailComponent,
    AddPropertyRemarquerComponent,
    PortailItemDetailsComponent,
    PortailItemImageComponent,
    ObservationsComponent,
    DescritifComponent,
    StatusComponent,
    AuthorComponent,
    ProofsInProgressComponent,
    InProgressAlertsComponent,
    ProofsDetailsComponent,
    PortailImgDetailsComponent,
    DepositorComponent,
    SidebarNavComponent,
    DynamicComponent,
    AddImgModalComponent,
    AttachmentsComponent,
    LinksComponent,
    LastMovementComponent,
    NoticeBeingCreatedComponent,
    HypertextLinksComponent,
  ],
  exports: [PublicHeaderComponent, AddActionModalComponent],
  imports: [
    CommonModule,
    AboutRoutingModule,
    SharedModule,
    NgWizardModule.forRoot(ngWizardConfig),
    NgFileDragDropModule,
    ReactiveFormsModule,
    FormsModule,
    NgMultiSelectDropDownModule,
    NgbCarouselModule,
    NgbModule,
    AgGridModule.withComponents([FullWidthCellRenderer]),
    AutocompleteLibModule,
    TreeviewModule.forRoot(),
    NgxSliderModule,
    NgxHorizontalTimelineModule,
    TagInputModule,
    Ng7BootstrapBreadcrumbModule,
    NgImageSliderModule,
    BsDatepickerModule.forRoot(),
    DatepickerModule.forRoot(),
  ],
  providers: [MovementsService, , BsDatepickerConfig],
})
export class AboutModule {}
