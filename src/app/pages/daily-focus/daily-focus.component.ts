import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
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
import { NzPopoverModule } from 'ng-zorro-antd/popover';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { FormsModule } from '@angular/forms';
import { NzDrawerModule } from 'ng-zorro-antd/drawer';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzSliderModule } from 'ng-zorro-antd/slider';
import { getISOWeek } from 'date-fns';
import { DeviceDetectorService } from '../../services/device-detector.service';
import * as echarts from 'echarts';
import { format, startOfMonth, endOfMonth, setMonth } from 'date-fns';
import { es } from 'date-fns/locale';
import { UtilService } from '../../util.service'


interface Person {
  key: string;
  name: string;
  age: number;
  address: string;
}

@Component({
  selector: 'app-welcome',
  standalone: true,
  templateUrl: './daily-focus.component.html',
  imports: [CommonModule, FormsModule, NzDrawerModule, NzPopoverModule, NzButtonModule, NzSliderModule, NzSpinModule, NzIconModule, NzDatePickerModule, NzTableModule, NzInputModule, NzGridModule, NzSelectModule,  NzLayoutModule, NzListModule, NzMenuModule, NzTabsModule, RouterModule],
  styleUrls: ['./daily-focus.component.scss']
})

export class DailyFocusComponent implements OnInit {
  @ViewChild('myChart') contenedorDelGrafico: ElementRef;
  @ViewChild('filterEndDatePicker') filterEndDatePicker!: NzDatePickerComponent;
  isCollapsed: boolean = false;
  fitlerDate: Date[] = [];
  filterStartDate: Date | null = null;
  filterEndDate: Date | null = null;
  filterIntervalYear: string = '1';
  filterMenu: any = {};
  isMobile: boolean = false;
  isTablet: boolean = false;

  isDesktop: boolean = false;
  loadingDataFilterMenu: boolean = false;
  today = new Date();
  
  //Llenado automatico de los SELECT
  listOfTagOptionsNombre:any= [];
  listOfTagOptionsRetail:any= [];
  listOfTagOptionsDireccionBackus:any= [];
  listOfTagOptionsFormato:any= [];
  listOfTagOptionsZona: any = [];
  listOfTagOptionsGerencia: any = [];
  listOfTagOptionsSubCanalBackus: any = [];
  listOfTagOptionsCluster: any = [];
  listOfTagOptionsSupervisor: any = [];
  listOfTagOptionsCobertura: any = [];
  listOfTagOptionsSku: any = [];
  listOfTagOptionsDescripcion: any = [];
  listOfTagOptionsCategoria: any = [];
  listOfTagOptionsSubCategoria: any = [];
  listOfTagOptionsMarca: any = [];
  listOfTagOptionsTipo: any = [];
  listOfTagOptionsCapacidad: any = [];
  listOfTagOptionsFormatoNor: any = [];
  listOfTagOptionsFormatoVenta: any = [];
  listOfTagOptionsTipoEnvase: any = [];
  listOfTagOptionsServe: any = [];

  constructor(
    public deviceDetectorService: DeviceDetectorService,
    //private ventaService: VentaService,
    public utilService: UtilService,
  ) {
    this.isMobile = this.deviceDetectorService.isMobile;
    this.isTablet = this.deviceDetectorService.isTablet;
    this.isDesktop = this.deviceDetectorService.isDesktop;
  }

  async ngOnInit() {
    this.initializeFilterDate();
  }

  //Metodo para que el Collapse se oculte al inicio
  inicioHidenSideBar(): void {
    this.isCollapsed = !this.isCollapsed;
  }

  initializeFilterDate(): void {
    const today = new Date(); // Obtén la fecha actual

    // Calcula las fechas de inicio y fin del mes actual
    this.filterStartDate = startOfMonth(today);
    this.filterEndDate = today;
  }
  // Función que cambia el valor de hide y show según el estado del menú

  redondearSiEsNecesario(numero: number): number {
    const partes = numero.toString().split(".");
    if (partes.length < 2 || partes[1].length <= 2) {
      return numero; // Si el número ya tiene 2 decimales o menos, lo devolvemos tal cual
    } else {
      return parseFloat(numero.toFixed(2)); // Si el número tiene más de 2 decimales, lo redondeamos
    }
  }

