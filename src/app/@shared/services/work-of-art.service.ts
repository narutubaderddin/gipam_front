import { Injectable } from '@angular/core';
import { TreeviewItem } from 'ngx-treeview';
import { HttpClient, HttpParameterCodec, HttpParams } from '@angular/common/http';

import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class WorkOfArtService {
  private _selectedArtWorks: any[] = [];
  constructor(private http: HttpClient) {}
  getOeuvres(filterObj: any): Observable<any> {
    let filter: string = `limit=40&page=${filterObj.page}`;
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
    filter += '&sort_by=field';
    return this.http.get('/artWorks/search?' + filter);
  }

  getOeuvreDetails(id: string): Observable<any> {
    return this.http.get('/artWorks/' + id);
  }
  addSelectedArtWorks(item: any) {
    this._selectedArtWorks.push(item);
    localStorage.setItem('selectedArtWorks', JSON.stringify(this._selectedArtWorks));
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
    localStorage.removeItem('selectedArtWorks');
  }
  addWorkOfArt(data: any): Observable<any> {
    return this.http.post('/notices/property', data);
  }
}
