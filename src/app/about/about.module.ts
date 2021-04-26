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
import { AddDescriptionsComponent } from './components/add-property-remarquer/add-descriptions/add-descriptions.component';
import { BsDatepickerModule, BsDatepickerConfig, DatepickerModule } from 'ngx-bootstrap/datepicker';
import { setTheme } from 'ngx-bootstrap/utils';
import { NoticeListComponent } from './components/notice-list/notice-list.component';
import { RecolementListComponent } from './components/recolement-list/recolement-list.component';
import { AlertListComponent } from './components/alert-list/alert-list.component';
import { InProgressDemandComponent } from '@app/about/components/in-progress-demand/in-progress-demand.component';
import { HttpClientModule } from '@angular/common/http';

import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { CalendarModule } from 'primeng/calendar';
import { SliderModule } from 'primeng/slider';
import { MultiSelectModule } from 'primeng/multiselect';
import { ContextMenuModule } from 'primeng/contextmenu';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { ProgressBarModule } from 'primeng/progressbar';
import { InputTextModule } from 'primeng/inputtext';
import { RatingModule } from 'primeng/rating';
import { InputSwitchModule } from 'primeng/inputswitch';
import { TooltipModule } from 'primeng/tooltip';
import { CheckboxModule } from 'primeng/checkbox';
import { SelectButtonModule } from 'primeng/selectbutton';
import { TabsRefComponent } from './components/tabs-ref/tabs-ref.component';
import { DomainsComponent } from './components/tabs-ref/domains/domains.component';
import { DenominationsComponent } from './components/tabs-ref/denominations/denominations.component';
import { RippleModule } from 'primeng/ripple';
import { MessageService } from 'primeng/api';
import { StylesComponent } from './components/tabs-ref/styles/styles.component';
import { MaterialTechniqueComponent } from './components/tabs-ref/material-technique/material-technique.component';
import { ModalTabsRefComponent } from './components/tabs-ref/modal-tabs-ref/modal-tabs-ref.component';
import { EpoquesComponent } from './components/tabs-ref/epoques/epoques.component';
import { DepositTypesComponent } from '@app/about/components/tabs-ref/depositTypes/depositTypes.component';
import { ReportTypesComponent } from '@app/about/components/tabs-ref/reportTypes/reportTypes.component';
import { ActionReportTypesComponent } from '@app/about/components/tabs-ref/actionReportTypes/actionReportTypes.component';
import { CategoryComponent } from '@app/about/components/tabs-ref/category/category.component';

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
    AddDescriptionsComponent,
    NoticeListComponent,
    RecolementListComponent,
    AlertListComponent,
    InProgressDemandComponent,
    TabsRefComponent,
    DomainsComponent,
    DenominationsComponent,
    StylesComponent,
    MaterialTechniqueComponent,
    ModalTabsRefComponent,
    EpoquesComponent,
    DepositTypesComponent,
    ReportTypesComponent,
    ActionReportTypesComponent,
    CategoryComponent,
  ],
  exports: [PublicHeaderComponent, AddActionModalComponent],
  imports: [
    CommonModule,
    AboutRoutingModule,
    SharedModule,
    RippleModule,
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
    HttpClientModule,
    TableModule,
    CalendarModule,
    SliderModule,
    DialogModule,
    MultiSelectModule,
    ContextMenuModule,
    DropdownModule,
    ButtonModule,
    ToastModule,
    InputTextModule,
    ProgressBarModule,
    HttpClientModule,
    FormsModule,
    RatingModule,
    InputSwitchModule,
    TooltipModule,
    CheckboxModule,
    SelectButtonModule,
  ],
  providers: [MovementsService, BsDatepickerConfig, MessageService],
})
export class AboutModule {}
