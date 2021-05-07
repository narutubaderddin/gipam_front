import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
const ROOMS_API_URL = '/rooms/';
@Injectable({
  providedIn: 'root',
})
export class RoomService {
  constructor(private http: HttpClient) {}

  getLevelByBuildings(building: any[]) {
    const url = ROOMS_API_URL + 'findRoomsLevelbyCriteria?batiment=' + building;
    return this.http.get<any[]>(url, {});
  }
}
