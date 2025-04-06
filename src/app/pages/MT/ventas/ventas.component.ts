import { Component, OnInit, AfterViewInit, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { RouterModule } from '@angular/router';
import { NzListModule } from 'ng-zorro-antd/list';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzDatePickerComponent } from 'ng-zorro-antd/date-picker';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { Router } from '@angular/router';
import { NzPopoverModule } from 'ng-zorro-antd/popover';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzNotificationModule } from 'ng-zorro-antd/notification';
import { FormsModule } from '@angular/forms';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { NzDrawerModule } from 'ng-zorro-antd/drawer';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzSliderModule } from 'ng-zorro-antd/slider';
import { differenceInCalendarDays, subDays } from 'date-fns';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzTableSortOrder } from 'ng-zorro-antd/table';
import * as echarts from 'echarts';
import { format, startOfMonth, setMonth } from 'date-fns';
import { es } from 'date-fns/locale';
import { v4 as uuidv4 } from "uuid";
import { VentaService } from './venta.service';
import { UtilService } from '../../../util.service';
import { CapitalizeFirstLetterPipe } from '../../../pipes/capitalize-first-letter.pipe';
import { VentasGraficoModalModule } from './ventas-grafico-modal/ventas-grafico-modal.module';
import { DrawerWrapperComponent } from '../../../components/shared/drawer-wrapper/drawer-wrapper.component';
import { ColumnItemBottom10VarSOHL, ColumnItemMixCadena, ColumnItemMixProducto, ColumnItemPerformanceTopSKU, ColumnItemTop10VarSOHL, DataItemBottom10VarSOHL, DataItemMixCadena, DataItemMixProducto, DataItemPerformanceTopSKU, DataItemTop10VarSOHL, sumTotals } from '../../dto/KASummary.dto';
@Component({
  selector: 'app-ventas',
  standalone: true,
  templateUrl: './ventas.component.html',
  imports: [CommonModule, VentasGraficoModalModule, NzNotificationModule, FormsModule, NzDrawerModule, NzAvatarModule, NzToolTipModule, NzPopoverModule, NzButtonModule, NzSliderModule, NzSpinModule, NzIconModule, NzDatePickerModule, NzTableModule, NzInputModule, NzGridModule, NzSelectModule, NzLayoutModule, NzListModule, NzMenuModule, NzTabsModule, RouterModule, NzModalModule, DrawerWrapperComponent],
  styleUrls: ['./ventas.component.scss'],
  providers: [CapitalizeFirstLetterPipe],
})

export class VentasComponent implements OnInit, AfterViewInit {
  @ViewChild('myChart') contenedorDelGrafico: ElementRef;
  @ViewChild('filterEndDatePicker') filterEndDatePicker!: NzDatePickerComponent;
  isChartLoaded: boolean = false;
  myChart: any;
  isOpenModal: boolean = false;
  datos: any[];
  filterSellOutSelection: string = 'mes';
  filterSellOutOptions: any = ['año', 'mes', 'semana', 'dia'];

  filterStartDate: Date | null = null;
  filterEndDate: Date | null = null;
  filterIntervalYear: string = '1';
  filterMenu: any = {};
  loaderComparativoSellOutGraph: boolean = false;
  loaderSkuTable: boolean = false;
  loaderSubcadenaTable: boolean = false;
  loaderTopBackusTable: boolean = false;
  loaderBottomBackusTable: boolean = false;
  loaderTopDescriptionNorTable: boolean = false;
  user: any = {};
  today = new Date();

  dataVentas: any = [];
  dataVentasModal: any = [];
  dataSkuTable: DataItemMixProducto [] = [];
  dataCadenaTable: DataItemMixCadena [] = [];
  dataTopBackusTable: DataItemTop10VarSOHL [] = [];
  dataBottomBackusTable: DataItemBottom10VarSOHL []= [];
  dataTopDescriptionNorTable: DataItemPerformanceTopSKU [] = [];
  dataResumeAmount: any = {};
  dataMontoSellOut: any = [];

  loadingDataFilterMenu: boolean = false;
  loadingDataFilterDate: boolean = false;

  totalSkuTable: sumTotals = { mix: 0, mixpa: 0, var: 0, sohl: 0, sohlpa: 0 };
  totalCadenaTable: sumTotals = { mix: 0, mixpa: 0, sohl: 0, sohlpa: 0, var: 0 };
  totalTopBackusTable: sumTotals = { sohl: 0, sohlpa: 0, var: 0 };
  totalBottomBackusTable: sumTotals = { sohl: 0, sohlpa: 0, varhl: 0, var: 0 };
  totalTopDescriptionNorTable: sumTotals = { sohl: 0, sohlpa: 0, var: 0 };
  disableButtonArrowUp: boolean = false;
  disableButtonArrowDown: boolean = false;

  totalKPIsGestionSohl: number = 0;
  valueKPISGestionCrecimientoHLPA: number = 0;

  listConfigurationMenu: any[] = [];
  listFilterMenu: any[] = [];
  typeOptionMenu: string = 'ka-summary';

  fecha: Date | null = null;

  // Mix Producto
  listOfColumnMixProducto: ColumnItemMixProducto[] = [
    {
      title: 'KPI SKU',
      sortOrder: 'ascend',
      sortFn: (a: DataItemMixProducto, b: DataItemMixProducto) => a.sku_kpi_backus.localeCompare(b.sku_kpi_backus),
    },
    {
      title: 'Mix %', sortOrder: null,
      sortFn: (a: DataItemMixProducto, b: DataItemMixProducto) => a.mix - b.mix
    },
    {
      title: 'Mix % (PA)', sortOrder: null,
      sortFn: (a: DataItemMixProducto, b: DataItemMixProducto) => a.mixpa - b.mixpa
    },
    {
      title: 'SO HL', sortOrder: null,
      sortFn: (a: DataItemMixProducto, b: DataItemMixProducto) => a.sohl - b.sohl
    },
    {
      title: 'SO HL (PA)', sortOrder: null,
      sortFn: (a: DataItemMixProducto, b: DataItemMixProducto) => a.sohlpa - b.sohlpa
    },
    {
      title: 'VAR % (PA)', sortOrder: null,
      sortFn: (a: DataItemMixProducto, b: DataItemMixProducto) => parseFloat(a.var ?? '0') - parseFloat(b.var ?? '0')
    },
  ];
  trackByTitleMixProducto(index: number, column: ColumnItemMixProducto): string {
    return column.title; // Devuelve una identificación única para la columna
  }

  // Mix Cadena
  listOfColumnMixCadena: ColumnItemMixCadena[] = [
    {
      title: 'Retail', sortOrder: null,
      sortFn: (a: DataItemMixCadena, b: DataItemMixCadena) => a.poc_cadena_backus.localeCompare(b.poc_cadena_backus),
    },
    {
      title: 'Mix %',sortOrder: 'descend',
      sortFn: (a: DataItemMixCadena, b: DataItemMixCadena) => a.mix - b.mix
    },
    {
      title: 'Mix % (PA)', sortOrder: null,
      sortFn: (a: DataItemMixCadena, b: DataItemMixCadena) => a.mixpa - b.mixpa
    },
    {
      title: 'SO HL', sortOrder: null,
      sortFn: (a: DataItemMixCadena, b: DataItemMixCadena) => a.sohl - b.sohl
    },
    {
      title: 'SO HL (PA)', sortOrder: null,
      sortFn: (a: DataItemMixCadena, b: DataItemMixCadena) => a.sohlpa - b.sohlpa
    },
    {
      title: 'VAR % (PA)', sortOrder: null,
      sortFn: (a: DataItemMixCadena, b: DataItemMixCadena) => parseFloat(a.var ?? '0') - parseFloat(b.var ?? '0')
    },
  ];
  trackByTitleMixCadena(index: number, column: ColumnItemMixCadena): string {
    return column.title; // Devuelve una identificación única para la columna
  }

