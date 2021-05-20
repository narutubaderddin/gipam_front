import { Injectable } from '@angular/core';
import { TreeviewItem } from 'ngx-treeview';
import { HttpClient, HttpHeaders, HttpParameterCodec, HttpParams } from '@angular/common/http';

import { Observable } from 'rxjs';
import { MessageService } from 'primeng/api';

@Injectable({
  providedIn: 'root',
})
export class WorkOfArtService {
  _selectedArtWorks: any[] = [];
  statusType = [
    {
      id: 'depot',
      name: 'Dépôt ',
    },
    {
      id: 'propriete',
      name: 'Prorièté ',
    },
  ];
  domaine = [
    {
      id: 0,
      name: 'Art graphique',
      denominations: [
        { id: 1, name: 'Affiche' },
        { id: 2, name: 'Dessin' },
        { id: 3, name: 'Estampe' },
        { id: 4, name: 'Gravure' },
        { id: 5, name: 'Peinture sur papier' },
        { id: 6, name: 'Photographie' },
      ],
      active: true,
    },
    {
      id: 1,
      name: 'Horlogerie',
      denominations: [
        { id: 1, name: 'Horloge' },
        { id: 2, name: 'Pendule' },
        { id: 3, name: 'Régulateur' },
      ],
      active: true,
    },
    {
      id: 2,
      name: 'Luminaire',
      denominations: [
        { id: 1, name: 'Applique' },
        { id: 2, name: 'Chandelier' },
      ],
      active: false,
    },
    { id: 4, name: 'Object décoratif', active: true },
    { id: 5, name: 'Peinture', active: false },
    {
      id: 6,
      name: 'Sculpture',
      denominations: [
        { id: 1, name: 'Buste' },
        { id: 2, name: 'Relief' },
      ],
      active: true,
    },
    { id: 7, name: 'Art textile', active: true },
    { id: 8, name: 'Pièce de musée', active: true },
    {
      id: 9,
      name: 'Art de la table',
      active: true,
      denominations: [
        { id: 1, name: 'Plat de service' },
        { id: 2, name: 'Chauffe plat' },
        { id: 2, name: 'Couverts' },
      ],
    },
    { id: 10, name: 'Decor monumental', active: true },
    { id: 11, name: 'Archeologie', active: false },
  ];
  denominations = [
    { id: 1, name: 'Affiche' },
    { id: 2, name: 'Statuette' },
    { id: 15, name: 'Dessin' },
    { id: 3, name: 'Estampe' },
    { id: 4, name: 'Gravure' },
    { id: 5, name: 'Peinture sur papier' },
    { id: 6, name: 'Photographie' },
    { id: 7, name: 'Horloge' },
    { id: 8, name: 'Pendule' },
    { id: 9, name: 'Régulateur' },
    { id: 10, name: 'Art textile' },
    { id: 11, name: 'Pièce de musée' },
    { id: 12, name: 'Art de la table' },
    { id: 13, name: 'Decor monumental' },
    { id: 14, name: 'Archeologie' },
  ];
  epoque = [
    { id: 0, name: 'Renaissance' },
    { id: 1, name: 'XVIIe siècle' },
    { id: 2, name: 'Empire' },
    { id: 3, name: 'Restauration' },
    { id: 4, name: 'Second Empire' },
    { id: 5, name: 'Louis Philippe' },
    { id: 6, name: 'Louis XIV' },
    { id: 7, name: 'Louis XV' },
    { id: 8, name: 'Régence' },
    { id: 9, name: 'Directoire' },
    { id: 10, name: 'XVIe siècle' },
    { id: 11, name: 'XIXe siècle' },
    { id: 12, name: 'Paléolithique' },
    { id: 13, name: 'Louis XVIII' },
  ];
  property: string[] = ['Propriété', 'Dépôt'];
  style: string[] = [
    'Baroque',
    'Rustique',
    'Néanderthal',
    'Empire',
    'Art Déco',
    'Louis XV',
    'Directoire',
    'Régence',
    'Restauration',
    'Napoléan III',
    'Transition',
    'Louis-Philippe',
    'Charles X',
    'Louis XIV',
    'Oriental',
    'Chinois',
    'Contemporain',
  ];
  ministeres = [
    { id: 0, name: 'MINISTÈRES ÉCONOMIQUES ET FINANCIERS' },
    { id: 1, name: 'MINISTÈRE DU COMMERCE EXTÉRIEUR' },
    { id: 2, name: "SECRÉTARIAT D'ÉTAT CHARGE DU BUDGET" },
    { id: 3, name: "MINISTÈRE DÉLÉGUÉ A L'INDUSTRIE" },
    { id: 4, name: "SECRETARIAT D'ETAT CHARGÉ DE LA FONCTION PUBLIQUE" },
    { id: 5, name: 'Louis Philippe' },
    { id: 6, name: "SECRÉTARIAT D'ETAT CHARGÉ DU COMMERCE EXTÈRIEUR" },
    { id: 7, name: "SECRÉTARIAT D'ÉTAT CHARGÉ DE L'EMPLOI" },
    {
      id: 8,
      name:
        "SECRÉTARIAT D'ÉTAT CHARGÉ COMMERCE, DE L'ARTISANAT, DES PME, DU TOURISME, DES SERVICES, DES PROFESSIONS LIBERALES ET DE LA CONSOMMATION",
    },
    { id: 9, name: "MINISTÈRE DE L'ARTISANAT, DU COMMERCE  ET DU TOURISME" },
    { id: 10, name: "SECRÉTARIAT D'ETAT CHARGÉ DU NUMÉRIQUE" },
    { id: 11, name: 'MINISTÈRE DE LA FONCTION PUBLIQUE' },
  ];
  authors = [
    { id: 0, name: 'author 1' },
    { id: 1, name: 'author 2' },
    { id: 2, name: 'author 3' },
    { id: 3, name: 'author 4' },
    { id: 4, name: 'author 5' },
    { id: 5, name: 'author 6' },
    { id: 6, name: 'author 7' },
  ];
  depositor = [
    { id: 0, name: 'depositor 1' },
    { id: 1, name: 'depositor 2' },
    { id: 2, name: 'depositor 3' },
    { id: 3, name: 'depositor 4' },
    { id: 4, name: 'depositor 5' },
    { id: 5, name: 'depositor 6' },
    { id: 6, name: 'depositor 7' },
  ];
  proofs = [
    {
      id: 0,
      titre: 'titre 1',
      creationDate: '04/12/2020',
      nombre_prood_a_recole: '5',
      nombre_prood_recole: '15',
      created_by: 'Test',
      minister: 'MINISTÈRES ÉCONOMIQUES ET FINANCIERS',
      etab: 'Secrétariat Général des Ministères Économique et Financier',
      service: "Service de l'Environnement Professionnel 2B",
    },
    {
      id: 1,
      titre: 'titre 2',
      creationDate: '19/10/2020',
      nombre_prood_a_recole: '5',
      nombre_prood_recole: '15',
      created_by: 'Test',
      minister: 'MINISTÈRES ÉCONOMIQUES ET FINANCIERS',
      etab: 'Secrétariat Général des Ministères Économique et Financier',
      service: "Service de l'Environnement Professionnel 2B",
    },
    {
      id: 2,
      titre: 'titre 3',
      creationDate: '04/12/2020',
      nombre_prood_a_recole: '5',
      nombre_prood_recole: '15',
      created_by: 'Test',
      minister: 'MINISTÈRES ÉCONOMIQUES ET FINANCIERS',
      etab: 'Secrétariat Général des Ministères Économique et Financier',
      service: "Service de l'Environnement Professionnel 2B",
    },
    {
      id: 3,
      titre: 'titre 4',
      creationDate: '04/12/2020',
      nombre_prood_a_recole: '5',
      nombre_prood_recole: '15',
      created_by: 'Test',
      minister: 'MINISTÈRES ÉCONOMIQUES ET FINANCIERS',
      etab: 'Secrétariat Général des Ministères Économique et Financier',
      service: "Service de l'Environnement Professionnel 2B",
    },
  ];
  proofsDetails = [
    {
      proofId: 0,
      id: 0,
      inventaire: 103,
      Titre: 'titre 1',
      Domaine: 'Couverts',
      Denomination: 'Statuette',
      Auteur: 'auteur',
      Total_recole: '10',
      Date_last_recole: '04/03/2021',
      Recole: true,
    },
    {
      proofId: 0,
      id: 1,
      inventaire: 104,
      Titre: 'titre 1',
      Domaine: 'Couverts',
      Denomination: 'Statuette',
      Auteur: 'auteur',
      Total_recole: '10',
      Date_last_recole: '04/03/2021',
      Recole: false,
    },
    {
      proofId: 0,
      id: 2,
      inventaire: 105,
      Titre: 'titre 1',
      Domaine: 'Couverts',
      Denomination: 'Statuette',
      Auteur: 'auteur',
      Total_recole: '10',
      Date_last_recole: '05/03/2021',
      Recole: true,
    },
    {
      proofId: 1,
      id: 0,
      inventaire: 106,
      Titre: 'titre 1',
      Domaine: 'Couverts',
      Denomination: 'Statuette',
      Auteur: 'auteur',
      Total_recole: '10',
      Date_last_recole: '04/03/2021',
      Recole: true,
    },
    {
      proofId: 1,
      id: 1,
      inventaire: 107,
      Titre: 'titre 1',
      Domaine: 'Couverts',
      Denomination: 'Statuette',
      Auteur: 'auteur',
      Total_recole: '10',
      Date_last_recole: '04/03/2021',
      Recole: false,
    },
    {
      proofId: 1,
      id: 2,
      inventaire: 108,
      Titre: 'titre 1',
      Domaine: 'Couverts',
      Denomination: 'Statuette',
      Auteur: 'auteur',
      Total_recole: '10',
      Date_last_recole: '05/03/2021',
      Recole: true,
    },
    {
      proofId: 1,
      id: 3,
      inventaire: 109,
      Titre: 'titre 1',
      Domaine: 'Couverts',
      Denomination: 'Statuette',
      Auteur: 'auteur',
      Total_recole: '10',
      Date_last_recole: '05/03/2021',
      Recole: true,
    },
  ];
  alerts = [
    {
      reference: 'Réf 145',
      date: '01/01/2021',
      auteur: 'Auteur1;Auteur2',
      titre: 'titre1',
      actiontype: 'En recherche',
      startDate: '31/10/2020',
      endDate: '31/12/2020',
      delai: '62',
      status: 'en cours',
      createdBy: 'Test',
    },
    {
      reference: 'Réf 365',
      date: '01/07/2021',
      auteur: 'Auteur54',
      titre: 'titre2',
      actiontype: 'Dépot de plainte',
      startDate: '12/05/2020',
      endDate: '30/06/2020',
      delai: '62',
      status: 'en cours',
      createdBy: 'Test',
    },
    {
      reference: 'Réf 478',
      date: '29/11/2020',
      auteur: 'Auteur1',
      titre: 'titre5',
      actiontype: 'Déclassement',
      startDate: '31/10/2020',
      endDate: '28/11/2020',
      delai: '62',
      status: 'en cours',
      createdBy: 'Test',
    },
    {
      reference: 'Réf 587',
      date: '01/01/2021',
      auteur: 'Auteur6',
      titre: 'titre458',
      actiontype: 'En attente de localisation',
      startDate: '31/10/2020',
      endDate: '31/12/2020',
      delai: '62',
      status: 'en cours',
      createdBy: 'Test',
    },
  ];
  oeuvres = [
    {
      name: 'Art textile',
      items: [
        {
          id: 0,
          titre: 'Vénus de Milo',
          auteur: 'Filip olean',
          denomination: 'Statuette',
          description: 'Une statue en marbre représentantla déesse Aphrodite-C.',
          mots_descriptifs: 'mots_descriptifs',
          commentaire: 'commentaire',
          image: 'assets/images/573.jpg',
          vip: 'true',
          domaine: 'Sculpture',
          editeur: "Alexandros d'Antioche",
          anneeCreation: 1820,
          dimension: '202x36x64',
          matiere: 'Marbre',
          style: 'Tableau non classés',
          creationDate: '12/07/1985',
          property: 'Propriété',
          visible: true,
        },
        {
          id: 1,
          titre: 'Nature morte',
          denomination: 'Couverts',
          auteur: 'Sebatein lorein',
          description: 'Le Portrait de Mona Lisa est celui de la Florentine Lisa Gherardini',
          image: 'assets/images/1.jpg',
          vip: 'true',
          status: 'notRecieved',
          domaine: 'Peinture',
          editeur: 'Léonard de Vinci',
          anneeCreation: 1519,
          dimension: '77 × 53 cm',
          style: 'Renaissance',
          matiere: 'Huile sur panneau de bois',
          creationDate: '15/02/1975',
          property: 'Propriété',
          visible: true,
        },
        {
          id: 2,
          titre: 'La Belle Ferronnière',
          auteur: 'Emmanuel polrin',
          denomination: 'Couverts',
          description: 'Un tableau peint sur un panneau en bois de noyer',
          image: 'assets/images/2.jpg',
          vip: 'false',
          status: 'recieved',
          domaine: 'Peinture',
          editeur: 'Léonard de Vinci',
          anneeCreation: 1497,
          dimension: '62 × 44 cm',
          style: 'Renaissance',
          matiere: 'Huile sur panneau de bois',
          creationDate: '30/11/1920',
          property: 'Propriété',
          visible: false,
        },
        {
          id: 3,
          titre: 'La Liberté guidant le peuple',
          auteur: 'Sebatein lorein',
          denomination: 'Couverts',
          description: "Une huile sur toile d'Eugène Delacroix  ",
          image: 'assets/images/4.jpg',
          vip: 'false',
          status: 'recieved',
          domaine: 'Sculpture',
          editeur: 'Eugène Delacroix',
          anneeCreation: 1830,
          dimension: '260 × 325 cm',
          matiere: 'Huile sur panneau de bois',
          style: 'Renaissance',
          creationDate: '25/12/1921',
          property: 'Dépôt',
          depositor: 'depoistor 1',
          visible: true,
        },
        {
          id: 4,
          titre: 'ECOLE FRANCAISE VERS 1830,D’APRÈS PIERRE...',
          auteur: 'Emannuel stephano',
          description: 'ECOLE FRANCAISE VERS 1830, D’APRÈS PIERRE...',
          image: 'assets/images/25.jpg',
          vip: 'false',
          status: 'recieved',
          domaine: 'Peinture',
          editeur: '',
          anneeCreation: '',
          dimension: '77 × 53 cm',
          style: 'Tableau non classés',
          creationDate: '24/10/1919',
          property: 'Propriété',
          visible: false,
        },
        {
          id: 5,
          titre: 'Victoire de Samothrace',
          auteur: 'deStephano amouari',
          description: "Un monument de sculpture grecque trouvé dans l'île de Samothrace.",
          image: 'assets/images/35.jpg',
          vip: 'false',
          status: 'notRecieved',
          domaine: 'Sculpture',
          anneeCreation: 1863,
          dimension: '77 × 53 cm',
          matiere: 'Marbre',
          style: 'Tableau non classés',
          creationDate: '30/11/1920',
          property: 'Dépôt',
          depositor: 'depoistor 1',
          visible: true,
        },
        {
          id: 6,
          titre: "L'Esclave mourant",
          auteur: 'Amouari lorian',
          description: 'Une statue en marbre représentantla déesse Aphrodite-C.',
          mots_descriptifs: 'mots_descriptifs',
          commentaire: 'commentaire',
          image: 'assets/images/162.JPG',
          vip: 'true',
          domaine: 'Sculpture',
          editeur: 'Michel-Ange',
          anneeCreation: 1820,
          dimension: '202x36x64',
          matiere: 'Marbre',
          style: 'Tableau non classés',
          creationDate: '27/09/1914',
          property: 'Propriété',
          visible: false,
        },

        {
          id: 7,
          titre: 'La Vierge aux rochers',
          auteur: 'Sferin lopein',
          description: 'Considérée par les historiens comme la première des deux versions.',
          image: 'assets/images/0000.jpg',
          vip: 'false',
          status: 'recieved',
          domaine: 'Peinture',
          editeur: 'Léonard de Vinci',
          anneeCreation: 1483,
          dimension: '199 × 122 cm',
          matiere: 'Huile sur panneau de bois',
          style: 'Renaissance',
          creationDate: '30/11/1920',
          property: 'Dépôt',
          depositor: 'depoistor 1',
          visible: true,
        },
        {
          id: 8,
          titre: 'Les Noces de Cana',
          auteur: 'Mari lopein',
          description: "Une huile sur toile d'Eugène Delacroix  ",
          image: 'assets/images/304.jpg',
          vip: 'false',
          status: 'recieved',
          domaine: 'Peinture',
          editeur: 'Paul Véronèse',
          anneeCreation: 1563,
          dimension: '677 × 994 cm',
          matiere: 'Huile sur panneau de bois',
          style: 'Renaissance',
          creationDate: '19/01/1990',
          property: 'Propriété',
          visible: false,
        },
      ],
    },
    {
      name: 'Horlogerie',
      items: [
        {
          id: 9,
          titre: 'Victoire de Samothrace',
          auteur: 'Mari lopein',
          description: "Un monument de sculpture grecque trouvé dans l'île de Samothrace.",
          image: 'assets/images/343 .jpg',
          vip: 'false',
          status: 'notRecieved',
          domaine: 'Sculpture',
          editeur: '',
          anneeCreation: 1863,
          dimension: '77 × 53 cm',
          matiere: 'Marbre',
          style: 'Sculpture',
          creationDate: '30/11/1920',
          property: 'Dépôt',
          depositor: 'depoistor 1',
          visible: true,
        },
        {
          id: 10,
          titre: "Vénus d'Arles",
          auteur: 'Mari lopein',
          description: 'une sculpture en marbre dégagée en 1651',
          image: 'assets/images/365.jpg',
          vip: 'false',
          status: 'notRecieved',
          domaine: 'Sculpture',
          editeur: '',
          dimension: '194 cm (hauteur)',
          anneeCreation: 1651,
          matiere: 'Marbre',
          style: 'Tableau non classés',
          creationDate: '21/02/1920',
          property: 'Dépôt',
          depositor: 'depoistor 1',
          visible: true,
        },
        {
          id: 11,
          titre: 'Saint Jean-Baptiste',
          auteur: 'Mari lopein',
          description: ' Peint sur une planche de noyer et mesure 69 × 57 cm',
          image: 'assets/images/12.jpg',
          vip: 'false',
          status: 'recieved',
          domaine: 'Peinture',
          editeur: 'Léonard de Vinci',
          anneeCreation: 1516,
          dimension: '69 × 57 cm',
          matiere: 'Huile sur panneau de bois',
          style: 'Renaissance',
          creationDate: '30/11/1920',
          property: 'Propriété',
          visible: true,
        },
      ],
    },
  ];

