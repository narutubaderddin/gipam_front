import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
const MATERIAL_TECHNIQUE_API_URL = '/materialTechniques/';
@Injectable({
  providedIn: 'root',
})
export class MaterialTechniqueService {
  constructor(private http: HttpClient) {}

  getFilteredMaterialTechnique(data: any): Observable<any> {
    const url = 'searchByFieldAndDenomination';
    let params = new HttpParams();
    Object.keys(data).forEach((key) => {
      if (data[key]) {
        params = params.append(key, data[key]);
      }
    });

    return this.http.get<any[]>(MATERIAL_TECHNIQUE_API_URL + url, { params });
  }
}
