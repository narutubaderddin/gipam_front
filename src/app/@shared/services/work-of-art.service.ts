import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class WorkOfArtService {
  domaine: string[] = [
    'Art graphique',
    'Horlogerie',
    'Luminaire',
    'Mobilier',
    'Objet décoratif',
    'Peinture',
    'Sculpture',
    'Art textile',
    'Pièce de musée',
    'Art de la table',
    'Décor monumental',
    'Archeologie',
  ];
  epoque: string[] = [
    'Renaissance',
    'XVIIe siècle',
    'Empire',
    'Restauration',
    'Second Empire',
    'Louis Philippe',
    'Louis XIV',
    'Louis XV',
    'Régence',
    'Directoire',
    'XVIe siècle',
    'XIXe siècle',
    'Paléolithique',
    'Louis XVIII',
    'Consulat',
    'Charles X',
    'Antique',
    'Art Déco',
    'Années 70',
    'Années 50',
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

  constructor() {}
}
