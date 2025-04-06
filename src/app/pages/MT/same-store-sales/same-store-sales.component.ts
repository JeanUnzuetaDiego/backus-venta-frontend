import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
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
import { NzNotificationModule, NzNotificationService } from 'ng-zorro-antd/notification';
import { NzSwitchModule } from 'ng-zorro-antd/switch';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { FormsModule } from '@angular/forms';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { NzDrawerModule } from 'ng-zorro-antd/drawer';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzDatePickerComponent, NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzTableComponent, NzTableModule } from 'ng-zorro-antd/table';
import { NzSliderModule } from 'ng-zorro-antd/slider';
import { DeviceDetectorService } from '../../../services/device-detector.service';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { format, startOfMonth, endOfMonth, setMonth, differenceInCalendarDays, parse, subDays } from 'date-fns';
import { UtilService } from '../../../util.service'
import * as echarts from 'echarts';
import { SameStoreSalesService } from './same-store.sales.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { ISameStoreSales } from '../../dto/SameStoreSales.dto';
import Constantes from '../../../util/constants/constantes';
import { DrawerWrapperComponent } from '../../../components/shared/drawer-wrapper/drawer-wrapper.component';
import { es } from 'date-fns/locale';

@Component({
  selector: 'app-same-store-sales',
  standalone: true,
  imports: [CommonModule, FormsModule, NzNotificationModule, NzSwitchModule, NzDrawerModule, NzAvatarModule, NzToolTipModule, NzPopoverModule, NzButtonModule, NzSliderModule, NzSpinModule, NzIconModule, NzDatePickerModule, NzTableModule, NzInputModule, NzGridModule, NzSelectModule, NzLayoutModule, NzListModule, NzMenuModule, NzTabsModule, RouterModule, NzModalModule, DrawerWrapperComponent],
  templateUrl: './same-store-sales.component.html',
  styleUrl: './same-store-sales.component.scss'
})
export class SameStoreSalesComponent implements OnInit, AfterViewInit {
  @ViewChild('filterEndDatePicker') filterEndDatePicker!: NzDatePickerComponent;
  @ViewChild('chartVarTotal') chartVarTotal: ElementRef;
  @ViewChild('chartComparativo1') chartComparativo1: ElementRef;
  @ViewChild('chartComparativo2') chartComparativo2: ElementRef;
  //Graficos
  elementchartVarTotal: any;
  optionChartVarTotal: any;
  optionChartComparativo1: any;
  optionChartComparativo2: any;

  //arrays para llenar los chekboxes
  dataCadena: any = [];
  dataMes: any = [];
  dataTableRetails: any = [];
  dataTableFormatos: any = [];
  dataTableTiendas: any = [];
  dataTableVar: ISameStoreSales[] = [];
  dataGraficChart: any = [];
  dataGraphics: any = [];
  dataNewGraphics: any = [];
  anios: any = [];
  datosAnioReciente: any = [];
  datosAnioAnterior: any = [];
  mapOfExpandedDataSome: { [key: string]: ISameStoreSales[] } = {};
  uniqueMonths = new Set();
  uniqueYears = new Set();
  showTableFooter: boolean = false;
  listTotalfooter: any = [];
  sumaTotal:any = 0;

  allCheckedVariable: boolean = false;
  indeterminateVariable = false;

  isDesktop: boolean = false;
  isMobile: boolean = false;
  isTablet: boolean = false;

  isTableVarApertura: boolean = true;
  isTableVarSSS: boolean = true;

  isCollapsed: boolean = false;
  fitlerDate: Date[] = [];
  filterStartDate: Date | null = null;
  filterEndDate: Date | null = null;
  filterIntervalYear: string = '1';
  filterMenu: any = {};
  totalColumnMonths: number = 0;
  totalCrecimientoApertura: number = 0;
  totalCrecimientoSSS: number = 0;

  user: any = {};
  today = new Date();

  listConfigurationMenu: any[] = [];
  listFilterMenu: any[] = [];
  typeOptionMenu: string = 'analisis-precios';

  loaderComparativoSellOutGraph: boolean = false;
  loaderSkuTable: boolean = false;
  loaderSubcadenaTable: boolean = false;
  loaderTopBackusTable: boolean = false;
  loaderBottomBackusTable: boolean = false;
  loaderTopDescriptionNorTable: boolean = false;

  loadingDataFilterMenu: boolean = false;
  loadingDataFilterDate: boolean = false;
  loaderVarTable: boolean = false;
  sssFilter: string = 'filt_all';
  typeDataFilter: string = 'TODO';
  typeFilter: string = '2';
  typeFilterSwith = false;
  myChart: any;
  totalesCadenas: any;

  constructor(
    public deviceDetectorService: DeviceDetectorService,
    public sameStoreSalesService: SameStoreSalesService,
    private message: NzMessageService,
    public utilService: UtilService,
    private router: Router,
    private notification: NzNotificationService
  ) {
    this.isMobile = this.deviceDetectorService.isMobile;
    this.isTablet = this.deviceDetectorService.isTablet;
    this.isDesktop = this.deviceDetectorService.isDesktop;
  }
  async ngOnInit() {
    const userStorage = localStorage.getItem('user');
    this.user = userStorage ? JSON.parse(userStorage) : null;
    if (!this.user) {
      this.message.error('No existe token de sesión, por favor inicie sesión');
      this.router.navigate(['']);
    }
    this.initializeFilterDate();
    this.loadDataMenu();
  }

  async ngAfterViewInit() {
    this.loadData();
    // this.loadGraficos();
  }

  //Metodo para que el Collapse se oculte al inicio
  inicioHidenSideBar(): void {
    this.isCollapsed = !this.isCollapsed;
  }

  initializeFilterDate(): void {
    // Calcula las fechas de inicio y fin del mes actual
    this.filterEndDate = subDays(this.today, 1);
    this.filterStartDate = startOfMonth(this.filterEndDate);
    // this.filterStartDate = parse('2024-01-01', 'yyyy-MM-dd', new Date());
    // this.filterEndDate = parse('2024-03-29', 'yykyy-MM-dd', new Date());
  }

