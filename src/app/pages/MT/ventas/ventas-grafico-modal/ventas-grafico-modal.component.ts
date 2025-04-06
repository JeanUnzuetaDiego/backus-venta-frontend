import { AfterViewInit, Component, ElementRef, OnInit, ViewChild, Input, Output, EventEmitter } from '@angular/core';
import * as echarts from 'echarts';
import { es } from 'date-fns/locale';
import { format, setMonth } from 'date-fns';
import { UtilService } from '../../../../util.service';
import { VentaService } from '../venta.service';

@Component({
  selector: 'app-ventas-grafico-modal',
  templateUrl: './ventas-grafico-modal.component.html',
  styleUrl: './ventas-grafico-modal.component.scss',
})

export class VentasGraficoModalComponent implements OnInit, AfterViewInit {
  @Input() data: any;
  @Input() typeFilterSelection: any;
  @Input() visible: boolean;
  @Output() modalClosed = new EventEmitter<void>();
  @ViewChild('myChartModal') contenedorDelGrafico: ElementRef;
  loaderComparativoSellOutGraph: boolean = false;
  myChartModal: any;
  isChartLoaded: boolean = false;

  dataVentas: any = [];

  filterStartDate: Date | null = null;
  filterEndDate: Date | null = null;
  filterIntervalYear: string = '1';

  constructor(
    public utilService: UtilService,
    public ventaService: VentaService,
  ) {
  }

  async ngOnInit() {
    
  }

  async ngAfterViewInit() {
    this.dataVentas = this.data;
    this.initializeDataAndGraph();
  }

  async initializeDataAndGraph() {
    if (this.dataVentas) {
      setTimeout(() => {
        if (this.typeFilterSelection === 'año'){ 
          this.configuraGraficoYear(this.dataVentas);
        } else if(this.typeFilterSelection === 'mes'){
          this.configuraGraficoMonth(this.dataVentas);
        } else if (this.typeFilterSelection === 'semana') {
          this.configuraGraficoWeek(this.dataVentas);
        } else if (this.typeFilterSelection === 'dia') {
          this.configuraGraficoDay(this.dataVentas);
        } 
      }, 0);
    }
  }

  async configuraGraficoYear(dataVentas: any, elementId: string = 'myChartModal'): Promise<void> {
    // Inicializa el gráfico
    this.myChartModal = echarts.init(document.getElementById(elementId) as HTMLDivElement);
    this.isChartLoaded = true;  // Añade esta línea al final de tu método configuraGrafico para indicar que el gráfico se cargó correctamente
    const anios = dataVentas.map((venta: any) => parseInt(venta.año.split('-')[0])).sort((a:number, b:number) => a - b);
    const total_hl_anio = dataVentas.map((venta: any) => ({anio: parseInt(venta.año.split('-')[0]), total_hl: parseFloat(venta.total_hl)})).sort((a:any, b:any) => a.anio - b.anio);
    const mayorVentaPorAnio = total_hl_anio.reduce((max:any, venta:any) => venta.total_hl > max.total_hl ? venta : max, total_hl_anio[0]);
    const hlPorAnioPA = total_hl_anio.filter((venta:any) => (venta.anio == anios[0])).map((venta:any) => venta.total_hl);
    const hlPorAnioSO = total_hl_anio.filter((venta:any) => (venta.anio == anios[1])).map((venta:any) => venta.total_hl);
    const crecimientoPorAnio = (((hlPorAnioSO - hlPorAnioPA) / hlPorAnioPA) * 100).toFixed(0);

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
        data: [null, hlPorAnioSO[0]],
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
          formatter: (params: any) => params.value !== null ? `${params.value}%` : ''
        },
        tooltip: {
          valueFormatter: (value: number) => `${value}%`
        }
      }]
    };

    // Configura las opciones del gráfico
    this.myChartModal.setOption(option);
    this.loaderComparativoSellOutGraph = false;
  }

  async configuraGraficoMonth(dataVentas: any, elementId: string = 'myChartModal'): Promise<void> {
    // Inicializa el gráfico
    this.myChartModal = echarts.init(document.getElementById(elementId) as HTMLDivElement);
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
        crecimientoPorMonth.push(crecimiento.toFixed(0));
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
                  if (params.value !== null) {
                      return `${params.value}%`;
                  }
                  return ''; // Si es null, no muestra nada
              }
          },
          tooltip: {
            valueFormatter: (value: number) => {
              return value + '%';
            }
          }
        }
      ]
    };
    // Configura las opciones del gráfico
    this.myChartModal.setOption(option);
    this.loaderComparativoSellOutGraph = false;
  }

  async configuraGraficoWeek(dataVentas: any, elementId: string = 'myChartModal'): Promise<void> {
    // Inicializa el gráfico
    this.myChartModal = echarts.init(document.getElementById(elementId) as HTMLDivElement);
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
        crecimientoPorSemana.push(crecimiento.toFixed(0));
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
                  if (params.value !== null) {
                      return `${params.value}%`;
                  }
                  return ''; // Si es null, no muestra nada
              }
          },
          tooltip: {
            valueFormatter: (value: number) => {
              return value + '%';
            }
          }
        }
      ]
    };
    // Configura las opciones del gráfico
    this.myChartModal.setOption(option);
    this.loaderComparativoSellOutGraph = false;
  }
  
  async configuraGraficoDay(dataVentas: any, elementId: string = 'myChartModal'): Promise<void> {
    // Inicializa el gráfico
    this.myChartModal = echarts.init(document.getElementById(elementId) as HTMLDivElement);
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
        crecimientoPorDay.push(crecimiento.toFixed(0));
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
                  if (params.value !== null) {
                      return `${params.value}%`;
                  }
                  return ''; // Si es null, no muestra nada
              }
          },
          tooltip: {
            valueFormatter: (value: number) => {
              return value + '%';
            }
          }
        }
      ]
    };
    // Configura las opciones del gráfico
    this.myChartModal.setOption(option);
    this.loaderComparativoSellOutGraph = false;
  }

  getMonthName(month: number): string {
    let monthString = format(setMonth(new Date(), month), 'MMMM', { locale: es });
    monthString = monthString.charAt(0).toUpperCase() + monthString.slice(1);  // Convierte la primera letra a mayúscula
    return monthString;
  }

  formatNumberWithK = (value: number) => {
    const roundedValue = Math.round(value / 1000);
    return value == undefined ? 0 : `${this.utilService.formatearNumeroConComas(roundedValue)}K`;
  };

  closeModal(): void {
    this.visible = false;
    this.modalClosed.emit();
  }
}