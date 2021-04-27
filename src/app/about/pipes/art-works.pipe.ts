import { Pipe, PipeTransform } from '@angular/core';
import ArtWorksDataModel, { ArtWorksModel } from '@app/about/models/art-works-model';

@Pipe({
  name: 'art-works',
})
export class ArtWorksPipe implements PipeTransform {
  constructor() {}
  transform(value: any, ...args: any[]): any {
    const authors: any[] = value.authors;
    let authorText = '';
    authors.forEach((value, index) => {
      authorText += value.firstName + ' ' + value.lastName;
      if (index < value.length) {
        authorText += ',';
      }
    });
    return new ArtWorksModel(
      value.id,
      value.title,
      'value.leng',
      '',
      authorText,
      value?.era?.label,
      value?.style?.label,
      value?.materialTechnique?.label,
      value?.denomination?.label,
      value?.field?.label,
      value.mouvements,
      value.status,
      value.creationDate
    );
  }
}