  async loadData() {
    const startDate = format(this.filterStartDate, 'yyyy-MM-dd')
    const endDate = format(this.filterEndDate, 'yyyy-MM-dd')
    this.loaderVarTable = true;
    this.loaderComparativoSellOutGraph = true;

    let configurationVariationByChain: any, processDataSSSGraphicMonth: any;

    try {
      [
        configurationVariationByChain,
        processDataSSSGraphicMonth
      ] = await Promise.all([
        this.sameStoreSalesService.configurationVariationByChain(startDate, endDate, JSON.stringify(this.listFilterMenu), this.typeFilter, this.sssFilter),
        this.sameStoreSalesService.processDataSSSGraphicMonth(startDate, endDate, JSON.stringify(this.listFilterMenu), this.typeFilter, this.sssFilter),
      ]);
      this.loaderVarTable = false;
      this.dataTableRetails = configurationVariationByChain?.retails;
      this.dataTableFormatos = configurationVariationByChain?.formatos;
      this.dataTableTiendas = configurationVariationByChain?.tiendas;
      this.dataGraphics = processDataSSSGraphicMonth;
      let index = 1;
      //Llenado de los retails
      this.dataTableVar = [];
      this.dataNewGraphics = this.dataGraphics.map((item: any) => ({...item, fecha: item.mes, monto:this.typeFilter == '1' ? parseFloat(item.importe) : parseFloat(item.hl), anio: parseInt(item.mes.substring(0, 4)), mes: parseInt(item.mes.substring(4, 6)), mesString: item.mes.substring(4, 6)}));
      // console.log('### this.dataNewGraphics-antes del if', this.dataNewGraphics);
      this.anios = [...new Set(this.dataNewGraphics.map((item: any) => item.anio).sort((a:number, b:number) => a - b))];
      if (this.typeDataFilter != 'TODO') {
        this.dataNewGraphics = this.dataNewGraphics.filter((item: any) => item.tipo == this.typeDataFilter);
      }
      // console.log('### this.dataNewGraphics-despues del if', this.dataNewGraphics);

      // this.dataTableRetails?.forEach((item: any) => {
      //   this.dataTableVar.push({
      //     key: `${index++}`,
      //     description: item.retail,
      //     retail: item.retail,
      //     total_apertura: isNaN(parseFloat(item.total_apertura)) ? 0 : parseFloat(item.total_apertura),
      //     total_apertura_pa: isNaN(parseFloat(item.total_apertura_pa)) ? 0 : parseFloat(item.total_apertura_pa),
      //     total_apertura_var: isNaN(parseFloat(item.total_apertura_var)) ? 0 : parseFloat(item.total_apertura_var),
      //     total_retail_crecimiento: isNaN(parseFloat(item.total_retail_crecimiento)) ? 0 : parseFloat(item.total_retail_crecimiento),
      //     total_sss: isNaN(parseFloat(item.total_sss)) ? 0 : parseFloat(item.total_sss),
      //     total_sss_pa: isNaN(parseFloat(item.total_sss_pa)) ? 0 : parseFloat(item.total_sss_pa),
      //     total_sss_var: isNaN(parseFloat(item.total_sss_var)) ? 0 : parseFloat(item.total_sss_var),
      //     total_sss_crecimiento: isNaN(parseFloat(item.total_sss_crecimiento)) ? 0 : parseFloat(item.total_sss_crecimiento),
      //     total_sum_so: isNaN(parseFloat(item.total_sum_so)) ? 0 : parseFloat(item.total_sum_so),
      //     total_sum_so_pa: isNaN(parseFloat(item.total_sum_so_pa)) ? 0 : parseFloat(item.total_sum_so_pa),
      //     total_sum_so_var: isNaN(parseFloat(item.total_sum_so_var)) ? 0 : parseFloat(item.total_sum_so_var),
      //     children: []
      //   } as ISameStoreSales);
      // });

      // console.log('###this.dataTableVar - antes', this.dataTableVar);
      // this.dataGraficChart = this.dataTableVar;
      // this.dataTableVar.forEach((item: any) => {
      //   let subIndex = 1;
      //   this.dataTableFormatos.forEach((formato: any) => {
      //     if (item.description == formato.retail) {
      //       item.formato = formato.formato;
      //       item.children.push({
      //         key: `${item.key}-${subIndex++}`,
      //         description: formato.formato,
      //         retail: item.retail,
      //         formato: formato.formato,
      //         total_apertura: isNaN(parseFloat(formato.total_apertura)) ? 0 : parseFloat(formato.total_apertura),
      //         total_apertura_pa: isNaN(parseFloat(formato.total_apertura_pa)) ? 0 : parseFloat(formato.total_apertura_pa),
      //         total_apertura_var: isNaN(parseFloat(formato.total_apertura_var)) ? 0 : parseFloat(formato.total_apertura_var),
      //         total_sss: isNaN(parseFloat(formato.total_sss)) ? 0 : parseFloat(formato.total_sss),
      //         total_sss_pa: isNaN(parseFloat(formato.total_sss_pa)) ? 0 : parseFloat(formato.total_sss_pa),
      //         total_sss_var: isNaN(parseFloat(formato.total_sss_var)) ? 0 : parseFloat(formato.total_sss_var),
      //         total_sum_so: isNaN(parseFloat(formato.total_sum_so)) ? 0 : parseFloat(formato.total_sum_so),
      //         total_sum_so_pa: isNaN(parseFloat(formato.total_sum_so_pa)) ? 0 : parseFloat(formato.total_sum_so_pa),
      //         total_sum_so_var: isNaN(parseFloat(formato.total_sum_so_var)) ? 0 : parseFloat(formato.total_sum_so_var),
      //         children: [],
      //       } as ISameStoreSales);
      //     }
      //   });
      // });

      // this.dataTableVar.forEach((item: any) => {
      //   item.children.forEach((formato: any) => {
      //     let subIndex = 1;
      //     this.dataTableTiendas.forEach((tienda: any) => {
      //       if (formato.retail == tienda.retail && formato.formato == tienda.formato) {
      //         formato.tienda = tienda.tienda;
      //         formato?.children.push({
      //           key: `${item.key}-${subIndex++}`,
      //           description: tienda.tienda,
      //           retail: tienda.retail,
      //           formato: tienda.formato,
      //           tienda: tienda.tienda,
      //           total_apertura: isNaN(parseFloat(tienda.total_apertura)) ? 0 : parseFloat(tienda.total_apertura),
      //           total_apertura_pa: isNaN(parseFloat(tienda.total_apertura_pa)) ? 0 : parseFloat(formato.total_apertura_pa),
      //           total_apertura_var: isNaN(parseFloat(tienda.total_apertura_var)) ? 0 : parseFloat(tienda.total_apertura_var),
      //           total_sss: isNaN(parseFloat(tienda.total_sss)) ? 0 : parseFloat(tienda.total_sss),
      //           total_sss_pa: isNaN(parseFloat(tienda.total_sss_pa)) ? 0 : parseFloat(tienda.total_sss_pa),
      //           total_sss_var: isNaN(parseFloat(tienda.total_sss_var)) ? 0 : parseFloat(tienda.total_sss_var),
      //           total_sum_so: isNaN(parseFloat(tienda.total_sum_so)) ? 0 : parseFloat(tienda.total_sum_so),
      //           total_sum_so_pa: isNaN(parseFloat(tienda.total_sum_so_pa)) ? 0 : parseFloat(tienda.total_sum_so_pa),
      //           total_sum_so_var: isNaN(parseFloat(tienda.total_sum_so_var)) ? 0 : parseFloat(tienda.total_sum_so_var)
      //         } as ISameStoreSales);
      //       }
      //     })

      //   });

      // });
      // console.log('###this.dataTableVar - luego', this.dataTableVar);

      this.dataTableVar = this.getCadenasTable();
      this.dataTableVar.forEach(item => {
        this.mapOfExpandedDataSome[item.key] = this.convertTreeToListSome(item);
      });
      // console.log('###this.mapOfExpandedData', this.mapOfExpandedDataSome);

      
      // Cálculo de totales usando la función
      const totalMontoPA = this.calcularTotalMontoAll(this.dataNewGraphics, this.anios[0]);
      const totalMontoSO = this.calcularTotalMontoAll(this.dataNewGraphics, this.anios[1]);
      const totalMontoPASSS = this.calcularTotalMonto(this.dataNewGraphics, this.anios[0], Constantes.TYPE_DATA_SSS.SSS);
      const totalMontoSOSS = this.calcularTotalMonto(this.dataNewGraphics, this.anios[1], Constantes.TYPE_DATA_SSS.SSS);

      // Cálculo de crecimiento
      this.totalCrecimientoApertura = totalMontoPA > 0 ? ((totalMontoSO - totalMontoPA) / totalMontoPA) * 100 : 0;
      this.totalCrecimientoSSS = totalMontoPASSS > 0 ? ((totalMontoSOSS - totalMontoPASSS) / totalMontoPASSS) * 100 : 0;

      // obtener los datos del año más reciente y del año anterior
      this.datosAnioReciente = this.dataNewGraphics.filter((dato: any) => parseInt(dato.fecha.substring(0, 4)) === this.anios[1]);
      this.datosAnioAnterior = this.dataNewGraphics.filter((dato: any) => parseInt(dato.fecha.substring(0, 4)) === this.anios[0]);

      
      this.loadGraficos();
      this.configuraGraficoComparativo2(processDataSSSGraphicMonth);
    } catch (error) {
      this.loaderVarTable = false;
      this.notification.error('Notificación!!!', `Se genero un error!!!`, { nzDuration: 0 });
      console.error('Error al cargar los datos:', error);
    }

  }