  // Top 10 Var % SOHL
  listOfColumnTop10VarSOHL: ColumnItemTop10VarSOHL[] = [
    {
      title: 'Nombre Tienda', sortOrder: null,
      sortFn: (a: DataItemTop10VarSOHL, b: DataItemTop10VarSOHL) => a.poc_nombre_cadena.localeCompare(b.poc_nombre_cadena),
    },
    {
      title: 'SO HL',sortOrder: null,
      sortFn: (a: DataItemTop10VarSOHL, b: DataItemTop10VarSOHL) => a.sohl - b.sohl
    },
    {
      title: 'SO HL (PA)', sortOrder: null,
      sortFn: (a: DataItemTop10VarSOHL, b: DataItemTop10VarSOHL) => a.sohlpa - b.sohlpa
    },
    {
      title: 'VAR HL (PA)', sortOrder: null,
      sortFn: (a: DataItemTop10VarSOHL, b: DataItemTop10VarSOHL) => a.varhl - b.varhl
    },
    {
      title: 'VAR % (PA)', sortOrder: 'descend',
      sortFn: (a: DataItemTop10VarSOHL, b: DataItemTop10VarSOHL) => parseFloat(a.var ?? '0') - parseFloat(b.var ?? '0')
    },
  ];
  trackByTitleTop10VarSOHL(index: number, column: ColumnItemTop10VarSOHL): string {
    return column.title; // Devuelve una identificación única para la columna
  }

  // Bottom 10 Var% SO HL
  listOfColumnBottom10VarSOHL: ColumnItemBottom10VarSOHL[] = [
    {
      title: 'Nombre Tienda', sortOrder: null,
      sortFn: (a: DataItemBottom10VarSOHL, b: DataItemBottom10VarSOHL) => a.poc_nombre_cadena.localeCompare(b.poc_nombre_cadena),
    },
    {
      title: 'SO HL',sortOrder: null,
      sortFn: (a: DataItemBottom10VarSOHL, b: DataItemBottom10VarSOHL) => a.sohl - b.sohl
    },
    {
      title: 'SO HL (PA)', sortOrder: null,
      sortFn: (a: DataItemBottom10VarSOHL, b: DataItemBottom10VarSOHL) => a.sohlpa - b.sohlpa
    },
    {
      title: 'VAR HL (PA)', sortOrder: null,
      sortFn: (a: DataItemBottom10VarSOHL, b: DataItemBottom10VarSOHL) => a.varhl - b.varhl
    },
    {
      title: 'VAR % (PA)', sortOrder: 'ascend',
      sortFn: (a: DataItemBottom10VarSOHL, b: DataItemBottom10VarSOHL) => parseFloat(a.var ?? '0') - parseFloat(b.var ?? '0')
    },
  ];
  trackByTitleBottom10VarSOHL(index: number, column: ColumnItemBottom10VarSOHL): string {
    return column.title; // Devuelve una identificación única para la columna
  }

  // Performance Top SKU
  listOfColumnPerformanceTopSKU: ColumnItemPerformanceTopSKU[] = [
    {
      title: 'Descripcion Norma', sortOrder: null,
      sortFn: (a: DataItemPerformanceTopSKU, b: DataItemPerformanceTopSKU) => a.sku_descripcion_norma_backus.localeCompare(b.sku_descripcion_norma_backus),
    },
    {
      title: 'SO HL',sortOrder: 'descend',
      sortFn: (a: DataItemPerformanceTopSKU, b: DataItemPerformanceTopSKU) => a.sohl - b.sohl
    },
    {
      title: 'SO HL (PA)', sortOrder: null,
      sortFn: (a: DataItemPerformanceTopSKU, b: DataItemPerformanceTopSKU) => a.sohlpa - b.sohlpa
    },
    {
      title: 'VAR HL (PA)', sortOrder: null,
      sortFn: (a: DataItemPerformanceTopSKU, b: DataItemPerformanceTopSKU) => a.varhl - b.varhl
    },
    {
      title: 'VAR % (PA)', sortOrder: null,
      sortFn: (a: DataItemPerformanceTopSKU, b: DataItemPerformanceTopSKU) => parseFloat(a.var ?? '0') - parseFloat(b.var ?? '0')
    },
  ];
  trackByTitlePerformanceTopSKU(index: number, column: ColumnItemPerformanceTopSKU): string {
    return column.title; // Devuelve una identificación única para la columna
  }

  sortChange(sortOrder: NzTableSortOrder | null, columnTitle: string, titleTable: string): void {
    if (titleTable === 'mix-producto') {
      this.listOfColumnMixProducto.forEach(column => {
        if (column.title !== columnTitle) {
          column.sortOrder = null;
        }
      });
    } else if (titleTable === 'mix-cadena') {
      this.listOfColumnMixCadena.forEach(column => {
        if (column.title !== columnTitle) {
          column.sortOrder = null;
        }
      });
    } else if (titleTable === 'top-10-var-sohl') {
      this.listOfColumnTop10VarSOHL.forEach(column => {
        if (column.title !== columnTitle) {
          column.sortOrder = null;
        }
      });
    } else if (titleTable === 'bottom-10-var-sohl') {
      this.listOfColumnBottom10VarSOHL.forEach(column => {
        if (column.title !== columnTitle) {
          column.sortOrder = null;
        }
      });
    } else {
      this.listOfColumnPerformanceTopSKU.forEach(column => {
        if (column.title !== columnTitle) {
          column.sortOrder = null;
        }
      });
    }
  }

  constructor(
    public ventaService: VentaService,
    public utilService: UtilService,
    private router: Router,
    private message: NzMessageService,
    private cdr: ChangeDetectorRef,
  ) {
  }

  isLoading = true;

  totals: any = {};

