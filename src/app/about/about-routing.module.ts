import { AdministratorHomePageComponent } from './components/administrator-home-page/administrator-home-page.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomePageComponent } from './components/home-page/home-page.component';
import { AboutComponent } from '@app/about/about.component';
import { ItemDetailsComponent } from '@app/about/components/item-details/item-details.component';
import { ListWorkOfArtsComponent } from './components/list-work-of-arts/list-work-of-arts.component';
import { PortailComponent } from './components/portail/portail.component';
const routes: Routes = [
  {
    path: '',
    component: AboutComponent,
    children: [
      { path: '', redirectTo: 'home-page', pathMatch: 'full' },
      { path: 'home-page', component: AdministratorHomePageComponent },
      { path: 'accueil', component: HomePageComponent },
      { path: 'item-details', component: ItemDetailsComponent },
      { path: 'work-of-arts-list', component: ListWorkOfArtsComponent },
      { path: 'portail', component: PortailComponent },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [],
})
export class AboutRoutingModule {}
