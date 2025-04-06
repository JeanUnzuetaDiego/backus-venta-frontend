import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router'; // Importa Router

import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { NzTabPosition } from 'ng-zorro-antd/tabs';
import { RouterModule } from '@angular/router';
import { NzListModule } from 'ng-zorro-antd/list';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzGridModule } from 'ng-zorro-antd/grid';

import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzSliderModule } from 'ng-zorro-antd/slider';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { NzPopoverModule } from 'ng-zorro-antd/popover';
import { NzButtonModule } from 'ng-zorro-antd/button';


@Component({
  selector: 'app-main',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    NzSliderModule,
    NzIconModule,
    NzDatePickerModule,
    NzTableModule,
    NzInputModule,
    NzGridModule,
    NzSelectModule,
    NzLayoutModule,
    NzListModule,
    NzMenuModule,
    NzTabsModule,
    RouterModule,
    NzAvatarModule,
    NzPopoverModule,
    NzButtonModule
  ],
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],
})
export class MainComponent {
  user: any = {};
  currentRoute: string = '';

  listMenu = [
    [
      ['portada', 'mt/portada', 'Portada'],
      ['kasummary', 'mt/ventas', 'KA Summary'],
      ['analisisprecios', 'mt/analisis-precios', 'Analisis Precios'],
      ['tablaautogestion', 'mt/autogestion', 'Tabla Autogestion'],
      ['ventadiario', 'mt/venta-diario', 'Venta Diario'],
      ['stockdOH', 'mt/stock-doh', 'Stock DOH'],
      ['samestoresales', 'mt/same-store-sales', 'Same Store Sales']
    ],
    [
      ['portada', 'cencosud/portada', 'Portada'],
      ['share', 'cencosud/share', 'Share'],
      ['tienda', 'cencosud/tienda', 'Tienda'],
    ],
    [
      // ['EQ Portada','equivalencia/portada-equivalencias'],
      ['skus','equivalencia/skus-informados', 'SKU'],
      //['SKUs no Informados','equivalencia/skus-no-informados'],
      //['SKUs Vacios','equivalencia/skus-vacios'],
      ['tiendas','equivalencia/tiendas-informadas', 'Tienda'],
      // ['Tiendas','tiendas-no-informadas'],
      //['Tiendas En Blanco','tiendas-en-blanco']
    ],
    [
      ['config','configuracion/permisos', 'Configuración'],
      // ['config_sku_informado','configuracion/sku-informado', 'SKU Informado'],
      ['config_usuarios','configuracion/users', 'Administrar Usuarios'],
    ],
    [
      ['descargables','descarga/principal', 'Principal']
    ],
    [
      // ['cencosud','cargar/cencosud','Cencosud'],
      ['coesti','cargar/coesti','Coesti'],
      ['oxxo','cargar/oxxo','Oxxo'],
      // ['supesa','cargar/supesa','Supesa'],
      // ['tambo','cargar/tambo','Tambo'],
      // ['tottus','cargar/tottus','Tottus'],
      // ['vega','cargar/vega','Vega']
    ]
  ];

  listTitle: { name: string; current: string; subtitles: { name: string; link: string; visible: boolean }[] }[] = [
    { name: 'MT', current:'mt', subtitles: [] },
    { name: 'Cencosud', current:'cencosud', subtitles: [] },
    { name: 'Equivalencias', current:'equivalencia', subtitles: [] },
    { name: 'Configuracion', current:'configuracion', subtitles: [] },
    { name: 'Descarga', current:'descarga', subtitles: [] },
    { name: 'Carga', current:'cargar', subtitles: [] },
];