  async loadDataMenu() {

    this.loaderVarTable = true;
    this.loadingDataFilterMenu = true;
    let configurationValues;
    try {
      [
        configurationValues,

      ] = await Promise.all([
        this.sameStoreSalesService.getConfigValues(),
      ]);
      console.log('### configurationValues', configurationValues);
      this.listConfigurationMenu = configurationValues;
    } catch (error) {
      console.error('Error al cargar los datos:', error);
      this.loadingDataFilterMenu = false;
    }

    this.loadingDataFilterMenu = false;
  }

  async loadGraficos(): Promise<void> {
    // this.isTableVarApertura = true;
    //   this.isTableVarSSS = true;

    // 4. Agrupar y sumar importes por poc_cadena_backus para cada año
    const sumaPorCadenaReciente = this.agruparYSumarCadenas(this.datosAnioReciente);
    const sumaPorCadenaAnterior = this.agruparYSumarCadenas(this.datosAnioAnterior);

    const resultadoCombinado = Object.entries(sumaPorCadenaReciente).map(([cadena, sumaReciente]: [string, number]) => {
      const sumaAnterior = sumaPorCadenaAnterior[cadena] || 0;
      return { cadena, sumaReciente, sumaAnterior };
    });

    // 6. calcular la variación
    Object.values(resultadoCombinado).forEach((item: any) => {
      item.variation = item.sumaAnterior > 0 ? parseFloat((((item.sumaReciente / item.sumaAnterior) - 1) * 100).toFixed(1)) : 0;
    });

    const retails = resultadoCombinado.map((item: any) => item.cadena);
    const variacionesPositivasXRetail = resultadoCombinado.map((item: any) => item.variation > 0 ? item.variation : null);
    const variacionesNegativasXRetail = resultadoCombinado.map((item: any) => item.variation < 0 ? item.variation : null);
    //Grafico Variacion Total
    const optionChartVarTotal = {
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
        }
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      xAxis: [
        {
          type: 'value'
        }
      ],
      yAxis: [
        {
          type: 'category',
          axisTick: {
            show: false
          },
          data: retails,
        }
      ],
      series: [
        {
          name: 'Profit',
          type: 'bar',
          itemStyle: {
            color: 'green'
          },
          label: {
            show: true,
            position: 'inside',
            color: 'black', // Cambiado a negro
            backgroundColor: 'yellow', // Resaltado amarillo
            fontWeight: 'bold',
            // formatter: (params: { value: number }) => `{marker|} {bold|${params.value}%}`,
            // formatter: (params: { value: number }) => params.value ? `{marker|} {bold|${params.value}%}` : `{marker|} {bold|'Sin datos'%}`,
            formatter: (params: { value: number }) => (params.value !== null && params.value !== undefined) ? `{marker|} {bold|${params.value}%}` : `{marker|} {bold|Sin datos%}`,
            rich: {
              marker: {
                symbol: 'circle',
                color: '#333'
              },
              bold: {
                fontWeight: 'bold'
              }
            }
          },
          emphasis: {
            focus: 'series'
          },
          tooltip: {
            valueFormatter: (value: number) => value
          },
          data: variacionesPositivasXRetail

        },
        {
          name: 'Expenses',
          type: 'bar',
          itemStyle: {
            color: 'red'
          },
          label: {
            show: true,
            position: 'inside',
            color: 'black', // Cambiado a negro
            backgroundColor: 'yellow', // Resaltado amarillo
            fontWeight: 'bold',
            // formatter: (params: { value: number }) => `{marker|} {bold|${params.value}%}`,
            // formatter: (params: { value: number }) => params.value ? `{marker|} {bold|${params.value}%}` : `{marker|} {bold|'Sin datos'%}`,
            formatter: (params: { value: number }) => (params.value !== null && params.value !== undefined) ? `{marker|} {bold|${params.value}%}` : `{marker|} {bold|Sin datos%}`,
            rich: {
              marker: {
                symbol: 'circle',
                color: '#333'
              },
              bold: {
                fontWeight: 'bold'
              }
            }
          },
          emphasis: {
            focus: 'series'
          },
          tooltip: {
            valueFormatter: (value: number) => value
          },
          barGap: '0%', // Esto alineará las barras para comenzar en el mismo punto
          data: variacionesNegativasXRetail
        }
      ],
      responsive: true,
    };

