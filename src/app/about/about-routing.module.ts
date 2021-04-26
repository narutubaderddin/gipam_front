import { AddPropertyRemarquerComponent } from './components/add-property-remarquer/add-property-remarquer.component';
import { AdministratorHomePageComponent } from './components/administrator-home-page/administrator-home-page.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AboutComponent } from '@app/about/about.component';
import { ItemDetailsComponent } from '@app/about/components/item-details/item-details.component';
import { ListWorkOfArtsComponent } from './components/list-work-of-arts/list-work-of-arts.component';
import { PortailComponent } from './components/portail/portail.component';
import { PortailItemDetailsComponent } from '@app/about/components/portail-item-details/portail-item-details.component';
import { NoticeBeingCreatedComponent } from './components/administrator-home-page/notice-being-created/notice-being-created.component';
import { NoticeListComponent } from '@app/about/components/notice-list/notice-list.component';
import { RecolementListComponent } from '@app/about/components/recolement-list/recolement-list.component';
import { AlertListComponent } from '@app/about/components/alert-list/alert-list.component';
import { InProgressDemandComponent } from '@app/about/components/in-progress-demand/in-progress-demand.component';
import { DomainsComponent } from '@app/about/components/tabs-ref/domains/domains.component';
import { DenominationsComponent } from '@app/about/components/tabs-ref/denominations/denominations.component';
import { StylesComponent } from '@app/about/components/tabs-ref/styles/styles.component';
import { MaterialTechniqueComponent } from '@app/about/components/tabs-ref/material-technique/material-technique.component';
import { DepositTypesComponent } from '@app/about/components/tabs-ref/depositTypes/depositTypes.component';
import { ReportTypesComponent } from '@app/about/components/tabs-ref/reportTypes/reportTypes.component';
import { ActionReportTypesComponent } from '@app/about/components/tabs-ref/actionReportTypes/actionReportTypes.component';
import { CategoryComponent } from '@app/about/components/tabs-ref/category/category.component';
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
      { path: 'creation-notice', component: AddPropertyRemarquerComponent },
      { path: 'notices-list', component: NoticeListComponent },
      { path: 'recolements-list', component: RecolementListComponent },
      { path: 'alerts-list', component: AlertListComponent },
      { path: 'tab-ref-domaine', component: DomainsComponent },
      { path: 'tab-ref-dénomination', component: DenominationsComponent },
      { path: 'tab-ref-style', component: StylesComponent },
      { path: 'tab-ref-matière', component: MaterialTechniqueComponent },
      { path: 'tab-ref-type-déposant', component: DepositTypesComponent },
      { path: 'tab-ref-type-constat', component: ReportTypesComponent },
      { path: 'tab-ref-type-action-constat', component: ActionReportTypesComponent },
      { path: 'tab-ref-categorie', component: CategoryComponent },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [],
})
export class AboutRoutingModule {}