  constructor(private http: HttpClient, private messageService: MessageService) {}
  getOeuvres(filterObj: any): Observable<any> {
    let filter: string = `limit=40&page=${filterObj.page}`;
    filter = this.extractedQuery(filterObj, filter);
    filter += '&sort_by=field';
    return this.http.get('/artWorks/search?' + filter);
  }

  extractedQuery(filterObj: any, filter: string) {
    if (filterObj.search) {
      filter += '&searchArt[eq]=' + filterObj.search;
    }
    if (filterObj.height) {
      if (filterObj.height.min > 0) {
        filter += '&height[gte]=' + filterObj.height.min;
      }
      if (filterObj.height.max > 0) {
        filter += '&height[lte]=' + filterObj.height.max;
      }
    }
    if (filterObj.width) {
      if (filterObj.width.max > 0) {
        filter += '&width[lte]=' + filterObj.width.max;
      }
      if (filterObj.width.min > 0) {
        filter += '&width[gte]=' + filterObj.width.min;
      }
    }
    if (filterObj.weight) {
      if (filterObj.weight.min > 0) {
        filter += '&weight[gte]=' + filterObj.weight.min;
      }
      if (filterObj.weight.max > 0) {
        filter += '&weight[lte]=' + filterObj.weight.max;
      }
    }
    if (filterObj.fields) {
      if (filterObj.fields.length > 0) {
        filter += '&field[in]=' + '[' + filterObj.fields + ']';
      }
    }
    if (filterObj.denoms) {
      if (filterObj.denoms.length > 0) {
        filter += '&denomination[in]=' + '[' + filterObj.denoms + ']';
      }
    }
    if (filterObj.mode) {
      filter += '&mode[eq]=' + filterObj.mode;
    }
    return filter;
  }

