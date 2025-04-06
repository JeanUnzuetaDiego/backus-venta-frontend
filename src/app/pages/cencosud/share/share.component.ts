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
import { format, startOfMonth, endOfMonth, setMonth, differenceInCalendarDays, parse, subDays, eachWeekOfInterval, endOfWeek, getWeek, startOfWeek } from 'date-fns';
import { UtilService } from '../../../util.service'
import * as echarts from 'echarts';
import { SameStoreSalesService } from './share.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { ISameStoreSales } from '../../dto/SameStoreSales.dto';
import Constantes from '../../../util/constants/constantes';
import { es } from 'date-fns/locale';
import { DrawerWrapperCencosudComponent } from '../../../components/shared/drawer-wrapper-cencosud/drawer-wrapper-cencosud.component';


@Component({
  selector: 'app-share',
  standalone: true,
  imports: [CommonModule, FormsModule, NzNotificationModule, NzSwitchModule, NzDrawerModule, NzAvatarModule, NzToolTipModule, NzPopoverModule, NzButtonModule, NzSliderModule, NzSpinModule, NzIconModule, NzDatePickerModule, NzTableModule, NzInputModule, NzGridModule, NzSelectModule, NzLayoutModule, NzListModule, NzMenuModule, NzTabsModule, RouterModule, NzModalModule, DrawerWrapperCencosudComponent],
  templateUrl: './share.component.html',
  styleUrl: './share.component.scss'
})
export class ShareComponent implements OnInit, AfterViewInit {
  @ViewChild('filterEndDatePicker') filterEndDatePicker!: NzDatePickerComponent;
  @ViewChild('chartVarTotal') chartVarTotal: ElementRef;
  @ViewChild('chartComparativo2') chartComparativo2: ElementRef;
  @ViewChild('chartComparativo3') chartComparativo3: ElementRef;
  @ViewChild('chartPieRetail') chartPieRetail: ElementRef;
  @ViewChild('chartPieClient') chartPieClient: ElementRef;

  //Graficos
  elementchartVarTotal: any;
  optionChartComparativo1: any;
  optionChartComparativo2: any;

  //arrays para llenar los chekboxes
  dataGraphics: any = [];
  dataVentaShare: any = [];
  dataEvolutionShare: any = [];
  dataChartPieRetail: any = [];
  dataNewGraphics: any = [];
  anios: any = [];
  datosAnioReciente: any = [];
  datosAnioAnterior: any = [];
  hiddenButtonArrowUp: boolean = false;
  contentChartPieRetail: any = null

  isDesktop: boolean = false;
  isMobile: boolean = false;
  isTablet: boolean = false;

  isTableVarApertura: boolean = true;
  isTableVarSSS: boolean = true;

  isCollapsed: boolean = false;
  fitlerDate: Date[] = [];
  filterStartDate: Date | null = null;
  filterYear: Date | null = new Date();
  filterYearSelected: String | null = new Date().getFullYear().toString();
  filterMonth: String[] | null = null;
  filterWeek: String[] | null = null;
  filterEndDate: Date | null = null;
  filterMenu: any = {};

  // 1 = categoria, 2 = marca, 3 = sku
  filterZoomInChartPieRetail: number = 1;
  filterSelectionCategChartPieRetail: string = '';
  filterSelectionMarcaChartPieRetail: string = '';

  listOfMonth: Array<{value: string, name: string, disabled: boolean}> = [];
  listOfMonthSelected: string[] = [];

  listOfWeek: Array<{value: string, name: string, disabled: boolean}> = [];
  listOfWeekSelected: string[] = [];

  user: any = {};
  today = new Date();

  listConfigurationMenu: any[] = [];
  listFilterMenu: any[] = [];
  typeOptionMenu: string = 'analisis-precios';

  loaderComparativoSellOutGraph: boolean = false;

