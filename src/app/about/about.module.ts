import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AboutRoutingModule } from './about-routing.module';
import { SharedModule } from '@shared';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HomePageComponent } from '@app/about/components/home-page/home-page.component';

@NgModule({
  declarations: [HomePageComponent],
  exports: [],
  imports: [CommonModule, AboutRoutingModule, SharedModule, ReactiveFormsModule, FormsModule],
})
export class AboutModule {}
