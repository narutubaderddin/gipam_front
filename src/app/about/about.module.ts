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
import { AddActionModalComponent } from './components/item-details/actions/add-action-modal/add-action-modal.component';
import { EditActionModalComponent } from './components/item-details/actions/edit-action-modal/edit-action-modal.component';
import { MovementsComponent } from './components/item-details/movements/movements.component';
import { MovementsService } from '@app/about/components/item-details/movements/movements.service';
import { AboutComponent } from '@app/about/about.component';
import { AutocompleteLibModule } from 'angular-ng-autocomplete';
import { ListWorkOfArtsComponent } from './components/list-work-of-arts/list-work-of-arts.component';
import { AdministratorHomePageComponent } from './components/administrator-home-page/administrator-home-page.component';
import { RequestComponent } from '@app/about/components/list-work-of-arts/request/request.component';
import { PortailComponent } from './components/portail/portail.component';
import { TreeviewModule } from 'ngx-treeview';
import { NgxSliderModule } from '@angular-slider/ngx-slider';
import { AddRemarquerComponent } from './components/add-remarquer/add-remarquer.component';
import { PortailItemDetailsComponent } from './components/portail-item-details/portail-item-details.component';
import { PortailItemImageComponent } from './components/portail-item-details/portail-item-image/portail-item-image.component';
import { ObservationsComponent } from './components/item-details/observations/observations.component';
import { DescritifComponent } from './components/item-details/descritif/descritif.component';
import { TagInputModule } from 'ngx-chips';
import { ProofsInProgressComponent } from './components/administrator-home-page/proofs-in-progress/proofs-in-progress.component';
import { Ng7BootstrapBreadcrumbModule } from 'ng7-bootstrap-breadcrumb';
import { InProgressAlertsComponent } from './components/administrator-home-page/in-progress-alerts/in-progress-alerts.component';
import { ProofsDetailsComponent } from './components/administrator-home-page/proofs-in-progress/proofs-details/proofs-details.component';
import { PortailImgDetailsComponent } from './components/portail-item-details/portail-img-details/portail-img-details.component';
import { SidebarNavComponent } from './components/public-header/sidebar-nav/sidebar-nav.component';
import { DynamicComponent } from './components/item-details/dynamic/dynamic.component';
import { NgxHorizontalTimelineModule } from 'ngx-horizontal-timeline';
import { LastMovementComponent } from './components/item-details/movements/last-movement/last-movement.component';
import { NgImageSliderModule } from 'ng-image-slider';
import { NgWizardModule, NgWizardConfig, THEME } from 'ng-wizard';
import { NoticeBeingCreatedComponent } from './components/administrator-home-page/notice-being-created/notice-being-created.component';
import { NgFileDragDropModule } from 'ng-file-drag-drop';
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
import { TypeMvtComponent } from './components/tabs-ref/type-mvt/type-mvt.component';
import { MovementActionTypesComponent } from './components/tabs-ref/movement-action-types/movement-action-types.component';
import { ModalMvtActionTypesComponent } from './components/tabs-ref/movement-action-types/modal-mvt-action-types/modal-mvt-action-types.component';
import { ReportSubTypesComponent } from './components/tabs-ref/report-sub-types/report-sub-types.component';
import { GalleriaModule } from 'primeng/galleria';
import { EstablishmentsComponent } from '@app/about/components/tabs-ref/establishments/establishments.component';
import { ModalReportSubTypesComponent } from './components/tabs-ref/report-sub-types/modal-report-sub-types/modal-report-sub-types.component';
// import { ServicesComponent } from '@app/about/components/tabs-ref/establishment/establishments.component';
import { MinistryComponent } from './components/tabs-ref/ministry/ministry.component';
import { BuildingsComponent } from './components/tabs-ref/buildings/buildings.component';
import { CommunesComponent } from './components/tabs-ref/communes/communes.component';
import { ArtWorksPipe } from '@app/about/pipes/art-works.pipe';
import { ArtWorksDataPipe } from '@app/about/pipes/art-works-data.pipe';
import { FormValuePipe } from './pipes/form-value.pipe';
import { SubDivisionsComponent } from '@app/about/components/tabs-ref/subDivisions/subDivisions.component';
import { RegionsComponent } from '@app/about/components/tabs-ref/regions/regions.component';
import { DepartmentsComponent } from './components/tabs-ref/departments/departments.component';
import { LocalisationTypeComponent } from './components/tabs-ref/localisation-type/localisation-type.component';
import { ServicesComponent } from '@app/about/components/tabs-ref/services/services.component';
import { SitesComponent } from '@app/about/components/tabs-ref/sites/sites.component';
import { EstablishmentTypesComponent } from '@app/about/components/tabs-ref/establishmentTypes/establishmentTypes.component';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { FieldService } from '@shared/services/field.service';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { RadioButtonModule } from 'primeng/radiobutton';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { CorrespondentsComponent } from './components/tabs-ref/correspondents/correspondents.component';
import { ResponsibleComponent } from './components/tabs-ref/responsible/responsible.component';
import { EntryModesComponent } from '@app/about/components/tabs-ref/entryModes/entryModes.component';
import { AuthorTypesComponent } from '@app/about/components/tabs-ref/authorTypes/authorTypes.component';
import { AttachmentTypesComponent } from '@app/about/components/tabs-ref/attachmentTypes/attachmentTypes.component';
import { PhotographyTypesComponent } from '@app/about/components/tabs-ref/photographyTypes/photographyTypes.component';
import { AutosizeModule } from 'ngx-autosize';
import { RequestService } from '@shared/services/request.service';
import { EstablishmentService } from '@shared/services/establishment.service';
import { DemandService } from '@shared/services/demand.service';
import { PersonsComponent } from '@app/about/components/tabs-ref/persons/persons.component';
import { DepositorsComponent } from '@app/about/components/tabs-ref/depositors/depositors.component';
import { RoomsComponent } from '@app/about/components/tabs-ref/rooms/rooms.component';
import { AuthorsComponent } from '@app/about/components/tabs-ref/authors/authors.component';
import { ReportModelsComponent } from '@app/about/components/tabs-ref/report-models/report-models.component';