  async ngOnInit() {
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

  async ngAfterViewInit() {
    // Cualquier código que dependa de la vista completamente inicializada

    // Realiza las modificaciones en las propiedades
    this.fecha = new Date(); // o cualquier otra modificación que necesites hacer

    // Forzar una nueva detección de cambios
    this.cdr.detectChanges();
  }

  initializeFilterDate(): void {
    // Calcula las fechas de inicio y fin del mes actual
    this.filterEndDate = subDays(this.today, 1);
    this.filterStartDate = startOfMonth(this.filterEndDate);
  }

  redondearSiEsNecesarioParaDosDecimales(numero: any, esPorcentaje: boolean): string {
    if (typeof numero === 'string') {
      numero = numero.replace('%', '');
    }
    numero = parseFloat(numero);
    if (isNaN(numero)) {
      return '0.00';
    }
    if(numero == "Infinity"){
      esPorcentaje = false
      return '0.00%'
    }

    if (esPorcentaje) {
      // Si es un porcentaje, redondeamos a 2 decimal
      return (numero).toFixed(2) + '%';  // Devuelve una cadena con el número redondeado a 1 decimal
    } else {
      // Si no es un porcentaje, redondeamos con 2 decimal
      return (numero).toFixed(2);  // Devuelve una cadena con el número redondeado a 1 decimal
    }
  }

  redondearSiEsNecesario(numero: any, esPorcentaje: boolean): string {
    if (typeof numero === 'string') {
      numero = numero.replace('%', '');
    }
    numero = parseFloat(numero);
    if (isNaN(numero)) {
      return esPorcentaje ? '0.0%': '0.0';
    }
    if(numero == "Infinity"){
      esPorcentaje = false
      return '0.0%'
    }
    if (esPorcentaje) {
      // Si es un porcentaje, redondeamos a 1 decimal
      return (numero).toFixed(1) + '%';  // Devuelve una cadena con el número redondeado a 1 decimal
    } else {
      // Si no es un porcentaje, redondeamos con 1 decimal
      return (numero).toFixed(1);  // Devuelve una cadena con el número redondeado a 1 decimal
    }
  }

  async loadData() {
    const startDate = format(this.filterStartDate, 'yyyy-MM-dd')
    const endDate = format(this.filterEndDate, 'yyyy-MM-dd')

    this.loaderComparativoSellOutGraph = true;
    this.loaderSkuTable = true;
    this.loaderSubcadenaTable = true;
    this.loaderTopBackusTable = true;
    this.loaderBottomBackusTable = true;
    this.loaderTopDescriptionNorTable = true;
    const exportar = false;

    let processSalesData, configurationTableKpiSku, configurationTableRetail, configurationTableTopBackus, configurationTableBottomBackus, configurationTableTopDescriptionNor, configurationResumeAmount, configurationTableMontoSellOut;

    try {
      [
        processSalesData,
        configurationTableKpiSku,
        configurationTableRetail,
        configurationTableTopBackus,
        configurationTableBottomBackus,
        configurationTableTopDescriptionNor,
        configurationResumeAmount,
      ] = await Promise.all([
        this.ventaService.processSalesData(startDate, endDate, this.filterIntervalYear, JSON.stringify(this.listFilterMenu), this.filterSellOutSelection),
        this.ventaService.configurationTableKpiSku(startDate, endDate, this.filterIntervalYear, JSON.stringify(this.listFilterMenu), exportar),
        this.ventaService.configurationTableRetail(startDate, endDate, this.filterIntervalYear, JSON.stringify(this.listFilterMenu)),
        this.ventaService.configurationTableTopBackus(startDate, endDate, this.filterIntervalYear, JSON.stringify(this.listFilterMenu)),
        this.ventaService.configurationTableBottomBackus(startDate, endDate, this.filterIntervalYear, JSON.stringify(this.listFilterMenu)),
        this.ventaService.configurationTableTopDescriptionNor(startDate, endDate, this.filterIntervalYear, JSON.stringify(this.listFilterMenu)),
        this.ventaService.configurationResumeAmount(startDate, endDate, this.filterIntervalYear, JSON.stringify(this.listFilterMenu)),
      ]);
    } catch (error: any) {
      if (error.status == 401) {
        this.message.error(
          'Tu sesion se ha acabado o cerrado, te redirecionaremos al inicio de sesion'
        );
        localStorage.removeItem('token');
        this.loaderComparativoSellOutGraph = false;
        this.loaderSkuTable = false;
        this.loaderSubcadenaTable = false;
        this.loaderTopBackusTable = false;
        this.loaderBottomBackusTable = false;
        this.loaderTopDescriptionNorTable = false;
        this.router.navigate(['/login']);
      } else {
        this.message.error('Error al cargar los datos');
        console.log('Error al cargar los datos:', error);
        this.loaderComparativoSellOutGraph = false;
        this.loaderSkuTable = false;
        this.loaderSubcadenaTable = false;
        this.loaderTopBackusTable = false;
        this.loaderBottomBackusTable = false;
        this.loaderTopDescriptionNorTable = false;
      }
    }

    this.dataVentas = processSalesData; // de lo que falta
    this.dataVentasModal = [...processSalesData];
    // KPIs de Gestión (para la columna Sell Out HL)
    if (this.dataVentas.lenght != 0) {
      if (this.dataVentas[0].hasOwnProperty('mes')) { // para meses
        const meses: { mes: string; total_hl: string }[] = [... this.dataVentas];
        meses.sort((a, b) => { // ordena por fecha
          const dateA = new Date(a.mes).getTime();
          const dateB = new Date(b.mes).getTime();
          return dateA - dateB;
        });
        const sumaTotal = { actual: 0, anterior: 0 };
        const NumerosMes: any = {};
        meses.forEach(element => {
          const numeroMes = parseInt(element.mes.split('-')[1]); // '2022-11-01'
          if (NumerosMes.hasOwnProperty(numeroMes)) {
            sumaTotal['actual'] += parseFloat(element.total_hl);
          } else {
            NumerosMes[numeroMes] = '',
            sumaTotal['anterior'] += parseFloat(element.total_hl);
          }
        })
        this.totalKPIsGestionSohl = sumaTotal.actual;
        // ((daySO.total_hl - dayPA.total_hl) / dayPA.total_hl) * 100
        this.valueKPISGestionCrecimientoHLPA = (sumaTotal.actual / sumaTotal.anterior) - 1;
        this.valueKPISGestionCrecimientoHLPA = this.valueKPISGestionCrecimientoHLPA * 100;
      } else if (this.dataVentas[0].hasOwnProperty('semana')) {
        const semanas: { semana: string; total_hl: string }[] = [... this.dataVentas];
        semanas.sort((a, b) => { // ordena
          const [yearA, weekA] = a.semana.split('-').map(Number);
          const [yearB, weekB] = b.semana.split('-').map(Number);
          if (yearA !== yearB) {
            return yearA - yearB;
          } else {
            return weekA - weekB;
          }
        });
        const numeroMesDelAnio: any = {};
        const sumaTotal = { actual: 0, anterior: 0 };
        semanas.forEach(element => {
          const value = parseInt(element.semana.split('-')[1]); // "2024-18" 18 es el numero de semana del año
          if (numeroMesDelAnio.hasOwnProperty(value)) {
            sumaTotal['actual'] += parseFloat(element.total_hl);
          } else {
            numeroMesDelAnio[value] = '',
            sumaTotal['anterior'] += parseFloat(element.total_hl);
          }
        });
        this.totalKPIsGestionSohl = sumaTotal.actual;
        this.valueKPISGestionCrecimientoHLPA = (sumaTotal.actual / sumaTotal.anterior) - 1;
        this.valueKPISGestionCrecimientoHLPA = this.valueKPISGestionCrecimientoHLPA * 100;
      } else if (this.dataVentas[0].hasOwnProperty('dia')) {
        const dias: { dia: string; total_hl: string }[] = [... this.dataVentas];
        dias.sort((a, b) => { // ordena
          const dateA = new Date(a.dia).getTime();
          const dateB = new Date(b.dia).getTime();
          return dateA - dateB;
        });
        const mesesConDias: any = {};
        const sumaTotal = { actual: 0, anterior: 0 };
        dias.forEach(element => {
          const value = element.dia.split('-');
          const mesDia = value[1]+'-'+value[2];
          if (mesesConDias.hasOwnProperty(mesDia)) {
            sumaTotal['actual'] += parseFloat(element.total_hl);
          } else {
            mesesConDias[mesDia] = '',
            sumaTotal['anterior'] += parseFloat(element.total_hl);
          }
        });
        this.totalKPIsGestionSohl = sumaTotal.actual;
        this.valueKPISGestionCrecimientoHLPA = (sumaTotal.actual / sumaTotal.anterior) - 1;
        this.valueKPISGestionCrecimientoHLPA = this.valueKPISGestionCrecimientoHLPA * 100;
      } else {
        // años
        const anios: { 'año': string; total_hl: string }[] = [... this.dataVentas];
        anios.sort((a, b) => {
          const dateA = new Date(a['año']).getTime();
          const dateB = new Date(b['año']).getTime();
          return dateA - dateB;
        });
        this.totalKPIsGestionSohl = parseFloat(anios[1].total_hl);
        this.valueKPISGestionCrecimientoHLPA = (parseFloat(anios[1].total_hl) / parseFloat(anios[0].total_hl)) - 1;
        this.valueKPISGestionCrecimientoHLPA = this.valueKPISGestionCrecimientoHLPA * 100;
      }
    }
    ///

    // Lógica para llenado de la tabla Mix Producto
    this.dataSkuTable = [...configurationTableKpiSku];
    this.dataSkuTable.forEach((element: any) => {
      element.sohl = element.sohl / 1000;
      element.sohlpa = element.sohlpa / 1000;
    });
    //Lógica para el total de tabla mix Producto
    if (this.dataSkuTable.length > 0) {
      let totalMix = 0;
      let totalMixPa = 0;
      this.dataSkuTable.forEach((element: any) => {
        totalMix += element.mix ? parseFloat(element.mix) : 0;
        totalMixPa += element.mixpa ? parseFloat(element.mixpa) : 0;
      });
      this.dataSkuTable.forEach((element: any) => {
        element.mix = (element.mix ? parseFloat(element.mix) : 0) / totalMix * 100;
        if (totalMixPa !== 0) { // Aseguramos que no dividimos por cero
          element.mixpa = (element.mixpa ? parseFloat(element.mixpa) : 0) / totalMixPa * 100;
        }
        this.totalSkuTable['sohl'] += element.sohl ? parseFloat(element.sohl) : 0;
        this.totalSkuTable['sohlpa'] += element.sohlpa ? parseFloat(element.sohlpa) : 0;
      });
      this.totalSkuTable['var'] = ((this.totalSkuTable['sohl'] / this.totalSkuTable['sohlpa']) - 1) * 100;
      // Sumamos los valores finales de mix y mixpa de todos los elementos en dataSkuTable
      this.totalSkuTable['mix'] = 0;
      this.totalSkuTable['mixpa'] = 0;
      this.dataSkuTable.forEach((element: any) => {
        this.totalSkuTable['mix'] += element.mix;
        this.totalSkuTable['mixpa'] += element.mixpa;
      });
    }
    // Lógica para llenado de la tabla Mix Cadena
    this.dataCadenaTable = configurationTableRetail;
    this.dataCadenaTable.forEach((element: any) => {
      element.sohl = element.sohl / 1000;
      element.sohlpa = element.sohlpa / 1000;
    }); //Lógica para el total de tabla mix Cadena
    if (this.dataCadenaTable.length > 0) {
      let totalMix = 0;
      let totalMixPa = 0;
      this.dataCadenaTable.forEach((element: any) => {
        totalMix += element.mix ? parseFloat(element.mix) : 0;
        totalMixPa += element.mixpa ? parseFloat(element.mixpa) : 0;
      });
      this.dataCadenaTable.forEach((element: any) => {
        element.mix = (element.mix ? parseFloat(element.mix) : 0) / totalMix * 100;
        if (totalMixPa !== 0) { // Aseguramos que no dividimos por cero
          element.mixpa = (element.mixpa ? parseFloat(element.mixpa) : 0) / totalMixPa * 100;
        }
        this.totalCadenaTable['sohl'] += element.sohl ? parseFloat(element.sohl) : 0;
        this.totalCadenaTable['sohlpa'] += element.sohlpa ? parseFloat(element.sohlpa) : 0;
      });
      this.totalCadenaTable['var'] = ((this.totalCadenaTable['sohl'] / this.totalCadenaTable['sohlpa']) - 1) * 100;
      // Sumamos los valores finales de mix y mixpa de todos los elementos en dataCadenaTable
      this.totalCadenaTable['mix'] = 0;
      this.totalCadenaTable['mixpa'] = 0;
      this.dataCadenaTable.forEach((element: any) => {
        this.totalCadenaTable['mix'] += element.mix;
        this.totalCadenaTable['mixpa'] += element.mixpa;
      });
    }

    // Lógica para llenado de la tabla Top Backus
    this.dataTopBackusTable = configurationTableTopBackus;
    this.dataTopBackusTable.forEach((element: any) => {
      element.sohl = parseFloat(element.sohl);
      element.sohlpa = parseFloat(element.sohlpa);
      element['varhl'] = element.sohl - element.sohlpa;
      element['var'] = element.sohlpa == 0 ? 0 : ((element.sohl / element.sohlpa) - 1) * 100;
    });
    //Lógica para el total de tabla Top 10 Var % SoHL
    if (this.dataTopBackusTable.length > 0) {
      this.dataTopBackusTable.forEach((element: any) => {
        this.totalTopBackusTable['sohl'] += element.sohl ? parseFloat(element.sohl) : 0;
        this.totalTopBackusTable['sohlpa'] += element.sohlpa ? parseFloat(element.sohlpa) : 0;
      });
      this.totalTopBackusTable['varhl'] = (this.totalTopBackusTable['sohl'] - this.totalTopBackusTable['sohlpa']);
      this.totalTopBackusTable['var'] = this.totalTopBackusTable['sohlpa'] == 0 ? 0 : (this.totalTopBackusTable['varhl'] / this.totalTopBackusTable['sohlpa']) * 100;
    }

    // Lógica para llenado de la tabla Bottom Backus (Bottom 10 Var% SO HL)
    this.dataBottomBackusTable = configurationTableBottomBackus;
    this.dataBottomBackusTable.forEach((element: any) => {
      element.sohl = parseFloat(element.sohl);
      element.sohlpa = parseFloat(element.sohlpa);
      element['varhl'] = element.sohl - element.sohlpa;
      element['var'] = element.sohlpa == 0 ? 0 : ((element.sohl / element.sohlpa) - 1) * 100;
    });
    //Lógica para el total de tabla Bottom Backus
    if (this.dataBottomBackusTable.length > 0) {
      this.dataBottomBackusTable.forEach((element: any) => {
        this.totalBottomBackusTable['sohl'] += element.sohl ? parseFloat(element.sohl) : 0;
        this.totalBottomBackusTable['sohlpa'] += element.sohlpa ? parseFloat(element.sohlpa) : 0;
      });
      this.totalBottomBackusTable['varhl'] = (this.totalBottomBackusTable['sohl'] - this.totalBottomBackusTable['sohlpa']);
      this.totalBottomBackusTable['var'] = this.totalBottomBackusTable['sohlpa'] == 0 ? 0 : (this.totalBottomBackusTable['varhl'] / this.totalBottomBackusTable['sohlpa']) * 100;
    }

    // Lógica para llenado de la tabla Top Description Norma (Performance Top SKU)
    this.dataTopDescriptionNorTable = configurationTableTopDescriptionNor;
    this.dataTopDescriptionNorTable.forEach((element: any) => {
      element.sohl = parseFloat(element.sohl);
      element.sohlpa = parseFloat(element.sohlpa);
      element['varhl'] = element.sohl - element.sohlpa;
      element['var'] = element.sohlpa == 0 ? 0 : ((element.sohl / element.sohlpa) - 1) * 100;
    });
    //Lógica para el total de tabla Top Description Norma
    if (this.dataTopDescriptionNorTable.length > 0) {
      this.dataTopDescriptionNorTable.forEach((element: any) => {
        this.totalTopDescriptionNorTable['sohl'] += element.sohl ? parseFloat(element.sohl) : 0;
        this.totalTopDescriptionNorTable['sohlpa'] += element.sohlpa ? parseFloat(element.sohlpa) : 0;
      });
      this.totalTopDescriptionNorTable['varhl'] = (this.totalTopDescriptionNorTable['sohl'] - this.totalTopDescriptionNorTable['sohlpa']);
      this.totalTopDescriptionNorTable['var'] = this.totalTopDescriptionNorTable['sohlpa'] == 0 ? 0 : (this.totalTopDescriptionNorTable['varhl'] / this.totalTopDescriptionNorTable['sohlpa']) * 100;
    }
    
    // Calcular el total de la tabla de resumen de monto de sell out
    this.dataResumeAmount = configurationResumeAmount[0];
    if (parseFloat(this.dataResumeAmount.totalamount) && parseFloat(this.dataResumeAmount.totalamountpa) > 0) {
      this.dataResumeAmount.var = ((parseFloat(this.dataResumeAmount.totalamount) / parseFloat(this.dataResumeAmount.totalamountpa)) - 1) * 100;
      this.dataResumeAmount.var = this.dataResumeAmount?.var?.toFixed(2);
    }

    // reset laoders
    this.loaderComparativoSellOutGraph = false;
    this.loaderSkuTable = false;
    this.loaderSubcadenaTable = false;
    this.loaderTopBackusTable = false;
    this.loaderBottomBackusTable = false;
    this.loaderTopDescriptionNorTable = false;
    this.loadingDataFilterDate = false;

    this.dataMontoSellOut = configurationTableMontoSellOut;
    
    if (this.filterSellOutSelection === 'año'){ 
      this.configuraGraficoYear(this.dataVentas);
    } else if(this.filterSellOutSelection === 'mes'){
      this.configuraGraficoMonth(this.dataVentas);
    } else if (this.filterSellOutSelection === 'semana') {
      this.configuraGraficoWeek(this.dataVentas);
    } else if (this.filterSellOutSelection === 'dia') {
      this.configuraGraficoDay(this.dataVentas);
    } 

  }

  async loadGrafic(){
    const startDate = format(this.filterStartDate, 'yyyy-MM-dd')
    const endDate = format(this.filterEndDate, 'yyyy-MM-dd')

    this.loaderComparativoSellOutGraph = true;
    let processSalesData;

    try {
      [
        processSalesData
      ] = await Promise.all([
        this.ventaService.processSalesData(startDate, endDate, this.filterIntervalYear, JSON.stringify(this.listFilterMenu), this.filterSellOutSelection),
      ]);
    } catch (error: any) {
      if (error.status == 401) {
        this.message.error(
          'Tu sesion se ha acabado o cerrado, te redirecionaremos al inicio de sesion'
        );
        localStorage.removeItem('token');
        this.loaderComparativoSellOutGraph = false;
        this.router.navigate(['/login']);
      } else {
        this.message.error('Error al cargar los datos');
        console.log('Error al cargar los datos:', error);
        this.loaderComparativoSellOutGraph = false;
      }
    }

    this.dataVentas = processSalesData;
    this.dataVentasModal = [...processSalesData];

    if (this.filterSellOutSelection === 'año'){ 
      this.configuraGraficoYear(this.dataVentas);
    } else if(this.filterSellOutSelection === 'mes'){
      this.configuraGraficoMonth(this.dataVentas);
    } else if (this.filterSellOutSelection === 'semana') {
      this.configuraGraficoWeek(this.dataVentas);
    } else if (this.filterSellOutSelection === 'dia') {
      this.configuraGraficoDay(this.dataVentas);
    } 
  }

  async loadDataMenu() {

    const startDate = format(this.filterStartDate, 'yyyy-MM-dd')
    const endDate = format(this.filterEndDate, 'yyyy-MM-dd')

    let configurationValues,configurationDataNameBackus, configurationDataGerenciaBackus, configurationDataClusterBackus, configurationDataSupervisorBackus,
      configurationDataMarca, configurationDataTipo, configurationDataCapacidadNor, configurationDataCdMas;

    this.loadingDataFilterMenu = true;
    try {
      [
        configurationValues,

      ] = await Promise.all([
        this.ventaService.getConfigValues(),
      ]);
      this.listConfigurationMenu = configurationValues;
    } catch (error) {
      console.error('Error al cargar los datos:', error);
      this.loadingDataFilterMenu = false;
    }
    this.loadingDataFilterMenu = false;
  }

  async configuraGraficoYear(dataVentas: any, elementId: string = 'myChart'): Promise<void> {
    this.disableButtonArrowUp = true;
    this.disableButtonArrowDown = false;
    // Inicializa el gráfico
    this.myChart = echarts.init(document.getElementById(elementId) as HTMLDivElement);
    this.isChartLoaded = true;  // Añade esta línea al final de tu método configuraGrafico para indicar que el gráfico se cargó correctamente
    const anios = dataVentas.map((venta: any) => parseInt(venta.año.split('-')[0])).sort((a:number, b:number) => a - b);
    const total_hl_anio = dataVentas.map((venta: any) => ({anio: parseInt(venta.año.split('-')[0]), total_hl: parseFloat(venta.total_hl)})).sort((a:any, b:any) => a.anio - b.anio);
    const mayorVentaPorAnio = total_hl_anio.reduce((max:any, venta:any) => venta.total_hl > max.total_hl ? venta : max, total_hl_anio[0]);
    const hlPorAnioPA = total_hl_anio.filter((venta:any) => (venta.anio == anios[0])).map((venta:any) => venta.total_hl);
    const hlPorAnioSO = total_hl_anio.filter((venta:any) => (venta.anio == anios[1])).map((venta:any) => venta.total_hl);
    const crecimientoPorAnio = (((hlPorAnioSO - hlPorAnioPA) / hlPorAnioPA) * 100).toFixed(1);
    const option = {
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'cross',
          crossStyle: {
            color: '#999'
          }
        }
      },
      legend: {
        data: ['Sell Out HL (PA)', 'Sell Out HL', 'Crecimiento HL (PA)']
      },
      xAxis: [{
        type: 'category',
        data: [`${anios[0]}          ${anios[1]}`],
        axisPointer: {
          type: 'shadow'
        },
        axisLabel: {
          rotate: 0,
          interval: 0
        }
      }],
      grid: {
        left: '15%',
        right: '15%'
      },
      yAxis: [{
        type: 'value',
        min: 0,
        max: mayorVentaPorAnio?.total_hl,
        interval: mayorVentaPorAnio?.total_hl <= 1500000 ? 200000 : 500000,
        position: 'right',
        axisLabel: {
          formatter: (value: number) => `${this.formatNumberWithK(value)} hl`,
          fontSize: 12
        }
      }, {
        type: 'value',
        min: -100,
        max: 100,
        interval: 25,
        position: 'left',
        axisLabel: {
          formatter: '{value} %',
          fontSize: 12
        },
        splitLine: { show: false }
      }],
      series: [{
        name: 'Sell Out HL (PA)',
        type: 'bar',
        data: [hlPorAnioPA[0], null],
        label: {
          show: true,
          position: 'top',
          align: 'center',
          rotate: 90,
          formatter: (params: { value: number }) => this.formatNumberWithK(params.value)
        },
        tooltip: {
          valueFormatter: (value: number) => this.formatNumberWithK(value)
        },
        grouping: false,
        pointPlacement: 'on',
        pointPadding: 0.05, // Ajusta este valor según sea necesario
        groupPadding: 0 // Ajusta este valor para reducir el espacio entre las barras
      }, {
        name: 'Sell Out HL',
        type: 'bar',
        data: [hlPorAnioSO[0], null],
        label: {
          show: true,
          position: 'top',
          align: 'center',
          rotate: 90,
          formatter: (params: { value: number }) => this.formatNumberWithK(params.value)
        },
        tooltip: {
          valueFormatter: (value: number) => this.formatNumberWithK(value)
        },
        grouping: false,
        pointPlacement: 'on',
        pointPadding: 0.05, // Ajusta este valor según sea necesario
        groupPadding: 0 // Ajusta este valor para reducir el espacio entre las barras
      }, {
        name: 'Crecimiento HL (PA)',
        type: 'line',
        connectNulls: true,
        data: [crecimientoPorAnio],
        label: {
          show: true,
          position: 'top',
          backgroundColor: 'rgba(255, 255, 0, 0.5)',
          formatter: (params: any) => {
            if (params.value !== 0) {
              return `${params.value.split('.').length == 1 ? (params.value+'.0') : params.value}%`;
            }
            return '';
          }
        },
        tooltip: {
          valueFormatter: (value: any) => {
            if (value !== 0) {
              return `${value.split('.').length == 1 ? (value+'.0') : value}%`
            }
            return '';
          }
        }
      }]
    };