    // Comparativo Sell OUT 1
    // obtener los datos del año más reciente y del año anterior
    const totalMontoPA = this.calcularTotalMonto(this.dataNewGraphics.filter((dato: any) => (parseInt(dato.fecha.substring(0, 4)) === this.anios[0])), this.anios[0], Constantes.TYPE_DATA_SSS.SSS);
    const totalMontoSO = this.calcularTotalMonto(this.dataNewGraphics.filter((dato: any) => (parseInt(dato.fecha.substring(0, 4)) === this.anios[1])), this.anios[1], Constantes.TYPE_DATA_SSS.SSS);
    // valor mayor entre los dos años
    const mayorVentaPorAnioSSS = totalMontoPA > totalMontoSO ? totalMontoPA : totalMontoSO;

    // obtener los datos del año más reciente y del año anterior Aperturas
    const totalMontoAperturaPA = this.calcularTotalMonto(this.dataNewGraphics.filter((dato: any) => (parseInt(dato.fecha.substring(0, 4)) === this.anios[0])), this.anios[0], Constantes.TYPE_DATA_SSS.APERTURA);
    const totalMontoAperturaSO = this.calcularTotalMonto(this.dataNewGraphics.filter((dato: any) => (parseInt(dato.fecha.substring(0, 4)) === this.anios[1])), this.anios[1], Constantes.TYPE_DATA_SSS.APERTURA);
    // console.log('### totalMontoAperturaPA', totalMontoAperturaPA);
    // console.log('### totalMontoAperturaSO', totalMontoAperturaSO);
    // valor mayor entre los dos años
    const mayorVentaPorAnioApertura = totalMontoAperturaPA > totalMontoAperturaSO ? totalMontoAperturaPA : totalMontoAperturaSO;
    let periodos:any[] = [], ventaPA:any[] = [], ventaSO:any[] = [], mayorVentaTotal;
    if (this.typeDataFilter == 'TODO') {
      periodos = ['SSS', 'Aperturas'];
      ventaPA = [totalMontoPA, totalMontoAperturaPA];
      ventaSO = [totalMontoSO, totalMontoAperturaSO];
      mayorVentaTotal = mayorVentaPorAnioSSS > mayorVentaPorAnioApertura ? mayorVentaPorAnioSSS : mayorVentaPorAnioApertura;
    } else if (this.typeDataFilter == Constantes.TYPE_DATA_SSS.SSS) {
      periodos = ['SSS'];
      ventaPA = [totalMontoPA];
      ventaSO = [totalMontoSO];
      mayorVentaTotal = mayorVentaPorAnioSSS;
    } else if (this.typeDataFilter == Constantes.TYPE_DATA_SSS.APERTURA) {
      periodos = ['Aperturas'];
      ventaPA = [totalMontoAperturaPA];
      ventaSO = [totalMontoAperturaSO];
      mayorVentaTotal = mayorVentaPorAnioApertura;
    }
    // Comparativo Sell OUT 1
    const optionChartComparativo1 = {
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
        data: ['SO (PA)', 'SO']
      },
      xAxis: [
        {
          type: 'category',
          data: periodos,
          axisPointer: {
            type: 'shadow'
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
          max: mayorVentaTotal,
          interval: mayorVentaTotal <= 15000000 ? 5000000 : 20000000,
          position: 'right',  // Coloca este eje y en el lado derecho
          axisLabel: {
            formatter: (value: number) => this.typeFilter == '1' ? `S/.${this.formatNumberWithKDecimal(value)}` : `${this.formatNumberWithKDecimal(value)} hl`,
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
          name: 'SO (PA)',
          type: 'bar',
          data: ventaPA,
          label: {
            show: true,
            position: 'inside',
            align: 'center',
            rotate: 90,
            color: 'black', // Cambiado a negro
            backgroundColor: '#fffeea', // Resaltado amarillo
            fontWeight: 'bold',
            formatter: (params: { value: number }) => params.value ? this.formatNumberWithKDecimal(params.value) : null
          },
          tooltip: {
            valueFormatter: (value: number) => this.formatNumberWithKDecimal(value)
          },
          itemStyle: {
            color: '#d3d3d3',
          },
        },
        {
          name: 'SO',
          type: 'bar',
          label: {
            show: true,
            position: 'inside',
            align: 'center',
            rotate: 90,
            color: 'black', // Cambiado a negro
            backgroundColor: '#fffeea', // Resaltado amarillo
            fontWeight: 'bold',
            formatter: (params: { value: number }) => params.value ? this.formatNumberWithKDecimal(params.value) : null
          },
          tooltip: {
            valueFormatter: (value: number) => this.formatNumberWithKDecimal(value)
          },
          data: ventaSO,
          itemStyle: {
            color: 'yellow',
          },
        },
      ]
    };

    // this.myChart = echarts.init(this.chartVarTotal.nativeElement);
    // Inicializa el gráfico si no está inicializado
    // echarts.init(this.chartVarTotal.nativeElement).setOption(optionChartVarTotal);
    let chartVarTotal = echarts.getInstanceByDom(this.chartVarTotal.nativeElement) || echarts.init(this.chartVarTotal.nativeElement);
    chartVarTotal.setOption(optionChartVarTotal);
    echarts.init(this.chartComparativo1.nativeElement).setOption(optionChartComparativo1);
  }