  getOeuvreDetails(id: string): Observable<any> {
    return this.http.get('/artWorks/' + id);
  }
  addSelectedArtWorks(item: any) {
    this._selectedArtWorks.push(item);
    localStorage.setItem('selectedArtWorks', JSON.stringify(this._selectedArtWorks));
    return this._selectedArtWorks;
  }

  getSelectedArtWorks(): any[] {
    if (localStorage.getItem('selectedArtWorks')) {
      this._selectedArtWorks = JSON.parse(localStorage.getItem('selectedArtWorks'));
    }
    return this._selectedArtWorks;
  }

  setSelectedArtWorks(items: any) {
    this._selectedArtWorks = items;
    localStorage.setItem('selectedArtWorks', JSON.stringify(this._selectedArtWorks));
  }

  removeSelectedArtWorks() {
    this._selectedArtWorks = [];
    localStorage.removeItem('selectedArtWorks');
  }
  addWorkOfArt(data: any, id: any): Observable<any> {
    let params = new HttpParams();
    params = params.append('id', id);
    return this.http.post('/notices/property', data, { params: params });
  }
  addDepositWorkOfArt(data: any): Observable<any> {
    return this.http.post('/notices/deposit', data);
  }

  getAttributes(fieldId: any, denominationId: any): Observable<any> {
    let params = new HttpParams();
    params = params.append('field_id', fieldId);
    params = params.append('denomination_id', denominationId);

    return this.http.get('/notices/attributes', { params });
  }