  loadingDataFilterMenu: boolean = false;
  loadingDataFilterDate: boolean = false;
  loaderVarTable: boolean = false;
  loaderChartPieRetail: boolean = false;
  sssFilter: string = 'filt_all';
  typeDataFilter: string = 'TODO';
  typeFilter: string = '2';
  typeFilterSwith = false;
  myChart: any;

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
  }

  laodListOfMonth(): void {
    const currentDate = new Date();
    const currentYear = String(currentDate.getFullYear());
    const currentMonth = currentDate.getMonth() + 1; // JavaScript cuenta los meses desde 0
    const isCurrentYear = this.filterYearSelected === currentYear;



    this.listOfMonth = [
      { name: '1. Enero', value: '1', disabled: false },
      { name: '2. Febrero', value: '2', disabled: false },
      { name: '3. Marzo', value: '3', disabled: false },
      { name: '4. Abril', value: '4', disabled: false },
      { name: '5. Mayo', value: '5', disabled: false },
      { name: '6. Junio', value: '6', disabled: false },
      { name: '7. Julio', value: '7', disabled: false },
      { name: '8. Agosto', value: '8', disabled: false },
      { name: '9. Septiembre', value: '9', disabled: false },
      { name: '10. Octubre', value: '10', disabled: false },
      { name: '11. Noviembre', value: '11', disabled: false },
      { name: '12. Diciembre', value: '12', disabled: false }
    ].map((month, index) => ({
      ...month,
      disabled: isCurrentYear ? index >= currentMonth : false // Deshabilita los meses futuros solo si es el año actual
    }));
  }

  async ngAfterViewInit() {
    const userStorage = localStorage.getItem('user');
    this.user = userStorage ? JSON.parse(userStorage) : null;
    if (!this.user) {
      this.message.error('No existe token de sesión, por favor inicie sesión');
      this.router.navigate(['']);
    }

        // echarts.init(this.chartPieRetail.nativeElement).setOption(option);
    // Inicializar ECharts en el elemento del DOM y aplicar las opciones
    this.contentChartPieRetail = echarts.init(this.chartPieRetail.nativeElement);

    // Añadir listener para el evento de clic
    this.contentChartPieRetail.on('click', (params: any) => {
      // `params` contiene información sobre el área del gráfico que fue clickeada
      console.log('##### data params', params);
      if (params.componentType === 'series' && params.seriesType === 'pie') {

        if (this.filterZoomInChartPieRetail >= 3 ) return;

        this.filterZoomInChartPieRetail += 1;
        this.hiddenButtonArrowUp = true;

        if (this.filterZoomInChartPieRetail === 2) {
          this.filterSelectionCategChartPieRetail = params.name.toUpperCase();
          this.filterSelectionMarcaChartPieRetail = '';
        } else if (this.filterZoomInChartPieRetail === 3) {
          this.filterSelectionMarcaChartPieRetail = params.name.toUpperCase();
        }
        console.log('##### this.filterZoomInChartPieRetail', this.filterZoomInChartPieRetail);
        this.loadData();
      }
    });
    this.initializeFilter();
    this.laodListOfMonth();
    this.loadData();
    // this.loadGraficos();

    // page Cencosud Share
  }

  //Metodo para que el Collapse se oculte al inicio
  inicioHidenSideBar(): void {
    this.isCollapsed = !this.isCollapsed;
  }

  initializeFilter(): void {
    const currentDate = new Date();
    this.filterYear = currentDate;

    const currentMonth = currentDate.getMonth() + 1; // JavaScript cuenta los meses desde 0
    this.filterMonth = [String(currentMonth)];

    this.listOfWeek = this.getWeeksOfYear(Number(this.filterYearSelected), this.filterMonth?.map(Number));

    // Calcular el primer día del año
    const startOfYear = new Date(currentDate.getFullYear(), 0, 1);

    // Calcular la diferencia en días
    const diff = currentDate.getTime() - startOfYear.getTime();
    const oneDay = 1000 * 60 * 60 * 24;
    const dayOfYear = Math.floor(diff / oneDay);

    // Calcular el número de la semana
    let weekNumber = Math.ceil(dayOfYear / 7);

    // Ajustar el número de la semana si la fecha actual no es sábado
    if (currentDate.getDay() != 6) { // Si no es sábado
      weekNumber -= 1; // Considerar la semana anterior como la última semana completa
    }
    this.filterWeek = [String(weekNumber)];
  }

  async loadData() {
    this.loaderVarTable = true;
    this.loaderComparativoSellOutGraph = true;

    let processDataVentaShare: any, processDataEvolutionShare: any, processDataChartPieRetail: any;
    const filterMonth: string = this.filterMonth?.length > 0 ? this.filterMonth.join(',') : ``;
    const filterWeek: string = this.filterWeek?.length > 0 ? this.filterWeek.join(',') : ``;

    try {
      [
        processDataVentaShare,
        processDataChartPieRetail,
        processDataEvolutionShare,
      ] = await Promise.all([
        this.sameStoreSalesService.processDataVentaShare(this.filterYearSelected, filterMonth, filterWeek),
        this.sameStoreSalesService.processDataChartPieRetail(this.filterYearSelected, filterMonth, filterWeek, String(this.filterZoomInChartPieRetail), this.filterSelectionCategChartPieRetail, this.filterSelectionMarcaChartPieRetail),
        this.sameStoreSalesService.processDataEvolutionShare(this.filterYearSelected, filterMonth, filterWeek),
        // this.sameStoreSalesService.processDataSSSGraphicMonth(JSON.stringify(this.listFilterMenu), this.typeFilter, this.sssFilter),
      ]);

      this.dataVentaShare = processDataVentaShare;
      this.dataEvolutionShare = processDataEvolutionShare;
      this.dataChartPieRetail = processDataChartPieRetail?.map((item: any) => ({...item, fecha: item.semana, anio: parseInt(item.semana.substring(0, 4)), semana: parseInt(item.semana.substring(4, 6))}));
      this.loaderVarTable = false;

      this.configuraGraficoComparativo2(this.dataVentaShare);
      this.loadgraphicsChartPieRetail();
      this.configuraGraficoComparativo3(this.dataEvolutionShare);
    } catch (error) {
      this.loaderVarTable = false;
      this.notification.error('Notificación!!!', `Se genero un error!!!`, { nzDuration: 0 });
      console.error('Error al cargar los datos:', error);
    }

  }

  async configuraGraficoComparativo2(processDataGraphic: any): Promise<void> {

    //
    const mayorVentaPorAnio = this.dataVentaShare.reduce((max:any, venta:any) => venta.importe_total > max.importe_total ? venta : max, this.dataVentaShare[0]);

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
        data: ['Ventas']
      },
      xAxis: [
        {
          type: 'category',
          data: this.dataVentaShare.map((item: any) => item.semana),
          axisPointer: {
            type: 'shadow'
          },
          axisLabel: {
            rotate: 0,  // Ajusta la rotación de las etiquetas a 45 grados
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
          max: mayorVentaPorAnio?.importe_total,
          interval: mayorVentaPorAnio?.importe_total <= 150000000 ? 50000000 : 200000000,
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
          data: this.dataVentaShare.map((item: any) => item.importe_total),
          itemStyle: {
            color: 'yellow',
          },
          label: {
            show: true,
            position: 'inside',
            backgroundColor: '#fff', // Resaltado amarillo
            fontWeight: 'bold',
            formatter: (params: { value: number }) => this.formatNumberWithK(params.value)
          },
          tooltip: {
            valueFormatter: (value: number) => this.formatNumberWithK(value)
          }
        },
      ]
    };

    echarts.init(this.chartComparativo2.nativeElement).setOption(optionChartComparativo2);
  }

  async configuraGraficoComparativo3(processDataGraphic: any): Promise<void> {
    // Filtrar los datos para el año seleccionado
    const dataSelectedYear = processDataGraphic.filter((item: any) => {
      const yearOfItem = new Date(item.fecha).getFullYear();
      return yearOfItem === Number(this.filterYearSelected);
    });

    // Filtrar los datos para el año siguiente al seleccionado
    const dataBeforeSelectedYear = processDataGraphic.filter((item: any) => {
      const yearOfItem = new Date(item.fecha).getFullYear();
      return yearOfItem === Number(this.filterYearSelected) - 1;
    });

    // Paso 1: Extraer los meses (ya lo estás haciendo)
    const meses = processDataGraphic.map((item: any) => item.mes);

    // Paso 2 y 3: Eliminar duplicados y convertir de vuelta a arreglo
    const mesesUnicos = Array.from(new Set(meses));
    console.log('#### meses unicos: ', mesesUnicos)

    // Paso 4: Ordenar el arreglo
    const mesesOrdenados = mesesUnicos.sort((a, b) => Number(a) - Number(b));
    console.log('#### meses ordenados: ', mesesOrdenados)


    // Paso 1: Agrupar los importes por mes
    const sumaPorMesPO = dataBeforeSelectedYear.reduce((acumulador: { [x: string]: number; }, { mes, importe_total }: any) => {
      if (!acumulador[mes]) {
        acumulador[mes] = 0;
      }
      acumulador[mes] += parseFloat(importe_total);
      return acumulador;
    }, {});

    // Paso 2: Convertir el objeto a un arreglo de objetos
    const resultadoPO = Object.entries(sumaPorMesPO).map(([mes, total]) => ({
      mes: parseInt(mes),
      total
    }));

    // Paso 3: Ordenar el arreglo por mes
    resultadoPO.sort((a, b) => a.mes - b.mes);
    console.log('#### resultadoPO: ', resultadoPO)


    // Paso 1: Agrupar los importes por mes
    const sumaPorMes = dataSelectedYear.reduce((acumulador: { [x: string]: number; }, { mes, importe_total }: any) => {
      if (!acumulador[mes]) {
        acumulador[mes] = 0;
      }
      acumulador[mes] += parseFloat(importe_total);
      return acumulador;
    }, {});

    // Paso 2: Convertir el objeto a un arreglo de objetos
    const resultado = Object.entries(sumaPorMesPO).map(([mes, total]) => ({
      mes: parseInt(mes),
      total
    }));

    // Paso 3: Ordenar el arreglo por mes
    resultado.sort((a, b) => a.mes - b.mes);
    console.log('#### resultado: ', resultado)

    const sumaGeneral = this.dataEvolutionShare.reduce((acumulador: number, { importe_total }: any) => {
      return acumulador + parseFloat(importe_total);
    }, 0);
    console.log('#### sumaGeneral: ', sumaGeneral)



    //Comparativo 2
    const optionChartComparativo3 = {
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
        data: ['Share LY', 'Share']
      },
      xAxis: [
        {
          type: 'category',
          data: mesesOrdenados,
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
          max: sumaGeneral,
          interval: sumaGeneral <= 150000000 ? 50000000 : 200000000,
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
          name: 'Share LY',
          type: 'bar',
          data: resultadoPO.map((item: any) => item.total),
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
          name: 'Share',
          type: 'bar',
          data: resultado.map((item: any) => item.total),
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
        }
      ]
    };

    echarts.init(this.chartComparativo3.nativeElement).setOption(optionChartComparativo3);
  }

  async loadgraphicsChartPieRetail() {
    const estrategiasAgrupacion: any = {
      2: this.agruparPorMarcaYSumarImporteUnitario,
      3: this.agruparPorSkuYSumarImporteUnitario,
      default: this.agruparPorCategoriaYSumarImporteUnitario,
    };

    const funcionAgrupacion = estrategiasAgrupacion[this.filterZoomInChartPieRetail] || estrategiasAgrupacion.default;
    const categorias = await funcionAgrupacion(this.dataChartPieRetail);
    const ventaTotalCategorias = categorias.reduce((suma: number, item: any) => suma + parseFloat(item.importe_total), 0);
    const categoriasConPorcentaje = categorias.map((item: any) => ({
      ...item,
      name: this.convertTextCamelCase(this.filterZoomInChartPieRetail === 2 ? item.sku_marca : this.filterZoomInChartPieRetail === 3 ? item.sku_descripcion : item.categoria),
      value:this.redondearUnDecimal(item.importe_total / ventaTotalCategorias), totalPartCliente: this.redondearUnDecimal(item.importe_unitario / item.importe_total)
    })); // Calcular el porcentaje de venta de cada categoría
    // const categoriasConPorcentaje = categorias.map((item) => ({name: item.categoria, value:666 })); // Calcular el porcentaje de venta de cada categoría
    // Opciones para el gráfico de pie de ECharts
    const option = {
      tooltip: {
        trigger: 'item',
        formatter: (params:any) => {
          let result = '';
          if (this.filterZoomInChartPieRetail === 2) {
            result = `
            <div style="text-align: left;">
              <table>
                <tr><td style="text-align: right;"><b>${params.data.sku_marca}</b></td><td></td></tr>
                <tr><td style="text-align: right;">Venta Cliente:</td><td><b>${this.utilService.formatearNumeroConComas(params.data.importe_unitario)}</b></td></tr>
                <tr><td style="text-align: right;">Participación Cliente:</td><td><b>${params.data.totalPartCliente}%</b></td></tr>
              </table>
            </div>
            `;
          } else if (this.filterZoomInChartPieRetail === 3) {
            result = `
            <div style="text-align: left;">
              <table>
                <tr><td style="text-align: right;"><b>${params.data.sku_descripcion}</b></td><td></td></tr>
                <tr><td style="text-align: right;">Venta Cliente:</td><td><b>${this.utilService.formatearNumeroConComas(params.data.importe_unitario)}</b></td></tr>
                <tr><td style="text-align: right;">Participación Cliente:</td><td><b>${params.data.totalPartCliente}%</b></td></tr>
              </table>
            </div>
            `;
          } else {
            result =  `
            <div style="text-align: left;">
              <table>
                <tr><td style="text-align: right;">Rubro:</td><td> <b>${params.name}</b></td></tr>
                <tr><td style="text-align: right;">Venta Rubro:</td><td><b>${params.data.importe_total}</b></td></tr>
                <tr><td style="text-align: right;">Participación Rubro: </td><td><b>${params.data.value}%</b></td></tr>
                <tr><td style="text-align: right;">Venta Cliente:</td><td><b>${this.utilService.formatearNumeroConComas(params.data.importe_unitario)}</b></td></tr>
                <tr><td style="text-align: right;">Participación Cliente:</td><td><b>${params.data.totalPartCliente}%</b></td></tr>
              </table>
            </div>
            `
          }

          return result;
        },
      },
      series: [
        {
          name: 'Access From',
          type: 'pie',
          radius: ['38%', '60%'],
          data: categoriasConPorcentaje,
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          }
        }
      ]
    };

    this.contentChartPieRetail.setOption(option);
  }

  onChangeButtonUpChartPieRetail(): void {
    if (this.filterZoomInChartPieRetail == 1) return;
    this.filterZoomInChartPieRetail -= 1;

    if (this.filterZoomInChartPieRetail == 1) this.hiddenButtonArrowUp = false;

    this.loadData();
  }

  async handleFilterMenu({ filterMenu }: any) {
    // console.log('### handleFilterMenu => filterMenu', filterMenu);
    this.listFilterMenu = filterMenu;
    this.loadData();
  }

  actionButton() {
    console.log('Acción específica ejecutada');
  }

  convertTextCamelCase(value: string): string {
    return value.toLowerCase().split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  }
  redondearUnDecimal(value: number): number {
    const result = value == 0 ? 0.0 : Math.round((value * 100) * 10) / 10;
    return result;
  }

  async agruparPorCategoriaYSumarImporteUnitario(dataArray: any[]): Promise<any[]> {
    const resultadoAgrupado = dataArray.reduce((acc, item) => {
      if (!acc[item.categoria]) {
        acc[item.categoria] = {
          ...item,
          importe_total: parseFloat(item.importe_total),
          importe_unitario: parseFloat(item.importe_unitario) // Asegurarse de convertir al agregar por primera vez
        };
      } else {
        acc[item.categoria].importe_unitario += parseFloat(item.importe_unitario); // Sumar después de convertir a número
      }
      return acc;
    }, {});

    return Object.values(resultadoAgrupado);
  }

  async agruparPorMarcaYSumarImporteUnitario(dataArray: any[]): Promise<any[]> {
    const resultadoAgrupado = dataArray.reduce((acc, item) => {
      if (!acc[item.sku_marca]) {
        acc[item.sku_marca] = {
          ...item,
          importe_total: parseFloat(item.importe_total),
          importe_unitario: parseFloat(item.importe_unitario) // Asegurarse de convertir al agregar por primera vez
        };
      } else {
        acc[item.sku_marca].importe_unitario += parseFloat(item.importe_unitario); // Sumar después de convertir a número
      }
      return acc;
    }, {});

    return Object.values(resultadoAgrupado);
  }

  async agruparPorSkuYSumarImporteUnitario(dataArray: any[]): Promise<any[]> {
    const resultadoAgrupado = dataArray.reduce((acc, item) => {
      if (!acc[item.sku_descripcion]) {
        acc[item.sku_descripcion] = {
          ...item,
          importe_total: parseFloat(item.importe_total),
          importe_unitario: parseFloat(item.importe_unitario) // Asegurarse de convertir al agregar por primera vez
        };
      } else {
        acc[item.sku_descripcion].importe_unitario += parseFloat(item.importe_unitario); // Sumar después de convertir a número
      }
      return acc;
    }, {});

    return Object.values(resultadoAgrupado);
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

  applyFilters = () => {
    if (!this.filterYearSelected) this.notification.error('Notificación!!!', `No hay un año seleccionado!!!`, { nzDuration: 0 });
    else this.loadData();
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

  onChangeFilterMonth(result: string[]): void {
    const filterMonth = result.map(Number).sort((a, b) => a - b);
    this.filterMonth = filterMonth.map(String);

    this.listOfWeek = this.getWeeksOfYear(Number(this.filterYearSelected), this.filterMonth?.map(Number));
    // Reiniciar la selección de semanas
    this.filterWeek = [];
  }

  onChangeFilterWeek(result: string[]): void {
    this.filterWeek = result;
  }

  getWeeksOfYear(year: number, selectedMonths: number[] = []) {
    const weeks: Array<{value: string, name: string, disabled: boolean}> = [];
    let lastWeekOfYearProcessed = 0;
    const currentYear = new Date().getFullYear();
    const currentDate = new Date();
    const currentWeek = getWeek(currentDate, { weekStartsOn: 1 });
    const isCurrentYear = year === currentYear;
    // Determinar si hoy es sábado para saber si la semana está completa
    const isWeekComplete = currentDate.getDay() === 6;

    const months = selectedMonths.length > 0 ? selectedMonths : Array.from({length: 12}, (_, i) => i + 1);

    months.forEach(month => {
      const startDate = new Date(year, month - 1, 1);
      const endDate = new Date(year, month, 0);

      const weeksOfMonth = eachWeekOfInterval({ start: startDate, end: endDate }, { weekStartsOn: 1 });

      weeksOfMonth.forEach((weekStart) => {
        const weekOfYear = getWeek(weekStart, { weekStartsOn: 1 });

        if (weekOfYear > lastWeekOfYearProcessed) {
          const weekEnd = endOfWeek(weekStart, { weekStartsOn: 1 });
          const formattedStart = format(weekStart, 'dd-MM-yyyy', { locale: es });
          const formattedEnd = format(weekEnd, 'dd-MM-yyyy', { locale: es });

          // Construir el objeto para la semana actual
          const weekObject = {
            value: `${weekOfYear}`,
            name: `${year} Sem. ${weekOfYear} (${formattedStart} al ${formattedEnd})`,
            // Deshabilitar si es una semana futura del año actual o si es la semana actual pero no está completa
            disabled: isCurrentYear && (weekOfYear > currentWeek || (weekOfYear === currentWeek && !isWeekComplete))
          };
          weeks.push(weekObject);

          lastWeekOfYearProcessed = weekOfYear;
        }
      });
    });

    return weeks;
  }

  onChangeFilterYear(result: Date): void {
    this.filterYear = result;

    const yearAsString = format(result, 'yyyy');
    this.filterYearSelected = yearAsString

    this.listOfWeek = this.getWeeksOfYear(parseInt(yearAsString), this.filterMonth?.map(Number));
  }

}