  async configuraGraficoComparativo2(processDataGraphic: any): Promise<void> {
    
    // Obtenemos las sumas de los meses por año reciente y anterior
    const sumaPorMesesReciente = this.agruparYSumarMeses(this.datosAnioReciente);
    const sumaPorMesesAnterior = this.agruparYSumarMeses(this.datosAnioAnterior);

    const resultadoCombinadoMeses = Object.entries(sumaPorMesesReciente).map(([mes, sumaReciente]: [string, number]) => {
      const sumaAnterior = sumaPorMesesAnterior[mes] || 0;
      return { mes, sumaReciente, sumaAnterior };
    });
    // calcular el crecimiento y el monto mayor
    Object.values(resultadoCombinadoMeses).forEach((item: any) => {
      item.crecimiento = item.sumaAnterior > 0 ? parseFloat((((item.sumaReciente - item.sumaAnterior)/item.sumaAnterior) * 100).toFixed(4)) : 0,
      item.month = this.getMonthNameFormat(item.mes - 1),
      item.mayorSuma = Math.max(item.sumaReciente, item.sumaAnterior)
    });
    console.log('### resultadoCombinadoMeses', resultadoCombinadoMeses);
    // const mayorVentaPorAnio = this.dataNewGraphics.reduce((max:any, venta:any) => venta.monto > max.monto ? venta : max, this.dataNewGraphics[0]);
    const mayorVentaPorAnio = resultadoCombinadoMeses.reduce((max: any, item: any) => item.mayorSuma > max.mayorSuma ? item : max, resultadoCombinadoMeses[0]);

    //Comparativo 2
    const optionChartComparativo2 = {
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
        data: ['SO (PA)', 'SO', 'Crecimiento SO (PA)']
      },
      xAxis: [
        {
          type: 'category',
          data: resultadoCombinadoMeses.map((item: any) => item.month),
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
          max: mayorVentaPorAnio?.mayorSuma,
          interval: mayorVentaPorAnio?.mayorSuma <= 150000000 ? 50000000 : 200000000,
          position: 'right',  // Coloca este eje y en el lado derecho
          axisLabel: {
            formatter: (value: number) => this.typeFilter == '1' ? `S/.${this.formatNumberWithK(value)}` : `${this.formatNumberWithK(value)} hl`,
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
          name: 'SO (PA)',
          type: 'bar',
          data: resultadoCombinadoMeses.map((item: any) => item.sumaAnterior),
          itemStyle: {
            color: '#d3d3d3',
          },
          label: {
            show: true,
            position: 'inside',
            backgroundColor: '#fffeea', // Resaltado amarillo
            fontWeight: 'bold',
            formatter: (params: { value: number }) => this.formatNumberWithK(params.value)
          },
          tooltip: {
            valueFormatter: (value: number) => this.formatNumberWithK(value)
          }
        },
        {
          name: 'SO',
          type: 'bar',
          data: resultadoCombinadoMeses.map((item: any) => item.sumaReciente),
          itemStyle: {
            color: 'yellow',
          },
          label: {
            show: true,
            position: 'inside',
            backgroundColor: '#fffeea', // Resaltado amarillo
            fontWeight: 'bold',
            formatter: (params: { value: number }) => this.formatNumberWithK(params.value)
          },
          tooltip: {
            valueFormatter: (value: number) => this.formatNumberWithK(value)
          }
        },
        {
          name: 'Crecimiento SO (PA)',
          type: 'line',
          yAxisIndex: 1,
          connectNulls: false,
          data: resultadoCombinadoMeses.map((item: any) => item.crecimiento),
          label: {
            show: true,
            position: 'top',
            backgroundColor: 'rgba(255, 255, 0, 0.5)',  // Amarillo semi-transparente
            formatter: (params: { value: number }) => {
              return `${this.redondearSiEsNecesario(params.value, true)} `;
            }
          },
          tooltip: {
            valueFormatter: (value: number) => {
              return this.redondearSiEsNecesario(value, true);
            }
          },
          itemStyle: {
            color: 'black',
          },
        }
      ]
    };
    echarts.init(this.chartComparativo2.nativeElement).setOption(optionChartComparativo2);

  }

  getMonthName(monthNumber: any) {
    const monthNames = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
    return monthNames[parseInt(monthNumber, 10) - 1];
  }

  getMonthNumber(monthName: any) {
    const monthNames = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
    return monthNames.findIndex(name => name == monthName) + 1;
  }

  convertTreeToListSome(root: ISameStoreSales): ISameStoreSales[] {
    const stack: ISameStoreSales[] = [];
    const array: ISameStoreSales[] = [];
    const hashMap = {};
    stack.push({ ...root, level: 0, expand: false });

    while (stack.length !== 0) {
      const node = stack.pop()!;
      this.visitNodeSome(node, hashMap, array);
      if (node.children) {
        for (let i = node.children.length - 1; i >= 0; i--) {
          stack.push({ ...node.children[i], level: node.level! + 1, expand: false, parent: node });
        }
      }
    }

    return array;
  }

  visitNodeSome(node: ISameStoreSales, hashMap: { [key: string]: boolean }, array: ISameStoreSales[]): void {
    if (!hashMap[node.key]) {
      hashMap[node.key] = true;
      array.push(node);
    }
  }

  collapseSome(array: ISameStoreSales[], data: ISameStoreSales, $event: boolean): void {
    // console.log('###collapse-array', array);
    // console.log('###collapse-data', data);
    if (!$event) {
      if (data.children) {
        data.children.forEach(d => {
          const target = array.find(a => a.key === d.key)!;
          target.expand = false;
          this.collapseSome(array, target, false);
        });
      } else {
        return;
      }
    }
  }

  async handleFilterMenu({ filterMenu }: any) {
    // console.log('### handleFilterMenu => filterMenu', filterMenu);
    this.listFilterMenu = filterMenu;
    this.loadData();
  }

  redondearSiEsNecesario(numero: any, esPorcentaje: boolean): string {
    if (typeof numero === 'string') {
      numero = numero.replace('%', '');
    }
    numero = parseFloat(numero);
    if (isNaN(numero)) {
      return '0.0';
    }
    if (esPorcentaje) {
      // Si es un porcentaje, redondeamos a 1 decimal
      return numero.toFixed(1) + '%';  // Devuelve una cadena con el número redondeado a 1 decimal
    } else {
      // Si no es un porcentaje, redondeamos con 1 decimal
      return numero.toFixed(0);  // Devuelve una cadena con el número redondeado a 1 decimal
    }
  }

  onFilterDateChange(result: Date[]): void {
    if (result && result.length === 2) {
      const startDateFormatted = result[0];
      const endDateFormatted = result[1];
      this.filterStartDate = startDateFormatted;
      this.filterEndDate = endDateFormatted;
    }
  }

  onFilterIntervalYearChange(result: string): void {
    this.filterIntervalYear = result;
  }

  onChangeSwitch(result: boolean): void {
    this.typeFilter = result ? '1' : '2';
    this.loadData();
  }

  onChangeSSSFilter(result: string): void {
    if(result === 'filt_all'){
      this.isTableVarApertura = true;
      this.isTableVarSSS = true;
      this.typeDataFilter = 'TODO';
    }
    if(result === 'filt_apertura'){
      this.isTableVarApertura = true;
      this.isTableVarSSS = false;
      this.typeDataFilter = Constantes.TYPE_DATA_SSS.APERTURA;
    }
    if(result === 'filt_sss'){
      this.isTableVarApertura = false;
      this.isTableVarSSS = true;
      this.typeDataFilter = Constantes.TYPE_DATA_SSS.SSS;
    }
    this.loadData();
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
    // yesterday.setHours(0, 0, 0, 0);
    return endValue.getTime() < this.filterStartDate.getTime() || endValue.getTime() > yesterday.getTime();
  };

  handleFilterStartDateOpenChange(open: boolean): void {
    if (!open) {
      this.filterEndDatePicker.open();
    }
  }

  logout() {
    this.router.navigate(['']);
  }

  getItemTotal(item: any, column: any) {
    return item[`total_${column}`];
  }

  collapseDrawer() {
    this.isCollapsed = false;
  }