  async loadData() {
    const startDate = format(this.filterStartDate, 'yyyy-MM-dd')
    const endDate = format(this.filterEndDate, 'yyyy-MM-dd')
   /*  let filterMenu: any = {
      nombre_backus: this.listOfTagOptionsNombre,
      retail: this.listOfTagOptionsRetail,
      formato: this.listOfTagOptionsFormato,
      direccion_backus: this.listOfTagOptionsDireccionBackus,
      zona_nielsen: this.listOfTagOptionsZona,
      gerencia_backus: this.listOfTagOptionsGerencia,
      sub_canal_backus: this.listOfTagOptionsSubCanalBackus,
      cluster_backus: this.listOfTagOptionsCluster,
      supervisor_backus: this.listOfTagOptionsSupervisor,
      cobertura: this.listOfTagOptionsCobertura,
      descripcion_nor: this.listOfTagOptionsDescripcion,
      categoria: this.listOfTagOptionsCategoria,
      sub_categoria: this.listOfTagOptionsSubCategoria,
      kpi_sku: this.listOfTagOptionsSku,
      marca: this.listOfTagOptionsMarca,
      tipo: this.listOfTagOptionsTipo,
      capacidad_nor: this.listOfTagOptionsCapacidad,
      formato_nor: this.listOfTagOptionsFormatoVenta,
      tipo_de_envase: this.listOfTagOptionsTipoEnvase,
      serve: this.listOfTagOptionsServe,
    }
    filterMenu = JSON.stringify(filterMenu);
    this.loaderComparativoSellOutGraph = true;
    this.loaderSkuTable = true;
    this.loaderSubcadenaTable = true;
    this.loaderTopBackusTable = true;
    this.loaderBottomBackusTable = true;
    this.loaderTopDescriptionNorTable = true; */

    /* let processSalesData, configurationTableKpiSku, configurationTableRetail, configurationTableTopBackus, configurationTableBottomBackus, configurationTableTopDescriptionNor;

    try {
      [
        processSalesData,
        configurationTableKpiSku,
        configurationTableRetail,
        configurationTableTopBackus,
        configurationTableBottomBackus,
        configurationTableTopDescriptionNor,

      ] = await Promise.all([
        this.ventaService.processSalesData(startDate, endDate, this.filterIntervalYear, filterMenu),
        this.ventaService.configurationTableKpiSku(startDate, endDate, this.filterIntervalYear, filterMenu),
        this.ventaService.configurationTableRetail(startDate, endDate, this.filterIntervalYear, filterMenu),
        this.ventaService.configurationTableTopBackus(startDate, endDate, this.filterIntervalYear, filterMenu),
        this.ventaService.configurationTableBottomBackus(startDate, endDate, this.filterIntervalYear, filterMenu),
        this.ventaService.configurationTableTopDescriptionNor(startDate, endDate, this.filterIntervalYear, filterMenu),
      ]);
    } catch (error) {
      console.error('Error al cargar los datos:', error);}*/
  } 


  ngAfterViewInit() {
    this.initializeFilterDate();
    this.loadData();
   // this.loadDataMenu();

  

  


    const element = document.getElementById('myChartDailyFocus');
    let instance;
    if (element) {
      instance = echarts.getInstanceByDom(element);
      // ...
    } else {
      console.error('Elemento no encontrado: myChart');
    }
    if (instance) {
      echarts.dispose(instance);
    }
    const sellOutHlLineChart = echarts.init(document.getElementById('sellOutHlLineChart'));
    const sellOutLineChart = echarts.init(document.getElementById('sellOutLineChart'));
    const middlePriceLineChart = echarts.init(document.getElementById('middlePriceLineChart'));
    const sellOutTreemapChart = echarts.init(document.getElementById('sellOutTreemapChart'));
    const saleMultipleDynamicChart = echarts.init(document.getElementById('saleMultipleDynamicChart'));
    const retailVariationNegativeChart = echarts.init(document.getElementById('retailVariationNegativeChart'));

    const option = {
      tooltip: {
        trigger: 'axis'
      },
      grid: {
        left: '3%',
        right: '4%',
        top: '4%',
        containLabel: false
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
      },
      yAxis: {
        type: 'value'
      },
      series: [
        {
          name: 'Email',
          type: 'line',
          stack: 'Total',
          data: [120, 132, 101, 134, 90, 230, 210]
        },
        {
          name: 'Union Ads',
          type: 'line',
          stack: 'Total',
          data: [220, 182, 191, 234, 290, 330, 310]
        },
        {
          name: 'Video Ads',
          type: 'line',
          stack: 'Total',
          data: [150, 232, 201, 154, 190, 330, 410]
        },
        {
          name: 'Direct',
          type: 'line',
          stack: 'Total',
          data: [320, 332, 301, 334, 390, 330, 320]
        },
        {
          name: 'Search Engine',
          type: 'line',
          stack: 'Total',
          data: [820, 932, 901, 934, 1290, 1330, 1320]
        }
      ]
    };
    const optionSellOutTreemapChart = {
      series: [
        {
          type: 'treemap',
          data: [
            {
              name: 'nodeA',
              value: 10,
              children: [
                {
                  name: 'nodeAa',
                  value: 4
                },
                {
                  name: 'nodeAb',
                  value: 6
                }
              ]
            },
            {
              name: 'nodeB',
              value: 20,
              children: [
                {
                  name: 'nodeBa',
                  value: 20,
                  children: [
                    {
                      name: 'nodeBa1',
                      value: 20
                    }
                  ]
                }
              ]
            }
          ]
        }
      ]
    };

    const categories = (function () {
      let now = new Date();
      let res = [];
      let len = 10;
      while (len--) {
        res.unshift(now.toLocaleTimeString().replace(/^\D*/, ''));
        now = new Date(+now - 2000);
      }
      return res;
    })();
    const categories2 = (function () {
      let res = [];
      let len = 10;
      while (len--) {
        res.push(10 - len - 1);
      }
      return res;
    })();
    const data = (function () {
      let res = [];
      let len = 10;
      while (len--) {
        res.push(Math.round(Math.random() * 1000));
      }
      return res;
    })();
    const data2 = (function () {
      let res = [];
      let len = 0;
      while (len < 10) {
        res.push(+(Math.random() * 10 + 5).toFixed(1));
        len++;
      }
      return res;
    })();

    const optionSaleMultipleDynamicChart = {
      title: {
        text: 'Dynamic Data'
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'cross',
          label: {
            backgroundColor: '#283b56'
          }
        }
      },
      legend: {},
      dataZoom: {
        show: false,
        start: 0,
        end: 100
      },
      xAxis: [
        {
          type: 'category',
          boundaryGap: true,
          data: categories
        },
        {
          type: 'category',
          boundaryGap: true,
          data: categories2
        }
      ],
      yAxis: [
        {
          type: 'value',
          scale: true,
          name: 'Price',
          max: 30,
          min: 0,
          boundaryGap: [0.2, 0.2]
        },
        {
          type: 'value',
          scale: true,
          name: 'Order',
          max: 1200,
          min: 0,
          boundaryGap: [0.2, 0.2]
        }
      ],
      series: [
        {
          name: 'Dynamic Bar',
          type: 'bar',
          xAxisIndex: 1,
          yAxisIndex: 1,
          data: data
        },
        {
          name: 'Dynamic Line',
          type: 'line',
          data: data2
        }
      ]
    };

