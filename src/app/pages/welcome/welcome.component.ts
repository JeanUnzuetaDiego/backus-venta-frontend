import { Component, OnInit, ViewChild, ElementRef  } from '@angular/core';
import { Map, NavigationControl, Popup } from 'maplibre-gl';
import { MapComponent, LayerComponent } from '@maplibre/ngx-maplibre-gl';
// @ts-ignore
import { ScatterplotLayer } from '@deck.gl/layers';
// @ts-ignore
import { MapboxOverlay } from '@deck.gl/mapbox';
// const { ScatterplotLayer, MapboxOverlay } = require('@deck.gl/layers');
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-welcome',
  standalone: true,
  imports: [MapComponent, LayerComponent],
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.scss']
})
export class WelcomeComponent implements OnInit {
  @ViewChild('mapContainer', { static: false }) mapContainer: ElementRef;
  map: Map;
  states: string;

  constructor(private http: HttpClient) { }

  ngOnInit() { }

  ngAfterViewInit() {
    const url = 'https://maps.clockworkmicro.com/streets/v1/style?x-api-key=';
    const apiKey = 'Dr4eW3s233rRkk8I_public';

    this.map = new Map({
      container: this.mapContainer.nativeElement,
      style: 'https://api.maptiler.com/maps/streets/style.json?key=get_your_own_OpIi9ZULNHzrESv6T2vL',
      center: [-77.0428, -12.0464],
      zoom: 10.5,
    });
    this.map.addControl(new NavigationControl(), 'top-right');
    
    

    // Sample data source = https://data.iledefrance.fr
    const peruSights = 'assets/peru_capital_provincia.geojson';
    
    let layerControl;

    // Add the overlay as a control
    this.map.on('load', async () => {
      
      // Fetch the data
      const response = await fetch(peruSights);      
      const data = (await response.json()).features;

      /*
      const layer = new ScatterplotLayer({
        id: 'scatterplot-layer',
        data: data, // Usa los datos obtenidos de la API
        pickable: true,
        opacity: 0.7,
        stroked: true,
        filled: true,
        radiusMinPixels: 14,
        radiusMaxPixels: 100,
        lineWidthMinPixels: 5,
    
        // Usa d.geometry.coordinates para obtener las coordenadas
        getPosition: (d: any) => d.geometry.coordinates,
    
        // Ajusta getFillColor y getLineColor según tus necesidades
        getFillColor: (d: any) => {
          const fid = d.properties.FID;
          const departamentoColores: { [key: string]: number[] } = {
            '0': [255, 102, 51], //ANCASH
            '1': [255, 179, 153], //LAMBAYEQUE
            '5': [255, 51, 255], //HUANUCO 
            '6': [255, 255, 153], //LIMA
            'Pasco': [0, 179, 230],
            'Tumbes': [230, 179, 51],
            'Piura': [51, 102, 230],
            'La Libertad': [153, 153, 102],
            '18': [153, 255, 153], //ICA
            'Arequipa': [179, 77, 77],
            'Moquegua': [128, 179, 0],
            'Tacna': [128, 153, 0],
            'Puno': [230, 179, 179],
            'Cusco': [102, 128, 179],
            'Apurimac':  [102, 153, 26],
            'Ayacucho': [255, 153, 230],
            'Huancavelica': [204, 255, 26],
            'Junin': [255, 26, 102],
            'San Martin': [230, 51, 26],
            'Cajamarca':  [51, 255, 204],
            'Amazonas': [102, 153, 77],
            '43': [255, 140, 20],// LORETO
            'Ucayali': [255, 153, 15],
            'Madre de Dios': [255, 102,58],
          };
          return departamentoColores[fid] || [255, 255, 255];
          const limit = 100;
        },
    
        onClick: (info: any) => {
          const {coordinate, object} = info;
          const capital = object.properties.CAPITAL;
          const departamento = object.properties.DEPARTAM || 'Desconocido';
          const provincia = object.properties.PROVINCIA || 'Desconocido';
          const distrito = object.properties.DISTRITO || 'Desconocido';
          const description = `<p>Capital: ${capital}</p>
                               <p>Departamento: ${departamento}</p>
                               <p>Provincia: ${provincia}</p>
                               <p>Distrito: ${distrito}</p>`;
      
          new Popup()
              .setLngLat(coordinate)
              .setHTML(description)
              .addTo(this.map);
      },
      });
    
      // Create the overlay
      const overlay = new MapboxOverlay({
          layers: [layer],
      });
      this.map.addControl(overlay);
      */
  });
  }

}
