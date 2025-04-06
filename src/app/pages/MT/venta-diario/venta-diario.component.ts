import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { Router, RouterModule } from '@angular/router';
import { NzListModule } from 'ng-zorro-antd/list';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzPopoverModule } from 'ng-zorro-antd/popover';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { FormsModule } from '@angular/forms';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { NzPaginationModule } from 'ng-zorro-antd/pagination';
import { NzDrawerModule } from 'ng-zorro-antd/drawer';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzDatePickerComponent, NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzSliderModule } from 'ng-zorro-antd/slider';
import { DeviceDetectorService } from '../../../services/device-detector.service';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { format, startOfMonth, setMonth, differenceInCalendarDays, subDays } from 'date-fns';
import { es } from 'date-fns/locale';
import { UtilService } from '../../../util.service'
import { VentaDiarioService } from './venta-diario.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { FilterSearchTableComponent } from '../../../components/shared/filter-search-table/filter-search-table.component';
import Constantes from '../../../util/constants/constantes';
import { DrawerWrapperComponent } from '../../../components/shared/drawer-wrapper/drawer-wrapper.component';
import { v4 as uuidv4 } from "uuid";

@Component({
  selector: 'app-analisis-precios',
  standalone: true,
  imports: [CommonModule, FormsModule, NzPaginationModule, NzDrawerModule, DrawerWrapperComponent, FilterSearchTableComponent, NzAvatarModule, NzToolTipModule, NzPopoverModule, NzButtonModule, NzSliderModule, NzSpinModule, NzIconModule, NzDatePickerModule, NzTableModule, NzInputModule, NzGridModule, NzSelectModule, NzLayoutModule, NzListModule, NzMenuModule, NzTabsModule, RouterModule, NzModalModule, NzCheckboxModule],
  templateUrl: './venta-diario.component.html',
  styleUrl: './venta-diario.component.scss'
})
export class VentaDiarioComponent implements OnInit, AfterViewInit {
  @ViewChild('filterEndDatePicker') filterEndDatePicker!: NzDatePickerComponent;

  dataAutogestionTable: any = [];

  isDesktop: boolean = false;
  isMobile: boolean = false;
  isTablet: boolean = false;

  filterStartDate: Date | null = null;
  filterEndDate: Date | null = null;
  filterIntervalYear: string = '1';
  filterMenu: any = {};
  pageIndex: number = 1;
  pageSize: number = 10;
  total: number = 0;
  importeVentaTotal = '0.00';
  importeHLTotal = '0.00';
  typeOptionMenu: string = 'venta-diario';

  totalColumnMonths: number = 0;
  totalPrecioVenta: number = 0;
  totalVentaUn: number = 0;
  totalPrecioCosto: number = 0;
  totalHl: number = 0;
  totalRetailTable: any = { mix: 0, mixpa: 0, sohl: 0, sohlpa: 0, var: 0 };

  user: any = {};
  today = new Date();

  //Filters Table
  filterNameDireccion: any[] = [];
  filterNameGerencia: any[] = [];
  filterNameSubCanal: any[] = [];
  filterNameRetail: any[] = [];
  filterNameFormato: any[] = [];
  filterNameCategoria: any[] = [];
  filterNameKpiSku: any[] = [];
  filterNameMarca: any[] = [];

  listConfigurationMenu: any[] = [];

  selectedFilterNameDireccion: any[] = [];
  selectedFilterNameGerencia: any[] = [];
  selectedFilterNameSubCanal: any[] = [];
  selectedFilterNameRetail: any[] = [];
  selectedFilterNameFormato: any[] = [];
  selectedFilterNameCodTiendaB2B: any[] = [];
  selectedFilterNameDescTienda: any[] = [];
  selectedFilterNameCategoria: any[] = [];
  selectedFilterNameKpiSku: any[] = [];
  selectedFilterNameMarca: any[] = [];
  selectedFilterNameCodSkuB2B: any[] = [];
  selectedFilterNameCodSkuBackus: any[] = [];

  loadingDataFilterMenu: boolean = false;
  loadingDataFilterDate: boolean = false;
  loaderAutogestionTable: boolean = false;

  selectedFilterNameAll: any[] = [];
  listFilterMenu: any[] = [];
  
  dataResumenKpiGestion: any = {};

