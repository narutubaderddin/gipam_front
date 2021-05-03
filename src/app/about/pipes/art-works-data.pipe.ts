import { Pipe, PipeTransform } from '@angular/core';
import ArtWorksDataModel, { ArtWorksModel } from '@app/about/models/art-works-model';
import { ArtWorksPipe } from '@app/about/pipes/art-works.pipe';

@Pipe({
  name: 'art-works-data',
})
export class ArtWorksDataPipe implements PipeTransform {
  constructor(private artWorksPipe: ArtWorksPipe) {}
  transform(value: any, ...args: any[]): any {
    let results = value.results.map((result: any) => {
      return this.artWorksPipe.transform(result);
    });

    return new ArtWorksDataModel(value.page, value.size, value.filteredQuantity, value.totalQuantity, results);
  }
}