  convertNumber(number: number) {
    if (number >= 1e6) {
        return parseFloat((number / 1e6).toFixed(2));
    } else if (number >= 1e3) {
        return parseFloat((number / 1e3).toFixed(2));
    } else {
        return number;
    }
  }

  convertNumberToAbreviado(number: number) {
    if (number >= 1e6) {
      return 'M';
    } else if (number >= 1e3) {
        return 'K';
    } else {
        return number;
    }
  }

  applyFilters() {
    // this.loadingDataFilterDate = true;
    if (this.filterStartDate && this.filterEndDate) {
      this.loadData();
    }
  }

  formatNumberWithK = (value: number) => {
    const roundedValue = Math.round(value / 1000);
    return value == undefined ? 0 : `${this.utilService.formatearNumeroConComas(roundedValue)}K`;
  };

  formatNumberWithKDecimal = (value: number) => {
    const roundedValue = Math.round((value / 1000) * 10) / 10;
    return value == undefined ? 0 : `${this.utilService.formatearNumeroConComas(roundedValue)}K`;
  };

  getMonthNameFormat(month: number): string {
    let monthString = format(setMonth(new Date(), month), 'MMMM', { locale: es });
    monthString = monthString.charAt(0).toUpperCase() + monthString.slice(1);  // Convierte la primera letra a mayúscula
    return monthString;
  }

   // Función para agrupar y sumar importes por poc_cadena_backus
  agruparYSumarCadenas = (datos: any[]) => datos.reduce((acum: { [x: string]: any; }, { poc_cadena_backus, importe, hl }: any) => {
    const valorASumar = this.typeFilter == '1' ? parseFloat(importe) : parseFloat(hl);
    acum[poc_cadena_backus] = (acum[poc_cadena_backus] || 0) + valorASumar;
    return acum;
  }, {});

  agruparYSumarRetails = (datos: any[]) => datos.reduce((acum: { [x: string]: any; }, { poc_cadena_backus, importe, hl }: any) => {
    const valorASumar = this.typeFilter == '1' ? parseFloat(importe) : parseFloat(hl);
    acum[poc_cadena_backus] = (acum[poc_cadena_backus] || 0) + valorASumar;
    return acum;
  }, {});

  agruparYSumarSubCadenav0 = (datos: any[]) => datos.reduce((acum: { [x: string]: any; }, { poc_subcadena_backus, importe, hl }: any) => {
    const valorASumar = this.typeFilter == '1' ? parseFloat(importe) : parseFloat(hl);
    acum[poc_subcadena_backus] = (acum[poc_subcadena_backus] || 0) + valorASumar;
    return acum;
  }, {});

  agruparYSumarSubCadena = (datos: any[]) => datos.reduce((acum: { [x: string]: any; }, { poc_subcadena_backus, importe, hl }: any) => {
    const clave = poc_subcadena_backus || "sin_subcadena"; // Usar "sin_subcadena" como clave para valores nulos
    const valorASumar = this.typeFilter == '1' ? parseFloat(importe) : parseFloat(hl);
    acum[clave] = (acum[clave] || 0) + valorASumar;
    return acum;
  }, {});

  agruparYSumarNombreCadena = (datos: any[]) => datos.reduce((acum: { [x: string]: any; }, { poc_nombre_cadena, importe, hl }: any) => {
    const clave = poc_nombre_cadena || "sin_subcadena"; // Usar "sin_subcadena" como clave para valores nulos
    const valorASumar = this.typeFilter == '1' ? parseFloat(importe) : parseFloat(hl);
    acum[clave] = (acum[clave] || 0) + valorASumar;
    return acum;
  }, {});

  // Función para calcular el total de monto
  calcularTotalMontoAll = (data: any, anio: number): number => {
    return data
      .filter((item : any) => item.anio === anio )
      .reduce((acc:any, current:any) => acc + current.monto, 0);
  };

  calcularTotalMonto = (data: any, anio: number, typeSSS: any): number => {
  return data
    .filter((item : any) => item.anio === anio && (item.tipo == typeSSS))
    .reduce((acc:any, current:any) => acc + current.monto, 0);
  };

  agruparYSumarMeses = (datos: any[]) => datos.reduce((acum: { [x: string]: any; }, { mes, importe, hl }: any) => {
    const valorASumar = this.typeFilter == '1' ? parseFloat(importe) : parseFloat(hl);
    acum[mes] = (acum[mes] || 0) + valorASumar;
    return acum;
  }, {});

  calcularVariacion = (actual:any, anterior:any) => anterior > 0 ? parseFloat((((actual / anterior) - 1) * 100).toFixed(1)) : 100;

  calcularCrecimiento = (actual:any, anterior:any) => anterior > 0 ? parseFloat((((actual - anterior) / anterior) * 100).toFixed(1)) : 0;

  getRetails(dataAnterior: any[], dataReciente: any[]){
    const sumaPorCadenaReciente = this.agruparYSumarRetails(dataReciente);
    const sumaPorCadenaAnterior = this.agruparYSumarRetails(dataAnterior);

    const resultadoCombinadoRetail = Object.entries(sumaPorCadenaReciente).map(([cadena, sumaReciente]) => {
      const sumaAnterior = sumaPorCadenaAnterior[cadena] || 0;
      return {
        cadena, sumaReciente, sumaAnterior,
        variation: this.calcularVariacion(sumaReciente, sumaAnterior),
        crecimiento: this.calcularCrecimiento(sumaReciente, sumaAnterior)
      };
    });

    return resultadoCombinadoRetail;
  }

  getSubCadena(dataAnterior: any[], dataReciente: any[]){
    const sumaPorCadenaReciente = this.agruparYSumarSubCadena(dataReciente);
    const sumaPorCadenaAnterior = this.agruparYSumarSubCadena(dataAnterior);

    const resultadoCombinadoRetail = Object.entries(sumaPorCadenaReciente).map(([subCadena, sumaReciente]) => {
      const sumaAnterior = sumaPorCadenaAnterior[subCadena] || 0;
      return {
        subCadena, sumaReciente, sumaAnterior,
        variation: this.calcularVariacion(sumaReciente, sumaAnterior),
        crecimiento: this.calcularCrecimiento(sumaReciente, sumaAnterior)
      };
    });

    return resultadoCombinadoRetail;
  }

  getNombreCadena(dataAnterior: any[], dataReciente: any[]){
    const sumaPorCadenaReciente = this.agruparYSumarNombreCadena(dataReciente);
    const sumaPorCadenaAnterior = this.agruparYSumarNombreCadena(dataAnterior);

    const resultadoCombinadoRetail = Object.entries(sumaPorCadenaReciente).map(([subCadena, sumaReciente]) => {
      const sumaAnterior = sumaPorCadenaAnterior[subCadena] || 0;
      return {
        subCadena, sumaReciente, sumaAnterior,
        variation: this.calcularVariacion(sumaReciente, sumaAnterior),
        crecimiento: this.calcularCrecimiento(sumaReciente, sumaAnterior)
      };
    });

    return resultadoCombinadoRetail;
  }