  constructor(
    public deviceDetectorService: DeviceDetectorService,
    public ventaDiarioService: VentaDiarioService,
    private message: NzMessageService,
    public utilService: UtilService,
    private router: Router,
  ) {
    this.isMobile = this.deviceDetectorService.isMobile;
    this.isTablet = this.deviceDetectorService.isTablet;
    this.isDesktop = this.deviceDetectorService.isDesktop;
  }
  async ngOnInit() { }

  async ngAfterViewInit() {
    const userStorage = localStorage.getItem('user');
    this.user = userStorage ? JSON.parse(userStorage) : null;
    if (!this.user) {
      this.message.error('No existe token de sesión, por favor inicie sesión');
      this.router.navigate(['']);
    }
    this.initializeFilterDate();
    this.loadData();
    this.loadDataMenu();
  }

  initializeFilterDate(): void {
    // Calcula las fechas de inicio y fin del mes actual
    this.filterEndDate = subDays(this.today, 1);
    this.filterStartDate = startOfMonth(this.filterEndDate);
  }

  async loadData() {
    const startDate = format(this.filterStartDate, Constantes.FormatDate.DATE)
    const endDate = format(this.filterEndDate, Constantes.FormatDate.DATE)
    this.selectedFilterNameAll= [];
    this.selectedFilterNameAll.push({key: Constantes.Filtro.DIRECCION_BACKUS, value: this.selectedFilterNameDireccion});
    this.selectedFilterNameAll.push({key: Constantes.Filtro.GERENCIA_BACKUS, value: this.selectedFilterNameGerencia});
    this.selectedFilterNameAll.push({key: Constantes.Filtro.SUB_CANAL_BACKUS, value: this.selectedFilterNameSubCanal});
    this.selectedFilterNameAll.push({key: Constantes.Filtro.RETAIL, value: this.selectedFilterNameRetail});
    this.selectedFilterNameAll.push({key: Constantes.Filtro.FORMATO, value: this.selectedFilterNameFormato});
    this.selectedFilterNameAll.push({key: Constantes.Filtro.POC_CADENA, value: this.selectedFilterNameCodTiendaB2B});
    this.selectedFilterNameAll.push({key: Constantes.Filtro.POC, value: this.selectedFilterNameDescTienda});
    this.selectedFilterNameAll.push({key: Constantes.Filtro.CATEGORIA, value: this.selectedFilterNameCategoria});
    this.selectedFilterNameAll.push({key: Constantes.Filtro.KPI_SKU, value: this.selectedFilterNameKpiSku});
    this.selectedFilterNameAll.push({key: Constantes.Filtro.MARCA, value: this.selectedFilterNameMarca});
    this.selectedFilterNameAll.push({key: Constantes.Filtro.SKU_CADENA, value: this.selectedFilterNameCodSkuB2B});
    this.selectedFilterNameAll.push({key: Constantes.Filtro.SKU, value: this.selectedFilterNameCodSkuBackus});
   
    this.loaderAutogestionTable = true;

    let configurationDataAutogestion, configurationDataKpiGestion, configurationValues, configurationTableKpiSku, configurationTableRetail, configurationTableTopBackus;

    try {
      const result: any =
      await this.ventaDiarioService.configurationDataVentaDiario(
        startDate, endDate, this.pageIndex, this.pageSize, JSON.stringify(this.listFilterMenu), this.selectedFilterNameAll,
      );
      // configurations result
      [
        configurationDataKpiGestion,
      ] = await Promise.all([
        this.ventaDiarioService.configurationDataKpiGestion(startDate, endDate, this.filterIntervalYear, JSON.stringify(this.listFilterMenu), this.selectedFilterNameAll),

      ]);
      configurationDataAutogestion = result?.data
      this.total = result?.pagination?.total
      this.loaderAutogestionTable = false;
      this.loadingDataFilterDate = false;

      if (result.filters) {
      }

    // Calcular el total de la tabla de Kpi Gestion - cremientoHl
    this.dataResumenKpiGestion = configurationDataKpiGestion[0];
    if (parseFloat(this.dataResumenKpiGestion.totalhl) && parseFloat(this.dataResumenKpiGestion.totalhlpa) > 0) {
      this.dataResumenKpiGestion.totalhlCrecimiento = ( (parseFloat(this.dataResumenKpiGestion.totalhl) - parseFloat(this.dataResumenKpiGestion.totalhlpa) ) / parseFloat(this.dataResumenKpiGestion.totalhlpa)) * 100;
      this.dataResumenKpiGestion.totalhlCrecimiento = this.dataResumenKpiGestion?.totalhlCrecimiento?.toFixed(2);
    }

    // Calcular el total de la tabla de Kpi Gestion - cremientoMonto
    if (parseFloat(this.dataResumenKpiGestion.totalamount) && parseFloat(this.dataResumenKpiGestion.totalamountpa) > 0) {
      this.dataResumenKpiGestion.totalamountCrecimiento = ( (parseFloat(this.dataResumenKpiGestion.totalamount) - parseFloat(this.dataResumenKpiGestion.totalamountpa) ) / parseFloat(this.dataResumenKpiGestion.totalamountpa)) * 100;
      this.dataResumenKpiGestion.totalamountCrecimiento = this.dataResumenKpiGestion?.totalamountCrecimiento?.toFixed(2);
    }

    this.importeHLTotal = this.utilService.formatearNumeroConComas(this.dataResumenKpiGestion?.totalhl);
    this.importeVentaTotal = this.utilService.formatearNumeroConComas(this.dataResumenKpiGestion?.totalamount);

    this.dataResumenKpiGestion.totalpriceuni = this.utilService.formatearNumeroConComas(this.dataResumenKpiGestion?.totalpriceuni);
    this.dataResumenKpiGestion.totalstockhl = this.utilService.formatearNumeroConComas(this.dataResumenKpiGestion?.totalstockhl);
    this.dataResumenKpiGestion.totalstockuni = this.utilService.formatearNumeroConComas(this.dataResumenKpiGestion?.totalstockuni);

    } catch (error:any) {
      if(error.status == 401){
        this.message.error('Tu sesion se ha acabado o cerrado, te redirecionaremos al inicio de sesion');
        localStorage.removeItem('token');
        this.loaderAutogestionTable = false;
        this.loadingDataFilterDate = false;
        this.router.navigate(['/login'])
      }else{
        this.message.error('Error al cargar los datos');
        console.log('Error al cargar los datos:', error);
        this.loaderAutogestionTable = false;
        this.loadingDataFilterDate = false;
      }
    }

    configurationDataAutogestion?.forEach((item: any) => {
      let fechaParts = item.fecha.split('-');
      let anio = fechaParts[0];
      let mesNum = Number(fechaParts[1]) - 1;  // Obtiene el mes como un número de 0 (enero) a 11 (diciembre)
      let mes = format(setMonth(new Date(), mesNum), Constantes.FormatDate.MONTH_DES, { locale: es });
      mes = mes.charAt(0).toUpperCase() + mes.slice(1);  // Convierte la primera letra a mayúscula
      item.year = anio;
      item.month = mes;
    });

    this.dataAutogestionTable = configurationDataAutogestion;
    this.totalPrecioVenta = this.dataAutogestionTable.reduce((sum: number, item: any) => { let precio_venta = parseFloat(item.precio_venta); return isNaN(precio_venta) ? sum : sum + precio_venta;}, 0);
    this.totalVentaUn = this.dataAutogestionTable.reduce((sum: number, item: any) => { let venta_un = parseFloat(item.venta_un); return isNaN(venta_un) ? sum : sum + venta_un;}, 0);
    this.totalPrecioCosto = this.dataAutogestionTable.reduce((sum: number, item: any) => { let precio_costo = parseFloat(item.precio_costo); return isNaN(precio_costo) ? sum : sum + precio_costo;}, 0);
    this.totalHl = this.dataAutogestionTable.reduce((sum: number, item: any) => { let hl = parseFloat(item.hl); return isNaN(hl) ? sum : sum + hl;}, 0);
   
  }

