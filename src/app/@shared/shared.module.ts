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

@NgModule({
  imports: [
    CommonModule,
    TranslateModule,
    AgGridModule.withComponents([]),
    NgbTooltipModule,
    NgbModule,
    FormsModule,
    ReactiveFormsModule,
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
  ],
  exports: [LoaderComponent, GridWrapperComponent, CommentDetailsModalComponent],
})
export class SharedModule {}