    // Configura las opciones del gráfico
    this.myChart.setOption(option);
    this.loaderComparativoSellOutGraph = false;
  }

  async configuraGraficoMonth(dataVentas: any, elementId: string = 'myChart'): Promise<void> {
    this.disableButtonArrowUp = false;
    this.disableButtonArrowDown = false;
    // Inicializa el gráfico
    this.myChart = echarts.init(document.getElementById(elementId) as HTMLDivElement);
    this.isChartLoaded = true;  // Añade esta línea al final de tu método configuraGrafico para indicar que el gráfico se cargó correctamente
    const anios = [...new Set(dataVentas.map((venta: any) => parseInt(venta.mes.split('-')[0])).sort((a:number, b:number) => a - b))];
    const daysData = dataVentas.map((venta: any) => ({anio: parseInt(venta.mes.split('-')[0]), month: parseInt(venta.mes.split('-')[1]), fecha: venta.mes, day:parseInt(venta.mes.split('-')[2]), total_hl: parseFloat(venta.total_hl) }));
    const daysDataSorted = daysData.sort((a:any, b:any) => {
      if (a.anio !== b.anio) {
        return a.anio - b.anio;
      } else if (a.month !== b.month) {
        return a.month - b.month;
      } else {
        return a.day - b.day;
      }
    });
    let seen = new Set();
    const dateMonth = daysDataSorted.map((venta:any) => ({
      numberMonth: venta.month, month: this.getMonthName(venta.month - 1), day: venta.day, year: venta.anio
    })).filter((venta:any) => {
      const key = `${venta.numberMonth}-${venta.day}`;
      if (seen.has(key)) {
        return false;
      }
      seen.add(key);
      return true;
    });
    const monthPA = daysDataSorted.filter((week: any) => week.anio == anios[0]);
    const monthSO = daysDataSorted.filter((week: any) => week.anio == anios[1]);
    const mayorVentaPorAnio = daysDataSorted.reduce((max:any, venta:any) => venta.total_hl > max.total_hl ? venta : max, daysDataSorted[0]);
    let crecimientoPorMonth: any[] = [];
    monthPA.forEach((dayPA: any) => {
      const daySO = monthSO.find((day:any) => day.month === dayPA.month);
      if (daySO) {
        const crecimiento = ((daySO.total_hl - dayPA.total_hl) / dayPA.total_hl) * 100;
        crecimientoPorMonth.push(crecimiento.toFixed(1));
      }else{
        crecimientoPorMonth.push(0);
      }
    });

    // Configura las opciones del gráfico
    const option = {
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'cross',
          crossStyle: {
            color: '#999'
          }
        }
      },

      legend: {
        data: ['Sell Out HL (PA)', 'Sell Out HL', 'Crecimiento HL (PA)']
      },
      xAxis: [
        {
          type: 'category',
          data: dateMonth.map((venta:any) => `${venta.month}`),
          axisPointer: {
            type: 'shadow'
          },
          axisLabel: {
            rotate: 45,  // Ajusta la rotación de las etiquetas a 45 grados
            interval: 0  // Muestra todas las etiquetas
          }
        }
      ],
      grid: {
        left: '15%',// Aumenta el espacio reservado para las etiquetas del eje Y
        right: '15%' // Aumenta el espacio reservado para las etiquetas del eje Y
      },
      yAxis: [
        {
          type: 'value',
          min: 0,
          max: mayorVentaPorAnio?.total_hl,
          interval: mayorVentaPorAnio?.total_hl <= 150000 ? 50000 : 200000,
          position: 'right',  // Coloca este eje y en el lado derecho
          axisLabel: {
            formatter: (value: number) => {
              const roundedValue = Math.round(value / 1000);
              // Usa el método formatearNumeroConComas para formatear el número con comas en cada millar
              const valueWithCommas = this.utilService.formatearNumeroConComas(roundedValue);
              // return `${valueWithCommas} hl`;
              return `${valueWithCommas}K hl`;  // Añade 'K hl' al final
            },
            fontSize: 12
          }
        },

        {
          type: 'value',
          min: -100,
          max: 100,
          interval: 25,
          position: 'left',  // Coloca este eje y en el lado izquierdo
          axisLabel: {
            formatter: '{value} %',
            fontSize: 12
          },
          splitLine: { show: false }  // Oculta las líneas de división
        }
      ],
      series: [
        {
          name: 'Sell Out HL (PA)',
          type: 'bar',
          data: monthPA.map((venta: any) => venta.total_hl),
          label: {
            show: true,
            position: 'top',
            align: 'center',
            rotate: 90,
            formatter: (params: { value: number }) => {
              return this.utilService.formatearNumeroConComas(Math.round(params.value / 1000)) + 'K';
              // return this.utilService.formatearNumeroConComas(params.value.toFixed(2));
            }
          },
          tooltip: {
            valueFormatter: (value: number) => {
              return this.utilService.formatearNumeroConComas(Math.round(value / 1000)) + 'K';
              // return this.utilService.formatearNumeroConComas(value.toFixed(2));
            }
          }
        },
        {
          name: 'Sell Out HL',
          type: 'bar',
          data: monthSO.map((venta: any) => venta.total_hl),
          label: {
            show: true,
            position: 'top',
            align: 'center',
            rotate: 90,
            formatter: (params: { value: number }) => {
              return this.utilService.formatearNumeroConComas(Math.round(params.value / 1000)) + 'K';
              // return this.utilService.formatearNumeroConComas(params.value.toFixed(2));
            }
          },
          tooltip: {
            valueFormatter: (value: number) => {
              return this.utilService.formatearNumeroConComas(Math.round(value / 1000)) + 'K';
              // return this.utilService.formatearNumeroConComas(value.toFixed(2));
            }
          },
        },
        {
          name: 'Crecimiento HL (PA)',
          type: 'line',
          yAxisIndex: 1,
          connectNulls: true, // Conecta valores nulos con línea
          data: crecimientoPorMonth,
          label: {
              show: true,
              position: 'top',
              backgroundColor: 'rgba(255, 255, 0, 0.5)',
              formatter: (params: any) => {
                if (params.value !== 0) {
                  return `${params.value.split('.').length == 1 ? (params.value+'.0') : params.value}%`;
                }
                return ''; // Si es null, no muestra nada
              }
          },
          tooltip: {
            valueFormatter: (value: any) => {
              if (value !== 0) {
                return `${value.split('.').length == 1 ? (value+'.0') : value}%`
              }
              return '';
            }
          }
        }
      ]
    };
    // Configura las opciones del gráfico
    this.myChart.setOption(option);
    this.loaderComparativoSellOutGraph = false;
  }

  async configuraGraficoWeek(dataVentas: any, elementId: string = 'myChart'): Promise<void> {
    this.disableButtonArrowUp = false;
    this.disableButtonArrowDown = false;
    // Inicializa el gráfico
    this.myChart = echarts.init(document.getElementById(elementId) as HTMLDivElement);
    this.isChartLoaded = true;  // Añade esta línea al final de tu método configuraGrafico para indicar que el gráfico se cargó correctamente
    const anios = [...new Set(dataVentas.map((venta: any) => parseInt(venta.semana.split('-')[0])).sort((a:number, b:number) => a - b))];
    const weeksData = dataVentas.map((venta: any) => ({anio: parseInt(venta.semana.split('-')[0]), week: parseInt(venta.semana.split('-')[1]), yearWeek: venta.semana, total_hl: parseFloat(venta.total_hl) }));
    const weeksNumber = [...new Set(weeksData.map((week: any) => week.week).sort((a:number, b:number) => a - b).map((week: number) => `Semana ${week}`))];
    const weeksPA = weeksData.filter((week: any) => week.anio == anios[0]);
    const weeksSO = weeksData.filter((week: any) => week.anio == anios[1]);
    const total_hl_semana = dataVentas.map((venta: any) => ({anio: parseInt(venta.semana.split('-')[0]), total_hl: parseFloat(venta.total_hl)})).sort((a:any, b:any) => a.semana - b.semana);
    const mayorVentaPorAnio = total_hl_semana.reduce((max:any, venta:any) => venta.total_hl > max.total_hl ? venta : max, total_hl_semana[0]);
    const hlPorAnioPA = total_hl_semana.filter((venta:any) => (venta.anio == anios[0])).map((venta:any) => venta.total_hl);
    const hlPorAnioSO = total_hl_semana.filter((venta:any) => (venta.anio == anios[1])).map((venta:any) => venta.total_hl);
    let crecimientoPorSemana: any[] = [];

    weeksPA.forEach((weekPA: any) => {
      const weekSO = weeksSO.find((week:any) => week.week === weekPA.week);
      if (weekSO) {
        const crecimiento = ((weekSO.total_hl - weekPA.total_hl) / weekPA.total_hl) * 100;
        crecimientoPorSemana.push(crecimiento.toFixed(1));
      }else{
        crecimientoPorSemana.push(0);
      }
    });
   
    // Configura las opciones del gráfico
    const option = {
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'cross',
          crossStyle: {
            color: '#999'
          }
        }
      },

      legend: {
        data: ['Sell Out HL (PA)', 'Sell Out HL', 'Crecimiento HL (PA)']
      },
      xAxis: [
        {
          type: 'category',
          data: weeksNumber,
          axisPointer: {
            type: 'shadow'
          },
          axisLabel: {
            rotate: 45,  // Ajusta la rotación de las etiquetas a 45 grados
            interval: 0  // Muestra todas las etiquetas
          },
          position: 'bottom'  // Asegura que este eje X se ubique en la parte inferior
        }
      ],
      grid: {
        left: '15%',// Aumenta el espacio reservado para las etiquetas del eje Y
        right: '15%' // Aumenta el espacio reservado para las etiquetas del eje Y
      },
      yAxis: [
        {
          type: 'value',
          min: 0,
          max: mayorVentaPorAnio?.total_hl,
          interval: mayorVentaPorAnio?.total_hl <= 15000 ? 2000 : 10000,
          position: 'right',  // Coloca este eje y en el lado derecho
          axisLabel: {
            formatter: (value: number) => {
              const roundedValue = Math.round(value / 1000);
              // Usa el método formatearNumeroConComas para formatear el número con comas en cada millar
              const valueWithCommas = this.utilService.formatearNumeroConComas(roundedValue);
              // return `${valueWithCommas} hl`;
              return `${valueWithCommas}K hl`;  // Añade 'K hl' al final
            },
            fontSize: 12
          }
        },

        {
          type: 'value',
          min: -100,
          max: 100,
          interval: 25,
          position: 'left',  // Coloca este eje y en el lado izquierdo
          axisLabel: {
            formatter: '{value} %',
            fontSize: 12
          },
          splitLine: { show: false }  // Oculta las líneas de división
        }
      ],
      series: [
        {
          name: 'Sell Out HL (PA)',
          type: 'bar',
          data: hlPorAnioPA,
          // xAxisIndex: 0,
          label: {
            show: true,
            position: 'top',
            align: 'center',
            rotate: 90,
            formatter: (params: { value: number }) => {
              return this.utilService.formatearNumeroConComas(Math.round(params.value / 1000)) + 'K';
              // return this.utilService.formatearNumeroConComas(params.value.toFixed(2));
            }
          },
          tooltip: {
            valueFormatter: (value: number) => {
              return this.utilService.formatearNumeroConComas(Math.round(value / 1000)) + 'K';
              // return this.utilService.formatearNumeroConComas(value.toFixed(2));
            }
          },
          // barGap: '50%', // Ajusta el espacio entre las barras dentro del mismo grupo
          // barCategoryGap: '45%', // Ajusta el espacio entre los diferentes grupos de barras
        },
        {
          name: 'Sell Out HL',
          type: 'bar',
          data: hlPorAnioSO,
          // xAxisIndex: 1,
          label: {
            show: true,
            position: 'top',
            align: 'center',
            rotate: 90,
            formatter: (params: { value: number }) => {
              return this.utilService.formatearNumeroConComas(Math.round(params.value / 1000)) + 'K';
              // return this.utilService.formatearNumeroConComas(params.value.toFixed(2));
            }
          },
          tooltip: {
            valueFormatter: (value: number) => {
              return this.utilService.formatearNumeroConComas(Math.round(value / 1000)) + 'K';
              // return this.utilService.formatearNumeroConComas(value.toFixed(2));
            }
          },
        },
        {
          name: 'Crecimiento HL (PA)',
          type: 'line',
          yAxisIndex: 1,
          connectNulls: true, // Conecta valores nulos con línea
          data: crecimientoPorSemana,
          label: {
              show: true,
              position: 'top',
              backgroundColor: 'rgba(255, 255, 0, 0.5)',
              formatter: (params: any) => {
                  if (params.value !== 0) {
                    return `${params.value.split('.').length == 1 ? (params.value+'.0') : params.value}%`;
                  }
                  return ''; // Si es null, no muestra nada
              }
          },
          tooltip: {
            valueFormatter: (value: any) => {
              if (value !== 0) {
                return `${value.split('.').length == 1 ? (value+'.0') : value}%`
              }
              return '';
            }
          }
        }
      ]
    };
    // Configura las opciones del gráfico
    this.myChart.setOption(option);
    this.loaderComparativoSellOutGraph = false;
  }
  
  async configuraGraficoDay(dataVentas: any, elementId: string = 'myChart'): Promise<void> {
    this.disableButtonArrowUp = false;
    this.disableButtonArrowDown = true;
    // Inicializa el gráfico
    this.myChart = echarts.init(document.getElementById(elementId) as HTMLDivElement);
    this.isChartLoaded = true;  // Añade esta línea al final de tu método configuraGrafico para indicar que el gráfico se cargó correctamente
    const anios = [...new Set(dataVentas.map((venta: any) => parseInt(venta.dia.split('-')[0])).sort((a:number, b:number) => a - b))];
    const daysData = dataVentas.map((venta: any) => ({anio: parseInt(venta.dia.split('-')[0]), month: parseInt(venta.dia.split('-')[1]), day:parseInt(venta.dia.split('-')[2]), dayString:venta.dia.split('-')[2], fecha: venta.dia, total_hl: parseFloat(venta.total_hl) }));
    const daysDataSorted = daysData.sort((a:any, b:any) => {
      if (a.anio !== b.anio) {
        return a.anio - b.anio;
      } else if (a.month !== b.month) {
        return a.month - b.month;
      } else {
        return a.day - b.day;
      }
    });
    let seen = new Set();
    let dateDays = daysDataSorted.map((venta:any) => ({
      numberMonth: venta.month, month: this.getMonthName(venta.month - 1), day: venta.day, dayString:venta.dayString, year: venta.anio
    })).filter((venta:any) => {
      const key = `${venta.numberMonth}-${venta.day}`;
      if (seen.has(key)) {
        return false;
      }
      seen.add(key);
      return true;
    });
    const daysPA = daysDataSorted.filter((week: any) => week.anio == anios[0]);
    const daysSO = daysDataSorted.filter((week: any) => week.anio == anios[1]);
    const mayorVentaPorAnio = daysDataSorted.reduce((max:any, venta:any) => venta.total_hl > max.total_hl ? venta : max, daysDataSorted[0]);
    //calculo de crecimiento por dia
    let crecimientoPorDay: any[] = [];
    daysPA.forEach((dayPA: any) => {
      const daySO = daysSO.find((day:any) => day.month === dayPA.month && day.day === dayPA.day);
      if (daySO) {
        const crecimiento = ((daySO.total_hl - dayPA.total_hl) / dayPA.total_hl) * 100;
        crecimientoPorDay.push(crecimiento.toFixed(1));
      }else{
        crecimientoPorDay.push(0);
      }
    });

    // Configura las opciones del gráfico
    const option = {
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'cross',
          crossStyle: {
            color: '#999'
          }
        }
      },

      legend: {
        data: ['Sell Out HL (PA)', 'Sell Out HL', 'Crecimiento HL (PA)']
      },
      xAxis: [
        {
          type: 'category',
          data: dateDays.map((day:any) => `${day.dayString}-${day.month}`),
          axisPointer: {
            type: 'shadow'
          },
          axisLabel: {
            rotate: 45,  // Ajusta la rotación de las etiquetas a 45 grados
            interval: 0  // Muestra todas las etiquetas
          }
        }
      ],
      grid: {
        left: '15%',// Aumenta el espacio reservado para las etiquetas del eje Y
        right: '15%' // Aumenta el espacio reservado para las etiquetas del eje Y
      },
      yAxis: [
        {
          type: 'value',
          min: 0,
          max: mayorVentaPorAnio?.total_hl,
          interval: mayorVentaPorAnio?.total_hl <= 1500 ? 500 : 1000,
          position: 'right',  // Coloca este eje y en el lado derecho
          axisLabel: {
            formatter: (value: number) => {
              // Usa el método formatearNumeroConComas para formatear el número con comas en cada millar
              const valueWithCommas = this.utilService.formatearNumeroConComas(parseFloat(value.toFixed(1)));
              return `${valueWithCommas} hl`;  // Añade 'K hl' al final
            },
            fontSize: 12
          }
        },

        {
          type: 'value',
          min: -100,
          max: 100,
          interval: 25,
          position: 'left',  // Coloca este eje y en el lado izquierdo
          axisLabel: {
            formatter: '{value} %',
            fontSize: 12
          },
          splitLine: { show: false }  // Oculta las líneas de división
        }
      ],
      series: [
        {
          name: 'Sell Out HL (PA)',
          type: 'bar',
          data: daysPA.map((day:any) => day.total_hl),
          label: {
            show: true,
            position: 'top',
            align: 'center',
            rotate: 90,
            formatter: (params: { value: number }) => {
              return this.utilService.formatearNumeroConComas(parseFloat(params.value.toFixed(1)));
            }
          },
          tooltip: {
            valueFormatter: (value: number) => {
              return this.utilService.formatearNumeroConComas(parseFloat(value.toFixed(1)));
            }
          }
        },
        {
          name: 'Sell Out HL',
          type: 'bar',
          data: daysSO.map((day:any) => day.total_hl),
          label: {
            show: true,
            position: 'top',
            align: 'center',
            rotate: 90,
            formatter: (params: { value: number }) => {
              return this.utilService.formatearNumeroConComas(parseFloat(params.value.toFixed(1)));
            }
          },
          tooltip: {
            valueFormatter: (value: number) => {
              return this.utilService.formatearNumeroConComas(parseFloat(value.toFixed(1)));
            }
          },
        },
        {
          name: 'Crecimiento HL (PA)',
          type: 'line',
          yAxisIndex: 1,
          connectNulls: true, // Conecta valores nulos con línea
          data: crecimientoPorDay,
          label: {
              show: true,
              position: 'top',
              backgroundColor: 'rgba(255, 255, 0, 0.5)',
              formatter: (params: any) => {
                  if (params.value !== 0) {
                      return `${params.value.split('.').length == 1 ? (params.value+'.0') : params.value}%`;
                  }
                  return ''; // Si es null, no muestra nada
              }
          },
          tooltip: {
            valueFormatter: (value: any) => {
              if (value !== 0) {
                return `${value.split('.').length == 1 ? (value+'.0') : value}%`
              }
              return '';
            }
          }
        }
      ]
    };
    // Configura las opciones del gráfico
    this.myChart.setOption(option);
    this.loaderComparativoSellOutGraph = false;
  }

  onFilterIntervalYearChange(result: string): void {
    this.filterIntervalYear = result;
  }

  disabledFilterStartDate = (startValue: Date): boolean => {
    if (!startValue || !this.filterEndDate) {
      return false;
    }
    // return startValue.getTime() > this.filterEndDate.getTime() || differenceInCalendarDays(startValue, this.today) > 0;
    const oneYearBeforeEndDate = new Date(this.filterEndDate);
    oneYearBeforeEndDate.setFullYear(oneYearBeforeEndDate.getFullYear() - 1);
    return startValue.getTime() > this.filterEndDate.getTime() || startValue.getTime() < oneYearBeforeEndDate.getTime() || differenceInCalendarDays(startValue, this.today) > 0;
  };

  disabledFilterEndDate = (endValue: Date): boolean => {
    // const yesterday = new Date();
    // yesterday.setDate(yesterday.getDate() - 1);
    // return endValue.getTime() < this.filterStartDate.getTime() || endValue.getTime() > yesterday.getTime();
    if (!endValue || !this.filterStartDate) {
      return false;
    }
    const oneYearAfterStartDate = new Date(this.filterStartDate);
    oneYearAfterStartDate.setFullYear(oneYearAfterStartDate.getFullYear() + 1);
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    return endValue.getTime() < this.filterStartDate.getTime() || endValue.getTime() > oneYearAfterStartDate.getTime() || endValue.getTime() > yesterday.getTime();  
  };

  handleFilterStartDateOpenChange(open: boolean): void {
    if (!open) {
      this.filterEndDatePicker.open();
    }
  }

  applyFilters() {
    this.clearSumTotals();
    this.loadingDataFilterDate = true;
    if (this.filterStartDate && this.filterEndDate) {
      this.loadData();
      this.loadDataMenu();
    }
  }

  async downloadExcel(type: string) {
    const startDate = format(this.filterStartDate, 'yyyy-MM-dd')
    const endDate = format(this.filterEndDate, 'yyyy-MM-dd')

    let dataBlob;
    const dowloadFile = true;
    const user = JSON.parse(localStorage.getItem('user'))
    const uuid = uuidv4()
    const switchDownload: any = {
      'configurationTableKpiSku': async () => {
        return await this.ventaService.configurationTableKpiSku(startDate, endDate, this.filterIntervalYear, JSON.stringify(this.listFilterMenu), dowloadFile, user.role, user.usuario_id,uuid);
      },
      'configurationTableRetail': async () => {
        return await this.ventaService.configurationTableRetail(startDate, endDate, this.filterIntervalYear, JSON.stringify(this.listFilterMenu), dowloadFile, user.role, user.usuario_id,uuid);
      },
      'configurationTableTopBackus': async () => {
        return await this.ventaService.configurationTableTopBackus(startDate, endDate, this.filterIntervalYear, JSON.stringify(this.listFilterMenu), dowloadFile, user.role, user.usuario_id,uuid);
      },
      'configurationTableBottomBackus': async () => {
        return await this.ventaService.configurationTableBottomBackus(startDate, endDate, this.filterIntervalYear, JSON.stringify(this.listFilterMenu), dowloadFile, user.role, user.usuario_id,uuid);
      },
      'configurationTableTopDescriptionNor': async () => {
        return await this.ventaService.configurationTableTopDescriptionNor(startDate, endDate, this.filterIntervalYear, JSON.stringify(this.listFilterMenu), dowloadFile,user.role, user.usuario_id,uuid);
      },
    };
    try {
      this.message.success('Su archivo se esta descargando, podra ver su avance en el modulo de descargables.');
      const response: any = await switchDownload[type]();
    } catch (error: any) {
      if (error.status == 401) {
        this.message.error(
          'Tu sesion se ha acabado o cerrado, te redirecionaremos al inicio de sesion'
        );
        localStorage.removeItem('token');
        this.router.navigate(['/login']);
      } else {
        this.message.error('Error al cargar los datos');
        console.log('Error al cargar los datos:', error);
      }
    }
  }

  async handleFilterMenu({ filterMenu }: any) {
    this.clearSumTotals();
    this.listFilterMenu = filterMenu;
    this.loadData();
  }
  //Metodo para accionar el Modal
  openModal(): void {
    this.isOpenModal = true;
  }

  sellOutFilterDateDown(): void {
    const index = this.filterSellOutOptions.indexOf(this.filterSellOutSelection);
    if (index < this.filterSellOutOptions.length - 1) {
      this.filterSellOutSelection = this.filterSellOutOptions[index + 1];
    }
    this.loadGrafic();
  }

  sellOutFilterDateUp(): void {
    const index = this.filterSellOutOptions.indexOf(this.filterSellOutSelection);
    if (index > 0) {
      this.filterSellOutSelection = this.filterSellOutOptions[index - 1];
    }
    this.loadGrafic();
  }

  getMonthName(month: number): string {
    let monthString = format(setMonth(new Date(), month), 'MMMM', { locale: es });
    monthString = monthString.charAt(0).toUpperCase() + monthString.slice(1);  // Convierte la primera letra a mayúscula
    return monthString;
  }

  formatNumberWithK = (value: number) => {
    const roundedValue = (value / 1000).toFixed(1);
    return value == undefined ? 0 : `${this.utilService.formatearNumeroConComas(roundedValue)}K`;
  };

  clearSumTotals() {
    this.totalKPIsGestionSohl = 0;
    this.totalSkuTable = { mix: 0, mixpa: 0, var: 0, sohl: 0, sohlpa: 0 };
    this.totalCadenaTable= { mix: 0, mixpa: 0, sohl: 0, sohlpa: 0, var: 0 };
    this.totalTopBackusTable = { sohl: 0, sohlpa: 0, var: 0 };
    this.totalBottomBackusTable = { sohl: 0, sohlpa: 0, varhl: 0, var: 0 };
    this.totalTopDescriptionNorTable = { sohl: 0, sohlpa: 0, var: 0 };
  }

}
