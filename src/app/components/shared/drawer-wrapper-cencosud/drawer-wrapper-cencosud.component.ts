import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NzDrawerModule } from 'ng-zorro-antd/drawer';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { NzPopoverModule } from 'ng-zorro-antd/popover';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import { UtilService } from '../../../util.service';
import Constantes from '../../../util/constants/constantes';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { de } from 'date-fns/locale';

@Component({
  selector: 'app-drawer-wrapper-cencosud',
  standalone: true,
  imports: [CommonModule, FormsModule, NzDrawerModule, NzIconModule, NzAvatarModule, NzPopoverModule, NzSelectModule],
  templateUrl: './drawer-wrapper-cencosud.component.html',
  styleUrl: './drawer-wrapper-cencosud.component.scss'
})
export class DrawerWrapperCencosudComponent {
  private _filterItems: any;
  user: any = {};
  isCollapsed: boolean = false;
  // data for filters menu
  dataFilterDireccion: any = [];
  dataFilterGerencia: any = [];
  dataFilterFormato: any = [];
  dataFilterSubCanal: any = [];
  dataFilterTiendaBackus: any = [];
  dataFilterCodTienda: any = [];
  dataFilterRubro: any = [];
  dataFilterDescProducto: any = [];
  dataFilterCodCencosud: any = [];
  dataFilterMarca: any = [];

  // ngModelo for Tag Options
  listOfTagOptionsDireccion: any = [];
  listOfTagOptionsGerencia: any = [];
  listOfTagOptionsFormato: any = [];
  listOfTagOptionsSubCanal: any = [];
  listOfTagOptionsTiendaBackus: any = [];
  listOfTagOptionsCodTienda: any = [];
  listOfTagOptionsRubro: any = [];
  listOfTagOptionsDescProducto: any = [];
  listOfTagOptionsCodCencosud: any = [];
  listOfTagOptionsMarca: any = [];

  // data for filters menu
  isShowFilterDireccion: boolean = true;
  isShowFilterGerencia: boolean = true;
  isShowFilterFormato: boolean = true;
  isShowFilterSubCanal: boolean = true;
  isShowFilterTiendaBackus: boolean = true;
  isShowFilterCodTienda: boolean = true;
  isShowFilterRubro: boolean = true;
  isShowFilterDescProducto: boolean = true;
  isShowFilterCodCencosud: boolean = true;
  isShowFilterMarca: boolean = true;

  @Input()
  set filterItems(value: any) {
    const userStorage = localStorage.getItem('user');
    this.user = userStorage ? JSON.parse(userStorage) : null;
    if (value && typeof value[Symbol.iterator] === 'function') {
      //Punto de Venta
      //MUCHA DATA TIENE dataFilterDireccion
      this.dataFilterDireccion = value.filter((item: any) => item.filtro === Constantes.Filtro.NOMBRE_BACKUS).flatMap((item: any) => item.valores) ?? [];
      this.dataFilterGerencia = value.filter((item: any) => item.filtro === Constantes.Filtro.RETAIL).flatMap((item: any) => item.valores) ?? [];
      this.dataFilterFormato = value.filter((item: any) => item.filtro === Constantes.Filtro.FORMATO).flatMap((item: any) => item.valores) ?? [];
      this.dataFilterTiendaBackus = value.filter((item: any) => item.filtro === Constantes.Filtro.ZONA_NIELSEN).flatMap((item: any) => item.valores) ?? [];
      this.dataFilterCodTienda = value.filter((item: any) => item.filtro === Constantes.Filtro.GERENCIA_BACKUS).flatMap((item: any) => item.valores) ?? [];
      //MUCHA DATA TIENE dataDescripcionNor
      this.dataFilterRubro = value.filter((item: any) => item.filtro === Constantes.Filtro.DESCRIPCION_NOR).flatMap((item: any) => item.valores) ?? [];
      this.dataFilterDescProducto = value.filter((item: any) => item.filtro === Constantes.Filtro.SUB_CATEGORIA).flatMap((item: any) => item.valores) ?? [];
      this.dataFilterCodCencosud = value.filter((item: any) => item.filtro === Constantes.Filtro.KPI_SKU).flatMap((item: any) => item.valores) ?? [];
      this.dataFilterMarca = value.filter((item: any) => item.filtro === Constantes.Filtro.MARCA).flatMap((item: any) => item.valores) ?? [];
      
    } else {
      // Maneja el caso en el que value no es iterable
      console.error('Error: filterItems is not iterable');
    }
  }

  @Input()
  loadingDataFilterMenu:any = false;

  @Input()
  set typeOptionMenu(value: any) {
    this.showFilterModule(value);
  }

  @Output() changeFilterItems = new EventEmitter<any>();

  constructor(
    private message: NzMessageService,
    public utilService: UtilService,
    private router: Router,
  ) {
    
  }

  // logout() {
  //   localStorage.removeItem('token');
  //   this.router.navigate(['']);
  // }

  collapseDrawer() {
    this.isCollapsed = false;
  }

  //Metodo para que el Collapse se oculte al inicio
  inicioHidenSideBar(): void {
    this.isCollapsed = !this.isCollapsed;
  }

  //Metodo que sirve para ocultar filtros en el menu por módulo
  showFilterModule(filter: string) {
    switch (filter) {
      default: {
        // this.isShowFilterDireccion = false;
        // this.isShowFilterTiendaBackus = false;
        // this.isShowFilterSubcanal = false;
        // this.isShowFilterClusterBackus = false;
        // this.isShowFilterSupervisorBackus = false;
        // this.isShowFilterCDMass = false;
        // this.isShowFilterRubro = false;
        // this.isShowFilterMarca = false;
        // this.isShowFilterTipoEnvase = false;
        break;
      }
    }
  }

  applyFilters() {
    let filterMenu: any = {
      poc_cadena_backus: this.listOfTagOptionsGerencia,
      poc_subcadena_backus: this.listOfTagOptionsFormato,
      poc_direccion_backus: this.listOfTagOptionsSubCanal,
      poc_gerencia_backus: this.listOfTagOptionsCodTienda,
      sku_descripcion_norma_backus: this.listOfTagOptionsRubro,
      sku_subcategoria_backus: this.listOfTagOptionsDescProducto,
      sku_kpi_backus: this.listOfTagOptionsCodCencosud,
    }

    this.changeFilterItems.emit({filterMenu: filterMenu});

  }

}