  getRetailsAndSubCadenaUnique(data: any[]){
    const uniqueItems = data.reduce((acc:any, item:any) => {
      // Create a unique key based on the combination of poc_cadena_backus and poc_subcadena_backus
      const key = `${item.poc_cadena_backus}-${item.poc_subcadena_backus}`;
      // If the key does not exist in the accumulator, add the item to the accumulator
      if (!acc.has(key)) {
        acc.set(key, item);
      }
      return acc;
    }, new Map());
    
    // Convert the Map values to an array
    return Array.from(uniqueItems.values());
  }

  getRetailsAndNombreCadenaUnique(data: any[]){
    const uniqueItems = data.reduce((acc:any, item:any) => {
      // Create a unique key based on the combination of poc_cadena_backus and poc_subcadena_backus
      const key = `${item.poc_cadena_backus}-${item.poc_nombre_cadena}`;
      // If the key does not exist in the accumulator, add the item to the accumulator
      if (!acc.has(key)) {
        acc.set(key, item);
      }
      return acc;
    }, new Map());
    
    // Convert the Map values to an array
    return Array.from(uniqueItems.values());
  }

  getCadenasTable (){
    //Llenado de los retails
    const resultadoCombinadoRetailSSS = this.getRetails(this.dataNewGraphics.filter((dato: any) => (parseInt(dato.fecha.substring(0, 4)) === this.anios[0] && dato.tipo == Constantes.TYPE_DATA_SSS.SSS)), this.dataNewGraphics.filter((dato: any) => (parseInt(dato.fecha.substring(0, 4)) === this.anios[1] && dato.tipo == Constantes.TYPE_DATA_SSS.SSS)));
    // console.log('###resultadoCombinadoRetailSSS-getCadenasTable', resultadoCombinadoRetailSSS);

    const resultadoCombinadoRetailApertura = this.getRetails(this.dataNewGraphics.filter((dato: any) => (parseInt(dato.fecha.substring(0, 4)) === this.anios[0] && dato.tipo == Constantes.TYPE_DATA_SSS.APERTURA)), this.dataNewGraphics.filter((dato: any) => (parseInt(dato.fecha.substring(0, 4)) === this.anios[1] && dato.tipo == Constantes.TYPE_DATA_SSS.APERTURA)));
    // console.log('###resultadoCombinadoRetailApertura-getCadenasTable', resultadoCombinadoRetailApertura);

    const uniqueCadenas = [...new Set(this.dataNewGraphics.map((item:any) => item.poc_cadena_backus))];
    
    // Convert the Map values to an array
    const retailSubCadenaUnique = this.getRetailsAndSubCadenaUnique(this.dataNewGraphics);
    const retailNombreCadenaUnique = this.getRetailsAndNombreCadenaUnique(this.dataNewGraphics);

    // console.log('###uniqueCadenas-getCadenasTable', uniqueCadenas);
    // console.log('###retailSubCadenaUnique-getCadenasTable', retailSubCadenaUnique);
    // console.log('###retailNombreCadenaUnique-getCadenasTable', retailNombreCadenaUnique);

    const resultadoCombinadoNombreCadenaSSS = this.getNombreCadena(this.dataNewGraphics.filter((dato: any) => (parseInt(dato.fecha.substring(0, 4)) === this.anios[0] && dato.tipo == Constantes.TYPE_DATA_SSS.SSS)), this.dataNewGraphics.filter((dato: any) => (parseInt(dato.fecha.substring(0, 4)) === this.anios[1] && dato.tipo == Constantes.TYPE_DATA_SSS.SSS)));
    // console.log('###resultadoCombinadoNombreCadenaSSS-getCadenasTable', resultadoCombinadoNombreCadenaSSS);

    const resultadoCombinadoNombreCadenaApertura = this.getNombreCadena(this.dataNewGraphics.filter((dato: any) => (parseInt(dato.fecha.substring(0, 4)) === this.anios[0] && dato.tipo == Constantes.TYPE_DATA_SSS.APERTURA)), this.dataNewGraphics.filter((dato: any) => (parseInt(dato.fecha.substring(0, 4)) === this.anios[1] && dato.tipo == Constantes.TYPE_DATA_SSS.APERTURA)));
    // console.log('###resultadoCombinadoNombreCadenaApertura-getCadenasTable', resultadoCombinadoNombreCadenaApertura);

    //dataTableNombreCadena
    let dataTableNombreCadena = retailNombreCadenaUnique.map((item: any, index: number) => {
      let itemSSS = resultadoCombinadoNombreCadenaSSS.find((subcadena: any) => subcadena.subCadena == item.poc_nombre_cadena);
      let itemApertura = resultadoCombinadoNombreCadenaApertura.find((subcadena: any) => subcadena.subCadena == item.poc_nombre_cadena);
      return {
        // key: `${index++}`,
        description: item.poc_nombre_cadena,
        retail: item.poc_cadena_backus,
        total_apertura: itemApertura?.sumaReciente || 0,
        total_apertura_pa: itemApertura?.sumaAnterior || 0,
        total_apertura_var: itemApertura?.variation || 0,
        total_retail_crecimiento: itemApertura?.crecimiento || 0,
        total_sss: itemSSS?.sumaReciente || 0,
        total_sss_pa: itemSSS?.sumaAnterior || 0,
        total_sss_var: itemSSS?.variation || 0,
        total_sss_crecimiento: itemSSS?.crecimiento || 0,
        total_sum_so: (itemApertura?.sumaReciente || 0) + (itemSSS?.sumaReciente || 0),
        total_sum_so_pa: (itemApertura?.sumaAnterior || 0) + (itemSSS?.sumaAnterior || 0),
        total_sum_so_var: (itemApertura?.variation || 0) + (itemSSS?.variation || 0),
        children: []
      } as ISameStoreSales
    });

    const resultadoCombinadoSubCadenaSSS = this.getSubCadena(this.dataNewGraphics.filter((dato: any) => (parseInt(dato.fecha.substring(0, 4)) === this.anios[0] && dato.tipo == Constantes.TYPE_DATA_SSS.SSS)), this.dataNewGraphics.filter((dato: any) => (parseInt(dato.fecha.substring(0, 4)) === this.anios[1] && dato.tipo == Constantes.TYPE_DATA_SSS.SSS)));
    // console.log('###resultadoCombinadoSubCadenaSSS-getCadenasTable', resultadoCombinadoSubCadenaSSS);

    const resultadoCombinadoSubCadenaApertura = this.getSubCadena(this.dataNewGraphics.filter((dato: any) => (parseInt(dato.fecha.substring(0, 4)) === this.anios[0] && dato.tipo == Constantes.TYPE_DATA_SSS.APERTURA)), this.dataNewGraphics.filter((dato: any) => (parseInt(dato.fecha.substring(0, 4)) === this.anios[1] && dato.tipo == Constantes.TYPE_DATA_SSS.APERTURA)));
    // console.log('###resultadoCombinadoSubCadenaApertura-getCadenasTable', resultadoCombinadoSubCadenaApertura);

    // console.log('###dataTableNombreCadena-getCadenasTable', dataTableNombreCadena);
    // dataTableSubCadena
    let dataTableSubCadena = retailSubCadenaUnique.map((item: any, index: number) => {
      let itemSSS = resultadoCombinadoSubCadenaSSS.find((subcadena: any) => subcadena.subCadena == item.poc_subcadena_backus);
      let itemApertura = resultadoCombinadoSubCadenaApertura.find((subcadena: any) => subcadena.subCadena == item.poc_subcadena_backus);
      let nombreSubCadenas = dataTableNombreCadena.filter((nombreCadena: any) => nombreCadena.retail == item.poc_cadena_backus)
                                        .sort((a: any, b: any) => {
                                          const descA = a.description || ''; 
                                          const descB = b.description || '';
                                          return descA.localeCompare(descB);
                                        })
      return {
        // key: `${index++}`,
        description: item.poc_subcadena_backus,
        retail: item.poc_cadena_backus,
        total_apertura: itemApertura?.sumaReciente || 0,
        total_apertura_pa: itemApertura?.sumaAnterior || 0,
        total_apertura_var: itemApertura?.variation || 0,
        total_retail_crecimiento: itemApertura?.crecimiento || 0,
        total_sss: itemSSS?.sumaReciente || 0,
        total_sss_pa: itemSSS?.sumaAnterior || 0,
        total_sss_var: itemSSS?.variation || 0,
        total_sss_crecimiento: itemSSS?.crecimiento || 0,
        total_sum_so: (itemApertura?.sumaReciente || 0) + (itemSSS?.sumaReciente || 0),
        total_sum_so_pa: (itemApertura?.sumaAnterior || 0) + (itemSSS?.sumaAnterior || 0),
        total_sum_so_var: (itemApertura?.variation || 0) + (itemSSS?.variation || 0),
        children: nombreSubCadenas
      } as ISameStoreSales
    });

    // console.log('###dataTableSubCadena-getCadenasTable', dataTableSubCadena);

    // dataTableCadena
    let dataTableCadena = uniqueCadenas.map((cadena: any, index: number) => {
      index = index+1;
      let itemSSS = resultadoCombinadoRetailSSS.find((item: any) => item.cadena == cadena);
      let itemApertura = resultadoCombinadoRetailApertura.find((item: any) => item.cadena == cadena);
      let subCadenas = dataTableSubCadena.filter((item: any) => item.retail == cadena)
                                        .sort((a: any, b: any) => {
                                          const descA = a.description || ''; 
                                          const descB = b.description || ''; 
                                          return descA.localeCompare(descB);
                                        })
                                        .map((subCadena: any, indexSubcadena: number) => {
                                          indexSubcadena = indexSubcadena + 1;
                                          return {
                                            ...subCadena, 
                                            key: `${index}-${indexSubcadena}`,
                                            children : subCadena.children.map((nombreCadena: any, indexNombrecadena: number) => {
                                              indexNombrecadena = indexNombrecadena + 1;
                                                return {
                                                  ...nombreCadena,
                                                  key: `${index}-${indexSubcadena}-${indexNombrecadena}`
                                                }
                                            })
                                          };
                                        });
      return {
        key: `${index}`,
        description: cadena,
        retail: cadena,
        total_apertura: itemApertura?.sumaReciente || 0,
        total_apertura_pa: itemApertura?.sumaAnterior || 0,
        total_apertura_var: itemApertura?.variation || 0,
        total_retail_crecimiento: itemApertura?.crecimiento || 0,
        total_sss: itemSSS?.sumaReciente || 0,
        total_sss_pa: itemSSS?.sumaAnterior || 0,
        total_sss_var: itemSSS?.variation || 0,
        total_sss_crecimiento: itemSSS?.crecimiento || 0,
        total_sum_so: (itemApertura?.sumaReciente || 0) + (itemSSS?.sumaReciente || 0),
        total_sum_so_pa: (itemApertura?.sumaAnterior || 0) + (itemSSS?.sumaAnterior || 0),
        total_sum_so_var: (itemApertura?.variation || 0) + (itemSSS?.variation || 0),
        children: subCadenas
      } as ISameStoreSales
    });
    this.totalesCadenas = {
        total_apertura:  0,
        total_apertura_pa: 0,
        total_apertura_var: 0,
        total_retail_crecimiento: 0,
        total_sss: 0,
        total_sss_pa: 0,
        total_sss_var: 0,
        total_sss_crecimiento: 0,
        total_sum_so: 0,
        total_sum_so_pa: 0,
        total_sum_so_var: 0,
    } as ISameStoreSales;

    dataTableCadena.forEach((cadena: any) => {
      this.totalesCadenas.total_apertura += cadena.total_apertura;
      this.totalesCadenas.total_apertura_pa += cadena.total_apertura_pa;
      // this.totalesCadenas.total_apertura_var += cadena.total_apertura_var;
      this.totalesCadenas.total_retail_crecimiento += cadena.total_retail_crecimiento;
      this.totalesCadenas.total_sss += cadena.total_sss;
      this.totalesCadenas.total_sss_pa += cadena.total_sss_pa;
      // this.totalesCadenas.total_sss_var += cadena.total_sss_var;
      this.totalesCadenas.total_sss_crecimiento += cadena.total_sss_crecimiento;
      this.totalesCadenas.total_sum_so += cadena.total_sum_so;
      this.totalesCadenas.total_sum_so_pa += cadena.total_sum_so_pa;
      // this.totalesCadenas.total_sum_so_var += cadena.total_sum_so_var;
    });
    // console.log('###dataTableCadena-getCadenasTable', dataTableCadena);
    // console.log('###totalesCadenas-getCadenasTable', this.totalesCadenas);

    this.totalesCadenas.total_apertura_var = this.calcularVariacion(this.totalesCadenas.total_apertura, this.totalesCadenas.total_apertura_pa);
    this.totalesCadenas.total_sss_var = this.calcularVariacion(this.totalesCadenas.total_sss, this.totalesCadenas.total_sss_pa);
    this.totalesCadenas.total_sum_so_var = this.calcularVariacion(this.totalesCadenas.total_sum_so, this.totalesCadenas.total_sum_so_pa);

    return dataTableCadena;
    

  }
}
