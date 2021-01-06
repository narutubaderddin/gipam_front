import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import * as L from 'leaflet';
import { ColDef, ColumnApi, GridApi } from 'ag-grid-community';

@Injectable({
  providedIn: 'root',
})
export class MovementsService {
  capitals = {
    'type': 'FeatureCollection',
    'features': [{'type':'Feature','geometry':{'type':'Point','coordinates':[2.35,48.85]},'properties':{'state':'France','name':'Paris'}}]
  };

  constructor(private http: HttpClient) {
  }

  makeCapitalMarkers(map: L.Map): void {

      for (const c of this.capitals.features) {
        let greenIcon = new L.Icon({
          iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
          shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
          iconSize: [25, 41],
          iconAnchor: [12, 41],
          popupAnchor: [1, -34],
          shadowSize: [41, 41]
        });

        let customOptions = {
          'className': 'custom',
        };

        let popup2 = L.popup({
          closeOnClick: false,
          autoClose: false
        }).setContent('<strong><h5 style=\'color: #004d9d\'>Service </h5></strong>' +
          '<strong>Ministère :</strong> Ministère Délégué à l\'industrie <br>' +
          '<strong>Etablissement/direction :</strong> Conseils générales des mines <br>' +
          '<strong>Service :</strong> Ecole Nationale des Mines à Paris<br><br>' +
          '<strong><h5 style=\'color: #004d9d\'>Site </h5></strong>' +
          '<strong>Site :</strong>GREGOIRE <br>' +
          '<strong>Département/Ville :</strong>75 Paris <br><br>')

        const lat = c.geometry.coordinates[0];
        const lon = c.geometry.coordinates[1];
        const marker = L.marker([lon, lat], {icon: greenIcon}).addTo(map).bindPopup(popup2, customOptions);
      }
  }
}
