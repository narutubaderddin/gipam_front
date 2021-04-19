import { NgModule, Provider } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AgGridModule } from 'ag-grid-angular';
import { LoaderComponent } from './loader/loader.component';
import { GridWrapperComponent } from './components/datatables/grid-wrapper/grid-wrapper.component';
import { TranslateModule } from '@ngx-translate/core';
import { StatusRendererComponent } from './components/datatables/status-renderer/status-renderer.component';
import { NgbModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { CommentDetailsModalComponent } from './components/datatables/status-renderer/comment-details-modal/comment-details-modal.component';
import { EditActionRendererComponent } from './components/datatables/edit-action-renderer/edit-action-renderer.component';
import { ShowMovementDetailsRendererComponent } from './components/datatables/show-movement-details-renderer/show-movement-details-renderer.component';
import { CustomHeaderRendererComponent } from './components/datatables/custom-header-renderer/custom-header-renderer.component';
import { CustomLoadingOverlayComponent } from './components/datatables/custom-loading-overlay/custom-loading-overlay.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { GridActionRendererComponent } from './components/datatables/grid-action-renderer/grid-action-renderer.component';
import { VisibleCatalogRendererComponent } from './components/datatables/visible-catalog-renderer/visible-catalog-renderer.component';
import { AutocompleteLibModule } from 'angular-ng-autocomplete';
import { DescriptionBlocComponent } from './components/add-remarquer-blocs/description-bloc/description-bloc.component';
import { AdministrativeMovementBlocComponent } from './components/add-remarquer-blocs/administrative-movement-bloc/administrative-movement-bloc.component';
import { GeographicMovementBlocComponent } from './components/add-remarquer-blocs/geographic-movement-bloc/geographic-movement-bloc.component';
import { ExtraNoticeItemsBlocComponent } from './components/add-remarquer-blocs/extra-notice-items-bloc/extra-notice-items-bloc.component';
import { AuthorBlocComponent } from './components/add-remarquer-blocs/author-bloc/author-bloc.component';
import { StatusBlocComponent } from './components/add-remarquer-blocs/status-bloc/status-bloc.component';
import { TagInputModule } from 'ngx-chips';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RemarquerDetailsLinkRendererComponent } from './components/datatables/remarquer-details-link-renderer/remarquer-details-link-renderer.component';
import { BeingCreatedRemarquersActionsRendererComponent } from './components/datatables/being-created-remarquers-actions-renderer/being-created-remarquers-actions-renderer.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { StatusTypeRenderComponent } from './components/datatables/status-type-render/status-type-render.component';
import { RecoleRendererComponent } from './components/datatables/recole-renderer/recole-renderer.component';
import { AccordionSectionComponent } from './components/accordion-section/accordion-section.component';
import { NgxHorizontalTimelineModule } from 'ngx-horizontal-timeline';
import { FullWidthCellRendererComponent as FullWidthCellRenderer } from './components/datatables/full-width-cell-renderer/full-width-cell-renderer.component';
import { ImageViewerComponent } from './components/datatables/image-viewer/image-viewer.component';
import { DomainsActionsRendererComponent } from './components/datatables/domains-actions-renderer/domains-actions-renderer.component';
import { DenominationsActionsRendererComponent } from './components/datatables/denominations-actions-renderer/denominations-actions-renderer.component';
import { FlashFormErrorsDirective } from './directives/flash-form-errors.directive';
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

@NgModule({
  imports: [
    CommonModule,
    TranslateModule,
    AgGridModule.withComponents([FullWidthCellRenderer]),
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
  ],
  declarations: [
    LoaderComponent,
    GridWrapperComponent,
    StatusRendererComponent,
    CommentDetailsModalComponent,
    EditActionRendererComponent,
    ShowMovementDetailsRendererComponent,
    CustomHeaderRendererComponent,
    CustomLoadingOverlayComponent,
    GridActionRendererComponent,
    VisibleCatalogRendererComponent,
    DescriptionBlocComponent,
    AdministrativeMovementBlocComponent,
    GeographicMovementBlocComponent,
    ExtraNoticeItemsBlocComponent,
    AuthorBlocComponent,
    StatusBlocComponent,
    RemarquerDetailsLinkRendererComponent,
    BeingCreatedRemarquersActionsRendererComponent,
    StatusTypeRenderComponent,
    RecoleRendererComponent,
    AccordionSectionComponent,
    FullWidthCellRenderer,
    ImageViewerComponent,
    DomainsActionsRendererComponent,
    DenominationsActionsRendererComponent,
    FlashFormErrorsDirective,
    NgDataTableComponent,
    ActionsCellComponent,
    StatusTypeComponentRenderComponent,
    VisibleCatalogComponentRenderComponent,
  ],
  exports: [
    LoaderComponent,
    GridWrapperComponent,
    CommentDetailsModalComponent,
    DescriptionBlocComponent,
    AdministrativeMovementBlocComponent,
    GeographicMovementBlocComponent,
    ExtraNoticeItemsBlocComponent,
    AuthorBlocComponent,
    StatusBlocComponent,
    AccordionSectionComponent,
    FlashFormErrorsDirective,
    NgDataTableComponent,
  ],
})
export class SharedModule {}
