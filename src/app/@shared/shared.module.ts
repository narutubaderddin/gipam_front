import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoaderComponent } from './loader/loader.component';
import { TranslateModule } from '@ngx-translate/core';
import { NgbModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AutocompleteLibModule } from 'angular-ng-autocomplete';
import { DescriptionBlocComponent } from './components/add-remarquer-blocs/description-bloc/description-bloc.component';
import { AdministrativeMovementBlocComponent } from './components/add-remarquer-blocs/administrative-movement-bloc/administrative-movement-bloc.component';
import { GeographicMovementBlocComponent } from './components/add-remarquer-blocs/geographic-movement-bloc/geographic-movement-bloc.component';
import { ExtraNoticeItemsBlocComponent } from './components/add-remarquer-blocs/extra-notice-items-bloc/extra-notice-items-bloc.component';
import { AuthorBlocComponent } from './components/add-remarquer-blocs/author-bloc/author-bloc.component';
import { StatusBlocComponent } from './components/add-remarquer-blocs/status-bloc/status-bloc.component';
import { TagInputModule } from 'ngx-chips';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgxPaginationModule } from 'ngx-pagination';
import { AccordionSectionComponent } from './components/accordion-section/accordion-section.component';
import { NgxHorizontalTimelineModule } from 'ngx-horizontal-timeline';
import { FlashFormErrorsDirective } from './directives/flash-form-errors.directive';
import { AddDescriptionsComponent } from './components/notice-blocs/add-descriptions/add-descriptions.component';
import { NgDataTableComponent } from './components/ng-dataTables/ng-data-table/ng-data-table.component';
import { TableModule } from 'primeng/table';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { TooltipModule } from 'primeng/tooltip';
import { CalendarModule } from 'primeng/calendar';
import { PaginatorModule } from 'primeng/paginator';
import { ActionsCellComponent } from './components/ng-dataTables/actions-cell/actions-cell.component';
import { StatusTypeComponentRenderComponent } from './components/ng-dataTables/status-type-component-render/status-type-component-render.component';
import { VisibleCatalogComponentRenderComponent } from './components/ng-dataTables/visible-catalog-component-render/visible-catalog-component-render.component';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { MultiSelectModule } from 'primeng/multiselect';
import { SelectButtonRenderComponent } from './components/ng-dataTables/select-button-render/select-button-render.component';
import { SelectButtonModule } from 'primeng/selectbutton';
import { DropdownModule } from 'primeng/dropdown';
import { StatusComponent } from './components/notice-blocs/status/status.component';
import { AttachmentsComponent } from './components/notice-blocs/attachments/attachments.component';
import { AddImgModalComponent } from './components/notice-blocs/item-images/add-img-modal/add-img-modal.component';
import { ItemImagesComponent } from './components/notice-blocs/item-images/item-images.component';
import { LinksComponent } from './components/notice-blocs/links/links.component';
import { HypertextLinksComponent } from './components/notice-blocs//links/hypertext-links/hypertext-links.component';
import { GalleriaModule } from 'primeng/galleria';
import { NgFileDragDropModule } from 'ng-file-drag-drop';
import { CarouselModule } from 'primeng/carousel';
import { DialogModule } from 'primeng/dialog';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { RemarquerDetailsLinkRendererComponent } from './components/ng-dataTables/remarquer-details-link-renderer/remarquer-details-link-renderer.component';
import { ToastModule } from 'primeng/toast';
import { ChipModule } from 'primeng/chip';
import { InProgressNoticeRendererComponent } from './components/ng-dataTables/in-progress-notice-renderer/in-progress-notice-renderer.component';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    CommonModule,
    TranslateModule,
    NgbTooltipModule,
    NgbModule,
    NgxPaginationModule,
    FormsModule,
    ReactiveFormsModule,
    AutocompleteLibModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    TagInputModule,
    NgxHorizontalTimelineModule,
    TableModule,
    InputTextModule,
    ButtonModule,
    RippleModule,
    TooltipModule,
    CalendarModule,
    PaginatorModule,
    NgMultiSelectDropDownModule,
    MultiSelectModule,
    SelectButtonModule,
    DropdownModule,
    CalendarModule,
    GalleriaModule,
    NgFileDragDropModule,
    CarouselModule,
    DialogModule,
    AutoCompleteModule,
    ToastModule,
    ChipModule,
    RouterModule,
  ],
  declarations: [
    LoaderComponent,
    DescriptionBlocComponent,
    AdministrativeMovementBlocComponent,
    GeographicMovementBlocComponent,
    ExtraNoticeItemsBlocComponent,
    AuthorBlocComponent,
    StatusBlocComponent,
    AccordionSectionComponent,
    FlashFormErrorsDirective,
    NgDataTableComponent,
    ActionsCellComponent,
    StatusTypeComponentRenderComponent,
    VisibleCatalogComponentRenderComponent,
    SelectButtonRenderComponent,
    AddDescriptionsComponent,
    StatusComponent,
    AttachmentsComponent,
    AddImgModalComponent,
    ItemImagesComponent,
    LinksComponent,
    HypertextLinksComponent,
    RemarquerDetailsLinkRendererComponent,
    InProgressNoticeRendererComponent,
  ],
  exports: [
    LoaderComponent,
    DescriptionBlocComponent,
    AdministrativeMovementBlocComponent,
    GeographicMovementBlocComponent,
    ExtraNoticeItemsBlocComponent,
    AuthorBlocComponent,
    StatusBlocComponent,
    AccordionSectionComponent,
    FlashFormErrorsDirective,
    NgDataTableComponent,
    AddDescriptionsComponent,
    StatusComponent,
    AttachmentsComponent,
    AddImgModalComponent,
    ItemImagesComponent,
    LinksComponent,
    HypertextLinksComponent,
  ],
})
export class SharedModule {}