    const labelRight = {
      position: 'right'
    };
    const optionRetailVariationNegativeChart = {
      title: {
        text: 'Bar Chart with Negative Value'
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
        }
      },
      grid: {
        top: 80,
        bottom: 30
      },
      xAxis: {
        type: 'value',
        position: 'top',
        splitLine: {
          lineStyle: {
            type: 'dashed'
          }
        }
      },
      yAxis: {
        type: 'category',
        axisLine: { show: false },
        axisLabel: { show: false },
        axisTick: { show: false },
        splitLine: { show: false },
        data: [
          'ten',
          'nine',
          'eight',
          'seven',
          'six',
          'five',
          'four',
          'three',
          'two',
          'one'
        ]
      },
      series: [
        {
          name: 'Cost',
          type: 'bar',
          stack: 'Total',
          label: {
            show: true,
            formatter: '{b}'
          },
          data: [
            { value: -0.07, label: labelRight },
            { value: -0.09, label: labelRight },
            0.2,
            0.44,
            { value: -0.23, label: labelRight },
            0.08,
            { value: -0.17, label: labelRight },
            0.47,
            { value: -0.36, label: labelRight },
            0.18
          ]
        }
      ]
    };

    sellOutHlLineChart.setOption(option);
    sellOutLineChart.setOption(option);
    middlePriceLineChart.setOption(option);
    sellOutTreemapChart.setOption(optionSellOutTreemapChart);
    saleMultipleDynamicChart.setOption(optionSaleMultipleDynamicChart);
    retailVariationNegativeChart.setOption(optionRetailVariationNegativeChart);
  }  
  
  
  
  
  
  
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



  



  onChange(result: Date[]): void {
    console.log('onChange: ', result);
  }



onFilterIntervalYearChange(result: string): void {
      this.filterIntervalYear = result;
      this.loadData();
    }

    onFilterNameBackusChange(result: string): void {
      this.loadData();
    }

    disabledFilterStartDate = (startValue: Date): boolean => {
      if (!startValue || !this.filterEndDate) {
        return false;
      }
      return startValue.getTime() > this.filterEndDate.getTime();
    };

    disabledFilterEndDate = (endValue: Date): boolean => {
      if (!endValue || !this.filterStartDate) {
        return false;
      }
      return endValue.getTime() <= this.filterStartDate.getTime();
    };

    handleFilterStartDateOpenChange(open: boolean): void {
      if(!open) {
        this.filterEndDatePicker.open();
      }
    }

    handleFilterEndDateOpenChange(open: boolean): void {
      if(!open) {
        this.loadData();
      }
    }

    getWeek(result: Date[]): void {
      console.log('week: ', result.map(getISOWeek));
    }


}
