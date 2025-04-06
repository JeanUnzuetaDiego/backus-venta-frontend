import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { Router } from '@angular/router';  // Importa Router

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

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, NzSliderModule, NzIconModule, NzDatePickerModule, NzTableModule, NzInputModule, NzGridModule, NzSelectModule,  NzLayoutModule, NzListModule, NzMenuModule, NzTabsModule, RouterModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  isCollapsed = false;
  tabs: Array<{ name: string; link: string, disabled: boolean }> = [
    {
    name: 'KA Summary',
    link: 'ventas',
    disabled: false
    },
    /* {
      name: 'Daily Focus',
      link: 'daily-focus',
      disabled: false
    },
    {
      name: 'Mapa DOH (RB)',
      link: 'mapa-doh-nrb',
      disabled: false
    }, */
    /* {
    name: 'Same Store Sales',
    link: 'dashboard',
    disabled: false
    },
    {
    name: 'Evolución HL vs LY',
    link: 'welcome',
    disabled: false
    }, */
    {
    name: 'Análisis Precios',
    link: 'analisis-precios',
    disabled: false
    },
    /* {
    name: 'Performance',
    link: 'welcome',
    disabled: false
    }, */
    {
    name: 'Tabla Autogestión',
    link: 'autogestion',
    disabled: false
    },
    /* {
    name: 'Venta Tiendas',
    link: 'welcome',
    disabled: false
    },
    {
    name: 'Ventas Tiendas Semanal',
    link: 'welcome',
    disabled: false
    },
    {
    name: 'Ventas Tiendas Diario',
    link: 'welcome',
    disabled: false
    },
    {
    name: 'Stock & DOH',
    link: 'welcome',
    disabled: false
    }, */
    /* {
    name: 'Mapa DOH (NRB)',
    link: 'welcome',
    disabled: false
    }, */
    /* {
    name: 'Stock | DOH | Sugerido',
    link: 'welcome',
    disabled: false
    },
    {
    name: 'DOH Tiendas + CD',
    link: 'welcome',
    disabled: false
    },
    {
    name: 'Quiebres',
    link: 'welcome',
    disabled: false
    },
    {
    name: 'Stock Inmovilizado',
    link: 'welcome',
    disabled: false
    },
    {
    name: 'Stock Diario',
    link: 'welcome',
    disabled: false
    },
    {
    name: 'Venta Perdida PVP',
    link: 'welcome',
    disabled: false
    },
    {
    name: 'Base Venta Perdida PVP',
    link: 'welcome',
    disabled: false
    },
    {
    name: 'Data Quality',
    link: 'welcome',
    disabled: false
    },
    {
    name: 'Campaña',
    link: 'welcome',
    disabled: false
    }, */
] ;
  nzTabPosition: NzTabPosition = 'bottom';
  selectedIndex = 27;

  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  log(args: any[]): void {
    console.log(args);
  }
  constructor(private router: Router) { }  // Inyecta Router en el constructor

  isLoginPage(): boolean {
    return this.router.url === '/login';  // Comprueba si la ruta actual es '/login'
  }

  ngOnInit(): void {

  }
}
