import { Pipe, PipeTransform } from '@angular/core';
import ArtWorksDataModel, { ArtWorksModel, Photographie } from '@app/about/models/art-works-model';

@Pipe({
  name: 'art-works',
})
export class ArtWorksPipe implements PipeTransform {
  constructor() {}
  transform(value: any, ...args: any[]): any {
    const authors: any[] = value.authors;
    let authorText = '';
    let communeText = '';
    let buildingText = '';
    authors.forEach((authorValue, index) => {
      authorText += authorValue.label;
      if (index < authorValue.length) {
        authorText += ',';
      }
    });
    value.communes.forEach((communeValue: any, index: number) => {
      communeText += communeValue.name;
      if (index < communeValue.length) {
        communeText += ',';
      }
    });
    value.buildings.forEach((buildingsValue: any, index: number) => {
      buildingText += buildingsValue.name;
      if (index < buildingsValue.length) {
        buildingText += ',';
      }
    });
    let principalPhoto = new Photographie(value.principalPhoto?.id, value.principalPhoto?.imagePreview);
    return new ArtWorksModel(
      value.id,
      value.title,
      'value.leng',
      '',
      authorText,
      value?.era?.label,
      value?.style?.label,
      value?.materialTechnique?.label,
      communeText,
      buildingText,
      value?.denomination?.label,
      value?.field?.label,
      value.mouvements,
      value.status?.statusType == 'DepositStatus' ? 'Dépôt' : 'Propriété',
      value.status?.depsitorName,
      value.creationDate,
      value.visible,
      principalPhoto
    );
  }
}
