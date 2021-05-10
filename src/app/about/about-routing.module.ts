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
import { StylesComponent } from '@app/about/components/tabs-ref/styles/styles.component';
import { MaterialTechniqueComponent } from '@app/about/components/tabs-ref/material-technique/material-technique.component';
import { EpoquesComponent } from '@app/about/components/tabs-ref/epoques/epoques.component';
import { DepositTypesComponent } from '@app/about/components/tabs-ref/depositTypes/depositTypes.component';
import { ReportTypesComponent } from '@app/about/components/tabs-ref/reportTypes/reportTypes.component';
import { ActionReportTypesComponent } from '@app/about/components/tabs-ref/actionReportTypes/actionReportTypes.component';
import { CategoryComponent } from '@app/about/components/tabs-ref/category/category.component';
import { EstablishmentsComponent } from '@app/about/components/tabs-ref/establishments/establishments.component';

import { TypeMvtComponent } from '@app/about/components/tabs-ref/type-mvt/type-mvt.component';
import { MovementActionTypesComponent } from '@app/about/components/tabs-ref/movement-action-types/movement-action-types.component';
import { ReportSubTypesComponent } from '@app/about/components/tabs-ref/report-sub-types/report-sub-types.component';
import { MinistryComponent } from '@app/about/components/tabs-ref/ministry/ministry.component';
import { BuildingsComponent } from '@app/about/components/tabs-ref/buildings/buildings.component';
import { CommunesComponent } from '@app/about/components/tabs-ref/communes/communes.component';
import { SubDivisionsComponent } from '@app/about/components/tabs-ref/subDivisions/subDivisions.component';
import { RegionsComponent } from '@app/about/components/tabs-ref/regions/regions.component';
import { DepartmentsComponent } from '@app/about/components/tabs-ref/departments/departments.component';
import { LocalisationTypeComponent } from '@app/about/components/tabs-ref/localisation-type/localisation-type.component';
import { ServicesComponent } from '@app/about/components/tabs-ref/services/services.component';
import { SitesComponent } from '@app/about/components/tabs-ref/sites/sites.component';
import { EstablishmentTypesComponent } from '@app/about/components/tabs-ref/establishmentTypes/establishmentTypes.component';
import { CorrespondentsComponent } from '@app/about/components/tabs-ref/correspondents/correspondents.component';
import { ResponsibleComponent } from '@app/about/components/tabs-ref/responsible/responsible.component';
import { EntryModesComponent } from '@app/about/components/tabs-ref/entryModes/entryModes.component';
import { AuthorTypesComponent } from '@app/about/components/tabs-ref/authorTypes/authorTypes.component';
import { AttachmentTypesComponent } from '@app/about/components/tabs-ref/attachmentTypes/attachmentTypes.component';
import { PhotographyTypesComponent } from '@app/about/components/tabs-ref/photographyTypes/photographyTypes.component';
import { PersonsComponent } from '@app/about/components/tabs-ref/persons/persons.component';
import { DepositorsComponent } from '@app/about/components/tabs-ref/depositors/depositors.component';
const routes: Routes = [
  {
    path: '',
    component: AboutComponent,
    children: [
      { path: '', redirectTo: 'accueil', pathMatch: 'full' },
      { path: 'accueil', component: AdministratorHomePageComponent, data: { title: 'Accueil' } },
      { path: 'details', component: ItemDetailsComponent },
      { path: 'portail-details/:id', component: PortailItemDetailsComponent },
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
      { path: 'tab-ref-style', component: StylesComponent },
      { path: 'tab-ref-matière', component: MaterialTechniqueComponent },
      { path: 'tab-ref-type-déposant', component: DepositTypesComponent, data: { title: 'Liste des types déposant' } },
      { path: 'tab-ref-type-constat', component: ReportTypesComponent, data: { title: 'Liste des types constat' } },
      {
        path: 'tab-ref-type-action-constat',
        component: ActionReportTypesComponent,
        data: { title: 'Liste des types action constat' },
      },
      { path: 'tab-ref-categorie', component: CategoryComponent, data: { title: 'Liste des catégories' } },
      {
        path: 'tab-ref-etablissement',
        component: EstablishmentsComponent,
        data: { title: 'Liste des établissements' },
      },
      {
        path: 'tab-ref-type-etablissement',
        component: EstablishmentTypesComponent,
        data: { title: 'Liste des types établissement' },
      },
      {
        path: 'tab-ref-sous-direction',
        component: SubDivisionsComponent,
        data: { title: 'Liste des sous-directions' },
      },
      {
        path: 'tab-ref-region',
        component: RegionsComponent,
        data: { title: 'Liste des régions' },
      },
      { path: 'tab-ref-époque', component: EpoquesComponent },
      { path: 'tab-ref-type-mouvement', component: TypeMvtComponent },
      { path: 'tab-ref-type-action-mouvement', component: MovementActionTypesComponent },
      { path: 'tab-ref-sous-type-constat', component: ReportSubTypesComponent },
      { path: 'tab-ref-ministère', component: MinistryComponent },
      { path: 'tab-ref-bâtiment', component: BuildingsComponent },
      { path: 'tab-ref-commune', component: CommunesComponent },
      { path: 'tab-ref-departement', component: DepartmentsComponent },
      { path: 'tab-ref-type-localisation', component: LocalisationTypeComponent },

      {
        path: 'tab-ref-service',
        component: ServicesComponent,
        data: { title: 'Liste des services' },
      },
      {
        path: 'tab-ref-site',
        component: SitesComponent,
        data: { title: 'Liste des sites' },
      },
      {
        path: 'tab-ref-modes-entree',
        component: EntryModesComponent,
        data: { title: "Liste des modes d'entréé" },
      },
      {
        path: 'tab-ref-personnes',
        component: PersonsComponent,
        data: { title: 'Liste des personnes' },
      },
      {
        path: 'tab-ref-types-auteur',
        component: AuthorTypesComponent,
        data: { title: 'Liste des types auteur' },
      },
      {
        path: 'tab-ref-types-fichier-joint',
        component: AttachmentTypesComponent,
        data: { title: 'Liste des types fichier joint' },
      },
      {
        path: 'tab-ref-types-photographie',
        component: PhotographyTypesComponent,
        data: { title: 'Liste des types photographie' },
      },
      {
        path: 'tab-ref-deposants',
        component: DepositorsComponent,
        data: { title: 'Liste des déposants' },
      },
      { path: 'tab-ref-correspondant', component: CorrespondentsComponent },
      { path: 'tab-ref-responsable', component: ResponsibleComponent },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [],
})
export class AboutRoutingModule {}