  nzTabPosition: NzTabPosition = 'bottom';
  selectedIndex = 27;

  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  log(args: any[]): void {
  }
  constructor(private router: Router) {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.currentRoute = event.urlAfterRedirects.slice(1);
      }
    });
    // const userStorage = localStorage.getItem('user');
    // this.user = userStorage ? JSON.parse(userStorage) : null;
  } // Inyecta Router en el constructor

  isLoginPage(): boolean {
    return this.router.url === '/login'; // Comprueba si la ruta actual es '/login'
  }

  ngOnInit(): void {
    // this.user = localStorage.getItem('user');
    const userStorage = localStorage.getItem('user');
    this.user = userStorage ? JSON.parse(userStorage) : null;
    // this.user = JSON.parse(localStorage.getItem('user')),
    const objetoServicio = this.user.configRol;
    const tabsTransformados = Object.keys(objetoServicio).map((clave) => {
      return this.createMenu(objetoServicio, clave);
    });
    const tabsFiltrados = tabsTransformados.filter((tab) => tab !== null);
    const menuMT = tabsFiltrados.filter(item => item.menu === "MT");
    const menuCencosud = tabsFiltrados.filter(item => item.menu === "Cencosud");
    const menuEquivalencias = tabsFiltrados.filter(item => item.menu === "Equivalencias");
    const menuConfiguracion = tabsFiltrados.filter(item => item.menu === "Configuracion");
    const menuDescargables = tabsFiltrados.filter(item => item.menu === "Descarga");
    const menuCarga = tabsFiltrados.filter(item => item.menu === "Carga").sort((a, b) => a.name.localeCompare(b.name));
    this.listTitle[0].subtitles = menuMT;
    this.listTitle[1].subtitles = menuCencosud;
    this.listTitle[2].subtitles = menuEquivalencias;
    this.listTitle[3].subtitles = menuConfiguracion;
    this.listTitle[4].subtitles = menuDescargables;
    this.listTitle[5].subtitles = menuCarga;
  }

  createMenu(objetoServicio: any, clave: any) {
    if (clave.startsWith('mt')) {
      const nombrePestana = clave.replace(/^mt_|_/g, '');

      const coincidencia = this.listMenu[0].find((value: any) => {
        let title = value[0].replace(/^mt_| /g, '').toLowerCase();

        if (title === nombrePestana.toLowerCase().trim()) {
          return value[0];
        }
      });
      if (coincidencia && objetoServicio[clave] == true) {
        return {
          name: coincidencia[2],
          menu: 'MT',
          link: coincidencia[1],
          visible: objetoServicio[clave],
        };
      }
    }
    if (clave.startsWith('cencosud')) {
      const nombrePestana = clave.replace(/^cencosud_|_/g, '');

      const coincidencia = this.listMenu[1].find((value: any) => {
        let title = value[0].replace(/^cencosud_| /g, '').toLowerCase();

        if (title === nombrePestana.toLowerCase().trim()) {
          return value[0];
        }
      });
      if (coincidencia && objetoServicio[clave] == true) {
        return {
          name: coincidencia[2],
          menu: 'Cencosud',
          link: coincidencia[1],
          visible: objetoServicio[clave],
        };
      }
    }
    if (clave.startsWith('eq')) {
      const nombrePestana = clave.replace(/^eq_|_/g, '');
      const coincidencia = this.listMenu[2].find((value: any) => {
        let title = value[0].replace(/^eq_| /g, '').toLowerCase();
        if(title =='eqportada') title = "portada"
        if (title === nombrePestana.toLowerCase().trim()) {
          return value[0];
        }
      });
      if (coincidencia && objetoServicio[clave] == true) {
        return {
          name: coincidencia[2],
          menu: 'Equivalencias',
          link: coincidencia[1],
          visible: objetoServicio[clave],
        };
      }
    }
    if (clave.startsWith('config')) {
      const coincidencia = this.listMenu[3].find((value: any) => {
        let title = value[0]
        if (title === clave.toLowerCase().trim()) {
          return value[0];
        }
      });
      if (coincidencia && objetoServicio[clave] == true && objetoServicio["rol"] == 'admin') {
        return {
          name: coincidencia[2],
          menu: 'Configuracion',
          link: coincidencia[1],
          visible: objetoServicio[clave],
        };
      }
    }
    if (clave.startsWith('descargables')) {
      const coincidencia = this.listMenu[4].find((value: any) => {
        let title = value[0]
        if (title === clave.toLowerCase().trim()) {
          return value[0];
        }
      });
      if (coincidencia && objetoServicio[clave] == true) {
        return {
          name: coincidencia[2],
          menu: 'Descarga',
          link: coincidencia[1],
          visible: objetoServicio[clave],
        };
      }
    }
    if (clave.startsWith('carga')) {
      const nombrePestana = clave.replace(/^carga_|_/g, '');

      const coincidencia = this.listMenu[5].find((value: any) => {
        let title = value[0].replace(/^carga_| /g, '').toLowerCase();

        if (title === nombrePestana.toLowerCase().trim()) {
          return value[0];
        }
      });
      if (coincidencia && objetoServicio[clave] == true) {
        return {
          name: coincidencia[2],
          menu: 'Carga',
          link: coincidencia[1],
          visible: objetoServicio[clave],
        };
      }
    }
    return null;
  }

  toNavigateRote(tab: any): void {
    this.router.navigate([tab.link]);
  }

  // logout() {
  //   this.router.navigate(['']);
  // }
  logout() {
    localStorage.removeItem('token');
    this.router.navigate(['']);
  }
}