import { ItemDetailsPdfComponent } from './components/item-details/pdf/item-details-pdf/item-details-pdf.component';
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
    ListWorkOfArtsComponent,
    AdministratorHomePageComponent,
    RequestComponent,
    PortailComponent,
    AddRemarquerComponent,
    PortailItemDetailsComponent,
    PortailItemImageComponent,
    ObservationsComponent,
    ArtWorksPipe,
    ArtWorksDataPipe,
    DescritifComponent,
    ProofsInProgressComponent,
    InProgressAlertsComponent,
    ProofsDetailsComponent,
    PortailImgDetailsComponent,
    SidebarNavComponent,
    DynamicComponent,
    LastMovementComponent,
    NoticeBeingCreatedComponent,
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
    TypeMvtComponent,
    MovementActionTypesComponent,
    ModalMvtActionTypesComponent,
    ReportSubTypesComponent,
    ModalReportSubTypesComponent,
    EstablishmentsComponent,
    EstablishmentTypesComponent,
    MinistryComponent,
    BuildingsComponent,
    SubDivisionsComponent,
    RegionsComponent,
    ServicesComponent,
    SitesComponent,
    FormValuePipe,
    CommunesComponent,
    DepartmentsComponent,
    LocalisationTypeComponent,
    CorrespondentsComponent,
    ResponsibleComponent,
    EntryModesComponent,
    AuthorTypesComponent,
    AttachmentTypesComponent,
    PhotographyTypesComponent,
    PersonsComponent,
    DepositorsComponent,
    ItemDetailsPdfComponent,
    RoomsComponent,
    AuthorsComponent,
    ReportModelsComponent,
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
    GalleriaModule,
    ProgressSpinnerModule,
    InfiniteScrollModule,
    RadioButtonModule,
    AutoCompleteModule,
    AutosizeModule,
  ],
  providers: [
    MovementsService,
    BsDatepickerConfig,
    MessageService,
    ArtWorksDataPipe,
    ArtWorksPipe,
    FieldService,
    RequestService,
    EstablishmentService,
    DemandService,
  ],
})
export class AboutModule {}
