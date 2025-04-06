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
  selector: 'app-drawer-wrapper',
  standalone: true,
  imports: [CommonModule, FormsModule, NzDrawerModule, NzIconModule, NzAvatarModule, NzPopoverModule, NzSelectModule],
  templateUrl: './drawer-wrapper.component.html',
  styleUrl: './drawer-wrapper.component.scss'
})
export class DrawerWrapperComponent {
  private _filterItems: any;
  user: any = {};
  isCollapsed: boolean = false;
  // data for filters menu
  dataFilterNombreBackus: any = [];
  dataFilterRetail: any = [];
  dataFilterFormato: any = [];
  dataFilterDireccionBackus: any = [];
  dataFilterZonaNielsen: any = [];
  dataFilterGerenciaBackus: any = [];
  dataFilterSubcanal: any = [];
  dataFilterClusterBackus: any = [];
  dataFilterSupervisorBackus: any = [];
  dataFilterCobertura: any = [];
  dataFilterCDMass: any = [];
  dataFilterDescripcionNor: any = [];
  dataFilterCategoria: any = [];
  dataFilterSubcategoria: any = [];
  dataFilterKPISku: any = [];
  dataFilterMarca: any = [];
  dataFilterTipo: any = [];
  dataFilterCapacidadNor: any = [];
  dataFilterFormatoNor: any = [];
  dataFilterFormatoVenta: any = [];
  dataFilterTipoEnvase: any = [];
  dataFilterServe: any = [];

  // ngModelo for Tag Options
  listOfTagOptionsNombreBackus: any = [];
  listOfTagOptionsRetail: any = [];
  listOfTagOptionsFormato: any = [];
  listOfTagOptionsDireccionBackus: any = [];
  listOfTagOptionsZonaNielsen: any = [];
  listOfTagOptionsGerenciaBackus: any = [];
  listOfTagOptionsSubcanal: any = [];
  listOfTagOptionsClusterBackus: any = [];
  listOfTagOptionsSupervisorBackus: any = [];
  listOfTagOptionsCobertura: any = [];
  listOfTagOptionsCDMass: any = [];
  listOfTagOptionsDescripcionNor: any = [];
  listOfTagOptionsCategoria: any = [];
  listOfTagOptionsSubcategoria: any = [];
  listOfTagOptionsKPISku: any = [];
  listOfTagOptionsMarca: any = [];
  listOfTagOptionsTipo: any = [];
  listOfTagOptionsCapacidadNor: any = [];
  listOfTagOptionsFormatoNor: any = [];
  listOfTagOptionsFormatoVenta: any = [];
  listOfTagOptionsTipoEnvase: any = [];
  listOfTagOptionsServe: any = [];

  // data for filters menu
  isShowFilterNombreBackus: boolean = true;
  isShowFilterRetail: boolean = true;
  isShowFilterFormato: boolean = true;
  isShowFilterDireccionBackus: boolean = true;
  isShowFilterZonaNielsen: boolean = true;
  isShowFilterGerenciaBackus: boolean = true;
  isShowFilterSubcanal: boolean = true;
  isShowFilterClusterBackus: boolean = true;
  isShowFilterSupervisorBackus: boolean = true;
  isShowFilterCobertura: boolean = true;
  isShowFilterCDMass: boolean = true;
  isShowFilterDescripcionNor: boolean = true;
  isShowFilterCategoria: boolean = true;
  isShowFilterSubcategoria: boolean = true;
  isShowFilterKPISku: boolean = true;
  isShowFilterMarca: boolean = true;
  isShowFilterTipo: boolean = true;
  isShowFilterCapacidadNor: boolean = true;
  isShowFilterFormatoNor: boolean = true;
  isShowFilterFormatoVenta: boolean = true;
  isShowFilterTipoEnvase: boolean = true;
  isShowFilterServe: boolean = true;

