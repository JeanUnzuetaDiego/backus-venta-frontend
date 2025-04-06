import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { NzFlexModule } from 'ng-zorro-antd/flex';
import { RouterModule } from '@angular/router';
import { NzListModule } from 'ng-zorro-antd/list';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { FormsModule } from '@angular/forms';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzSliderModule } from 'ng-zorro-antd/slider';
import { getISOWeek } from 'date-fns';
import { DeviceDetectorService } from '../../services/device-detector.service';
import { Map, NavigationControl, Popup } from 'maplibre-gl';
import { MapComponent, LayerComponent } from '@maplibre/ngx-maplibre-gl';
import * as echarts from 'echarts';
// @ts-ignore
import { ScatterplotLayer } from '@deck.gl/layers';
// @ts-ignore
import { MapboxOverlay } from '@deck.gl/mapbox';
// const { ScatterplotLayer, MapboxOverlay } = require('@deck.gl/layers');
import { HttpClient } from '@angular/common/http';
// import 'echarts/extension/bmap/bmap';

interface Person {
  key: string;
  name: string;
  age: number;
  address: string;
}

@Component({
  selector: 'app-welcome',
  standalone: true,
  imports: [CommonModule, NzDividerModule, NzFlexModule, MapComponent, LayerComponent, FormsModule, NzSliderModule, NzIconModule, NzDatePickerModule, NzTableModule, NzInputModule, NzGridModule, NzSelectModule,  NzLayoutModule, NzListModule, NzMenuModule, NzTabsModule, RouterModule],
  templateUrl: './mapa-doh-nrb.component.html',
  styleUrls: ['./mapa-doh-nrb.component.scss']
})

export class MapaDohNrbComponent implements OnInit {
  @ViewChild('mapContainer', { static: false }) mapContainer: ElementRef;
  map: Map;
  states: string;
  isCollapsed = false;
  date: any = null;
  isMobile: boolean = false;
  isTablet: boolean = false;
  isDesktop: boolean = false;
  value?: string;
  value1 = 30;
  data: any[] = [
    {
      name: 'John Brown',
      age: 32,
      address: 'New York No. 1 Lake Park'
    },
    {
      name: 'Jim Green',
      age: 42,
      address: 'London No. 1 Lake Park'
    },
    {
      name: 'Joe Black',
      age: 32,
      address: 'Sidney No. 1 Lake Park'
    }
  ];
  listStore: any[] = [
    {
      retail: 'Supesa',
      stockUn: '1,417.502',
      averageUn: '152.800',
      dohUn: '9,3',
      stockCf: '1,408.792',
      averageCf: '150.356',
      dohCf: '9,3',
    },
    {
      retail: 'Cencosud',
      stockUn: '1,417.502',
      averageUn: '53,154',
      dohUn: '11,1',
      stockCf: '1,408.792',
      averageCf: '150.356',
      dohCf: '11,4',
    },
    {
      retail: 'Vega',
      stockUn: '1,417.502',
      averageUn: '',
      dohUn: '',
      stockCf: '1,408.792',
      averageCf: '150.356',
      dohCf: '',
    },
    {
      retail: 'Tambo',
      stockUn: '1,417.502',
      averageUn: '',
      dohUn: '',
      stockCf: '1,408.792',
      averageCf: '150.356',
      dohCf: '',
    },
    {
      retail: 'Tottus',
      stockUn: '1,417.502',
      averageUn: '',
      dohUn: '',
      stockCf: '1,408.792',
      averageCf: '150.356',
      dohCf: '',
    },
    {
      retail: 'Coesti',
      stockUn: '1,417.502',
      averageUn: '',
      dohUn: '',
      stockCf: '1,408.792',
      averageCf: '150.356',
      dohCf: '',
    },
    {
      retail: 'Oxxo',
      stockUn: '1,417.502',
      averageUn: '',
      dohUn: '',
      stockCf: '1,408.792',
      averageCf: '150.356',
      dohCf: '',
    },
  ];
  listProduct: any = [
    {
      category: 'NABS',
      stockUn: '951.543',
      averageUn: '206.269',
      dohUn: '4,6',
      stockCf: '951,543',
      averageCf: '206.269',
      dohCf: '4,6',
    },
  ];

  barChartOptions = {
    responsive: true,
    scales: {
      x: {
        stacked: true,
      },
      y: {
        stacked: true,
      },
    },
  };
  barChartLabels = ['January', 'February', 'March', 'April', 'May'];
  barChartType = 'bar';
  barChartLegend = true;
  barChartData = [
    { data: [65, 59, 80, 81, 56], label: 'Sales' },
    { data: [28, 48, 40, 19, 86], label: 'Expenses' },
  ];

  constructor(
    public deviceDetectorService: DeviceDetectorService,
    private http: HttpClient
    ) {
    this.isMobile = this.deviceDetectorService.isMobile;
    this.isTablet = this.deviceDetectorService.isTablet;
    this.isDesktop = this.deviceDetectorService.isDesktop;
  }

  ngAfterViewInit() {
    const url = 'https://maps.clockworkmicro.com/streets/v1/style?x-api-key=';
    const apiKey = 'Dr4eW3s233rRkk8I_public';

    this.map = new Map({
      container: this.mapContainer.nativeElement,
      style: 'https://api.maptiler.com/maps/streets/style.json?key=get_your_own_OpIi9ZULNHzrESv6T2vL',
      center: [-77.0428, -12.0464],
      zoom: 3.2,
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

  ngOnInit() {
  }

  onChange(result: Date[]): void {
    console.log('onChange: ', result);
  }

  getWeek(result: Date[]): void {
    console.log('week: ', result.map(getISOWeek));
  }

}
