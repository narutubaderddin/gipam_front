import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import ArtWorksDataModel, { ArtWorksModel } from '@app/about/models/art-works-model';
import { ArtWorksDataPipe } from '@app/about/pipes/art-works-data.pipe';
import { Observable } from 'rxjs';

const ART_WORKS_API_URL = '/artWorks/';

@Injectable({
  providedIn: 'root',
})
export class ArtWorkService {
  constructor(private http: HttpClient, private artWorksDataPipe: ArtWorksDataPipe) {}

  getArtWorksData(
    filter = {},
    advancedFilter = {},
    headerFilters = {},
    page = 1,
    limit = 5,
    sortField = 'id',
    sortDirection = 'asc',
    search = '',
    globalSearch = ''
  ) {
    const url =
      ART_WORKS_API_URL +
      '?page=' +
      page +
      '&limit=' +
      limit +
      '&sort_by=' +
      sortField +
      '&sort=' +
      sortDirection +
      '&search=' +
      search +
      '&globalSearch=' +
      globalSearch;
    return this.http
      .post(url, { filter: filter, advancedFilter: advancedFilter, headerFilters: headerFilters }, {})
      .pipe(
        map((data) => {
          return this.artWorksDataPipe.transform(data);
        })
      );
  }
  getAutocompleteData(query: string, type: string): Observable<any> {
    const url = ART_WORKS_API_URL + 'autocompleteData?query=' + query + '&type=' + type;
    return this.http.get(url, {});
  }

  //Return array of artwork ID's
  getArtWorkids(artWorks: ArtWorksModel[]) {
    let artworksIds: any[];
    artworksIds = [];
    //Extract id's from artworks array.
    artWorks.forEach((artWork) => artworksIds.push(artWork.id));
    return artworksIds;
  }
}