  @Input()
  set filterItems(value: any) {
    const userStorage = localStorage.getItem('user');
    this.user = userStorage ? JSON.parse(userStorage) : null;
    if (value && typeof value[Symbol.iterator] === 'function') {
      //Punto de Venta
      //MUCHA DATA TIENE dataFilterNombreBackus
      this.dataFilterNombreBackus = value.filter((item: any) => item.filtro === Constantes.Filtro.NOMBRE_BACKUS).flatMap((item: any) => item.valores) ?? [];
      this.dataFilterRetail = value.filter((item: any) => item.filtro === Constantes.Filtro.RETAIL).flatMap((item: any) => item.valores) ?? [];
      this.dataFilterFormato = value.filter((item: any) => item.filtro === Constantes.Filtro.FORMATO).flatMap((item: any) => item.valores) ?? [];
      this.dataFilterDireccionBackus = value.filter((item: any) => item.filtro === Constantes.Filtro.DIRECCION_BACKUS).flatMap((item: any) => item.valores) ?? [];
      this.dataFilterZonaNielsen = value.filter((item: any) => item.filtro === Constantes.Filtro.ZONA_NIELSEN).flatMap((item: any) => item.valores) ?? [];
      this.dataFilterGerenciaBackus = value.filter((item: any) => item.filtro === Constantes.Filtro.GERENCIA_BACKUS).flatMap((item: any) => item.valores) ?? [];
      this.dataFilterSubcanal = value.filter((item: any) => item.filtro === Constantes.Filtro.SUB_CANAL_BACKUS).flatMap((item: any) => item.valores) ?? [];
      this.dataFilterClusterBackus = value.filter((item: any) => item.filtro === Constantes.Filtro.CLUSTER_BACKUS).flatMap((item: any) => item.valores) ?? [];
      this.dataFilterSupervisorBackus = value.filter((item: any) => item.filtro === Constantes.Filtro.SUPERVISOR_BACKUS).flatMap((item: any) => item.valores) ?? [];
      this.dataFilterCobertura = value.filter((item: any) => item.filtro === Constantes.Filtro.COBERTURA).flatMap((item: any) => item.valores) ?? [];
      this.dataFilterCDMass = value.filter((item: any) => item.filtro === Constantes.Filtro.CD_MASS).flatMap((item: any) => item.valores) ?? [];
      //MUCHA DATA TIENE dataDescripcionNor
      this.dataFilterDescripcionNor = value.filter((item: any) => item.filtro === Constantes.Filtro.DESCRIPCION_NOR).flatMap((item: any) => item.valores) ?? [];
      this.dataFilterCategoria = value.filter((item: any) => item.filtro === Constantes.Filtro.CATEGORIA).flatMap((item: any) => item.valores) ?? [];
      this.dataFilterSubcategoria = value.filter((item: any) => item.filtro === Constantes.Filtro.SUB_CATEGORIA).flatMap((item: any) => item.valores) ?? [];
      this.dataFilterKPISku = value.filter((item: any) => item.filtro === Constantes.Filtro.KPI_SKU).flatMap((item: any) => item.valores) ?? [];
      this.dataFilterMarca = value.filter((item: any) => item.filtro === Constantes.Filtro.MARCA).flatMap((item: any) => item.valores) ?? [];
      this.dataFilterTipo = value.filter((item: any) => item.filtro === Constantes.Filtro.TIPO).flatMap((item: any) => item.valores) ?? [];
      this.dataFilterCapacidadNor = value.filter((item: any) => item.filtro === Constantes.Filtro.CAPACIDAD_NOR).flatMap((item: any) => item.valores) ?? [];
      this.dataFilterFormatoNor = value.filter((item: any) => item.filtro === Constantes.Filtro.FORMATO_NOR).flatMap((item: any) => item.valores) ?? [];
      this.dataFilterFormatoVenta = value.filter((item: any) => item.filtro === Constantes.Filtro.FORMATO_DE_VENTA).flatMap((item: any) => item.valores) ?? [];
      this.dataFilterTipoEnvase = value.filter((item: any) => item.filtro === Constantes.Filtro.TIPO_DE_ENVASE).flatMap((item: any) => item.valores) ?? [];
      this.dataFilterServe = value.filter((item: any) => item.filtro === Constantes.Filtro.SERVE).flatMap((item: any) => item.valores) ?? [];
      
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
        this.isShowFilterNombreBackus = false;
        this.isShowFilterZonaNielsen = false;
        this.isShowFilterSubcanal = false;
        this.isShowFilterClusterBackus = false;
        this.isShowFilterSupervisorBackus = false;
        this.isShowFilterCDMass = false;
        this.isShowFilterDescripcionNor = false;
        this.isShowFilterMarca = false;
        this.isShowFilterTipoEnvase = false;
        break;
      }
    }
  }

  applyFilters() {
    let filterMenu: any = {
      // nombre_backus: this.listOfTagOptionsNombre,
      poc_cadena_backus: this.listOfTagOptionsRetail,
      poc_subcadena_backus: this.listOfTagOptionsFormato,
      poc_direccion_backus: this.listOfTagOptionsDireccionBackus,
      // zona_nielsen: this.listOfTagOptionsZona,
      poc_gerencia_backus: this.listOfTagOptionsGerenciaBackus,
      // sub_canal_backus: this.listOfTagOptionsSubCanalBackus,
      // cluster_backus: this.listOfTagOptionsCluster,
      // supervisor_backus: this.listOfTagOptionsSupervisor,
      sku_cobertura_backus: this.listOfTagOptionsCobertura,
      // cd_mass: this.listOfTagOptionsCdMass,
      sku_descripcion_norma_backus: this.listOfTagOptionsDescripcionNor,
      sku_categoria_backus: this.listOfTagOptionsCategoria,
      sku_subcategoria_backus: this.listOfTagOptionsSubcategoria,
      sku_kpi_backus: this.listOfTagOptionsKPISku,
      // sku_marca_backus: this.listOfTagOptionsMarca,
      sku_tipo_backus: this.listOfTagOptionsTipo,
      sku_capacidad_norma_backus: this.listOfTagOptionsCapacidadNor,
      sku_formato_norma_backus: this.listOfTagOptionsFormatoNor,
      sku_formato_venta_backus: this.listOfTagOptionsFormatoVenta,
      // tipo_de_envase: this.listOfTagOptionsTipoEnvase,
      sku_serve_backus: this.listOfTagOptionsServe,
    }

    this.changeFilterItems.emit({filterMenu: filterMenu});

  }

}