  async loadDataMenu() {
    this.loaderAutogestionTable = true;
    this.loadingDataFilterMenu = true;
    let configurationValues;
    try {
      [
        configurationValues,
      ] = await Promise.all([
        this.ventaDiarioService.getConfigValues(),
      ]);
    } catch (error) {
      console.error('Error al cargar los datos:', error);
      this.loadingDataFilterMenu = false;
    }
    
    this.loadingDataFilterMenu = false;
    this.listConfigurationMenu = configurationValues;
  }

  disabledFilterStartDate = (startValue: Date): boolean => {
    if (!startValue || !this.filterEndDate) {
      return false;
    }
    return startValue.getTime() > this.filterEndDate.getTime() || differenceInCalendarDays(startValue, this.today) > 0;
  };

  disabledFilterEndDate = (endValue: Date): boolean => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    return endValue.getTime() > yesterday.getTime();
  };

  handleFilterStartDateOpenChange(open: boolean): void {
    if (!open) {
      this.filterEndDatePicker.open();
    }
  }

  async handleFilterDireccion({ selectedFilterItems, filterItems }: any) {
    this.filterNameDireccion = selectedFilterItems.map((item: any) => ({
      text: item,
      value: item,
    }));
    this.selectedFilterNameDireccion = [...selectedFilterItems];
    this.loadData();
  }

  async handleFilterGerencia({ selectedFilterItems, filterItems }: any) {
    this.filterNameGerencia = selectedFilterItems.map((item: any) => ({
      text: item,
      value: item,
    }));
    this.selectedFilterNameGerencia = [...selectedFilterItems];
    this.loadData();
  }

  async handleFilterSubCanal({ selectedFilterItems, filterItems }: any) {
    this.filterNameSubCanal = selectedFilterItems.map((item: any) => ({
      text: item,
      value: item,
    }));
    this.selectedFilterNameSubCanal = [...selectedFilterItems];
    this.loadData();
  }

  async handleFilterRetail({ selectedFilterItems, filterItems }: any) {
    this.filterNameRetail = selectedFilterItems.map((item: any) => ({
      text: item,
      value: item,
    }));
    this.selectedFilterNameRetail = [...selectedFilterItems];
    this.loadData();
  }

  async handleFilterFormato({ selectedFilterItems, filterItems }: any) {
    this.filterNameFormato = selectedFilterItems.map((item: any) => ({
      text: item,
      value: item,
    }));
    this.selectedFilterNameFormato = [...selectedFilterItems];
    this.loadData();
  }

  async handleFilterCategoria({ selectedFilterItems, filterItems }: any) {
    this.filterNameCategoria = selectedFilterItems.map((item: any) => ({
      text: item,
      value: item,
    }));
    this.selectedFilterNameCategoria = [...selectedFilterItems];
    this.loadData();
  }

  async handleFilterKpiSku({ selectedFilterItems, filterItems }: any) {
    this.filterNameKpiSku = selectedFilterItems.map((item: any) => ({
      text: item,
      value: item,
    }));
    this.selectedFilterNameKpiSku = [...selectedFilterItems];
    this.loadData();
  }

  async handleFilterMarca({ selectedFilterItems, filterItems }: any) {
    this.filterNameMarca = selectedFilterItems.map((item: any) => ({
      text: item,
      value: item,
    }));
    this.selectedFilterNameMarca = [...selectedFilterItems];
    this.loadData();
  }

  async handleFilterMenu({ filterMenu }: any) {
    this.listFilterMenu = filterMenu;
    this.loadData();
  }

  handlePageEvent(pageIndex: number) {
    this.pageIndex = pageIndex;
    this.loadData();
  }

  applyFilters() {
    // this.loadingDataFilterDate = true;
    if (this.filterStartDate && this.filterEndDate) {
      this.loadData();
    }
  }

  async downloadExcel(){
    this.message.success('Su archivo se esta descargando, podra ver su avance en el modulo de descargables.');
    const startDate = format(this.filterStartDate, 'yyyy-MM-dd');
    const endDate = format(this.filterEndDate, 'yyyy-MM-dd');
    const downloadFile = true
    const user = JSON.parse(localStorage.getItem('user'))
    const uuid = uuidv4()
   
    try {
      const response: any =
      await this.ventaDiarioService.configurationDataVentaDiario(
        startDate, endDate, this.pageIndex, this.pageSize, JSON.stringify(this.listFilterMenu), this.selectedFilterNameAll,downloadFile,user.role, user.usuario_id,uuid
      );

    } catch (error: any) {
      if (error.status == 401) {
        this.message.error(
          'Tu sesion se ha acabado o cerrado, te redirecionaremos al inicio de sesion'
        );
        localStorage.removeItem('token');
        this.loaderAutogestionTable = false;
        this.router.navigate(['/login']);
      } else {
        this.message.error('Error al cargar los datos');
        console.log('Error al cargar los datos:', error);
      }
    }

  }

  setFixedToNumber(colum: any) {
    return parseFloat(colum).toLocaleString('en-US', {});
  }
  
}
