import { Component } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import * as L from 'leaflet';
import { latLng, tileLayer } from 'leaflet';
import { statesData } from '../../assets/us-states.js'

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
})
export class HomeComponent {
  constructor(private http: HttpClient){}



  ngOnInit(){
    let map: L.Map;
		let geojson: L.GeoJSON;
    let mapboxAccessToken = "pk.eyJ1IjoibWFybW9sbW9udGVzIiwiYSI6ImNrcDVua2djYjA4aWMyb280dHp3ZzB5cjUifQ.VHYHfyF1KmqjgkbRRNPERQ";
    map = L.map('map').setView([37.8, -96], 4);
    
    L.tileLayer("http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
			id: "mapbox.light",
			attribution: "COVID"
		}).addTo(map);

		let info;

		info = new L.Control();

		info.onAdd = function () {
			this._div = L.DomUtil.create("div", "info");
			this.update();
			return this._div;
		};

		info.update = function (props: any) {
			this._div.innerHTML =
				"<h4>Mapa para Voxel</h4>" 
				// (props ? "<b>" + props.nom + "</b><br />" : "");
		};

		info.addTo(map);

		function resetHighlight(e) {
			geojson.resetStyle(e.target);
			info.update();
		}

		function zoomToFeature(e) {
      alert("Aqui va pop up -- pop up is printed here")
		}

    function getColor(d) {
      return d > 10000 ? '#800026' :
             d > 5000  ? '#BD0026' :
             d > 2000  ? '#E31A1C' :
             d > 1000  ? '#FC4E2A' :
             d > 500   ? '#FD8D3C' :
             d > 200  ? '#FEB24C' :
             d > 100  ? '#FED976' :
                        '#FFEDA0';
  }



		function highlightFeature(e) {
			const layer = e.target;

			layer.setStyle({
				weight: 5,
				color: "#666",
				dashArray: "",
				fillOpacity: 0.2
			});

			if (!L.Browser.ie && !L.Browser.edge) {
				layer.bringToFront();
			}

			info.update(layer.feature.properties);
		}

    this.http.get("assets/covidData.json").subscribe((json: any) => {
			geojson = L.geoJSON(json, {
				style: function (feature) {
					return {
            fillColor: getColor(feature.properties.density),
            weight: 2,
            opacity: 1,
            color: 'white',
            dashArray: '3',
            fillOpacity: 0.7
        };
				},
				onEachFeature: function onEachFeature(feature, layer: L.Layer) {
					layer.on({
						mouseover: highlightFeature,
						mouseout: resetHighlight,
						click: zoomToFeature
					});
				}
			}).addTo(map);
		});

   
    
  }

 

}


