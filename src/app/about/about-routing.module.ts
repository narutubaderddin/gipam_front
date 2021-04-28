import { AddRemarquerComponent } from './components/add-remarquer/add-remarquer.component';
import { AdministratorHomePageComponent } from './components/administrator-home-page/administrator-home-page.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AboutComponent } from '@app/about/about.component';
import { ItemDetailsComponent } from '@app/about/components/item-details/item-details.component';
import { ListWorkOfArtsComponent } from './components/list-work-of-arts/list-work-of-arts.component';
import { PortailComponent } from './components/portail/portail.component';
import { PortailItemDetailsComponent } from '@app/about/components/portail-item-details/portail-item-details.component';
import { NoticeListComponent } from '@app/about/components/notice-list/notice-list.component';
import { RecolementListComponent } from '@app/about/components/recolement-list/recolement-list.component';
import { AlertListComponent } from '@app/about/components/alert-list/alert-list.component';
import { InProgressDemandComponent } from '@app/about/components/in-progress-demand/in-progress-demand.component';
import { DomainsComponent } from '@app/about/components/tabs-ref/domains/domains.component';
import { DenominationsComponent } from '@app/about/components/tabs-ref/denominations/denominations.component';

const routes: Routes = [
  {
    path: '',
    component: AboutComponent,
    children: [
      { path: '', redirectTo: 'accueil', pathMatch: 'full' },
      { path: 'accueil', component: AdministratorHomePageComponent, data: { title: 'Accueil' } },
      { path: 'details', component: ItemDetailsComponent },
      { path: 'portail-details', component: PortailItemDetailsComponent },
      {
        path: 'oeuvres-list',
        component: ListWorkOfArtsComponent,
        data: {
          title: "Liste des oeuvres d'art",
        },
      },
      {
        path: 'demandes-en-cours',
        component: InProgressDemandComponent,
        data: {
          title: 'Liste des demandes en cours',
        },
      },
      { path: 'portail', component: PortailComponent },
      { path: 'creation-notice/:type', component: AddRemarquerComponent },
      { path: 'notices-list', component: NoticeListComponent },
      { path: 'recolements-list', component: RecolementListComponent },
      { path: 'alerts-list', component: AlertListComponent },
      { path: 'tab-ref-domaine', component: DomainsComponent },
      { path: 'tab-ref-dénomination', component: DenominationsComponent },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [],
})
export class AboutRoutingModule {}