  getInProgressNotices(data: any): Observable<any> {
    let params = new HttpParams();
    Object.keys(data).forEach((key) => {
      if (data[key]) {
        params = params.append(key, data[key]);
      }
    });
    return this.http.get('/notices/get-art-works-in-progress', { params });
  }

  exportArtWorks(filterObj: any): Observable<any> {
    let filter: string = '';
    filter += '?limit=' + filterObj.limit;
    filter = this.extractedQuery(filterObj, filter);
    filter += '&sort_by=field';
    return this.http.get('/artWorks/exportListArtWorks' + filter, {
      responseType: 'blob',
      observe: 'response',
    });
  }
  getWorkOfArtById(id: any, data?: any): Observable<any> {
    let params = new HttpParams();
    if (data) {
      Object.keys(data).forEach((key) => {
        if (data[key]) {
          params = params.append(key, data[key]);
        }
      });
    }
    return this.http.get('/artWorks/' + id, { params });
  }
  updateWorkOfArt(workOfArt: any, id: any): Observable<any> {
    return this.http.patch(`/notices/${id}`, workOfArt);
  }
  getFormErrors(errors: any, sum: string) {
    if (!errors) {
      return;
    }
    Object.keys(errors).forEach((key) => {
      if (Array.isArray(errors[key])) {
        errors[key].forEach((error: any) => {
          this.messageService.add({ severity: 'error', summary: sum, detail: error });
        });
      }
    });
  }
}
