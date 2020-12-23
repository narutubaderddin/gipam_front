import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AboutRoutingModule } from './about-routing.module';
import { SharedModule } from '@shared';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HomePageComponent } from '@app/about/components/home-page/home-page.component';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { PublicHeaderComponent } from '@app/about/components/public-header/public-header.component';

@NgModule({
  declarations: [HomePageComponent, PublicHeaderComponent],
  exports: [PublicHeaderComponent],
  imports: [
    CommonModule,
    AboutRoutingModule,
    SharedModule,
    ReactiveFormsModule,
    FormsModule,
    NgMultiSelectDropDownModule,
  ],
})
export class AboutModule {}
