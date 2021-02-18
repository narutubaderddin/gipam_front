import { NgModule } from '@angular/core';
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

@NgModule({
  imports: [
    CommonModule,
    TranslateModule,
    AgGridModule.withComponents([]),
    NgbTooltipModule,
    NgbModule,
    FormsModule,
    ReactiveFormsModule,
    AutocompleteLibModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    TagInputModule,
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
  ],
})
export class SharedModule {}
