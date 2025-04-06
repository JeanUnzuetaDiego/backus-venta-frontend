import {
  Component,
  OnInit,
  AfterViewInit,
  ViewChild,
} from '@angular/core';
import { v4 as uuidv4 } from "uuid";
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
import { NzPaginationModule } from 'ng-zorro-antd/pagination';
import { FormsModule } from '@angular/forms';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { NzDrawerModule } from 'ng-zorro-antd/drawer';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { DescargablesService } from '../../descargables/descargables.service';
import {
  NzDatePickerComponent,
  NzDatePickerModule,
} from 'ng-zorro-antd/date-picker';
import { NzTableModule, NzTableQueryParams } from 'ng-zorro-antd/table';
import { NzSliderModule } from 'ng-zorro-antd/slider';
import { DeviceDetectorService } from '../../../services/device-detector.service';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import {
  format,
  startOfMonth,
  differenceInCalendarDays,
  subDays,
} from 'date-fns';
import { UtilService } from '../../../util.service';
import { AnalisisPrecioService } from './analisis-precios.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { DrawerWrapperComponent } from '../../../components/shared/drawer-wrapper/drawer-wrapper.component';
import { SelectVariableComponent } from '../../../components/shared/select-variable/select-variable.component';

interface MonthData {
  total_monto: string;
  direccion_backus: string;
  gerencia_backus: string;
}

interface YearData {
  [key: string]: MonthData[];
}

@Component({
  selector: 'app-analisis-precios',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    NzDrawerModule,
    NzPaginationModule,
    NzAvatarModule,
    NzToolTipModule,
    NzPopoverModule,
    NzButtonModule,
    NzSliderModule,
    NzSpinModule,
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
    NzModalModule,
    NzCheckboxModule,
    DrawerWrapperComponent,
    SelectVariableComponent,
  ],
  templateUrl: './analisis-precios.component.html',
  styleUrl: './analisis-precios.component.scss',
})
export class AnalisisPreciosComponent implements OnInit, AfterViewInit {
  @ViewChild('filterEndDatePicker') filterEndDatePicker!: NzDatePickerComponent;

  //arrays para llenar los chekboxes
  dataAutogestionTable: any = [];
  showTableFooter: boolean = false;
  listTotalfooter: any = [];
  sumaTotal: any = 0;
  structureData: any = {
    data: [],
  };

  page = 1;
  limit = 15;
  total = 0;
  loadingTable = false;

  isDesktop: boolean = false;
  isMobile: boolean = false;
  isTablet: boolean = false;

  filterStartDate: Date | null = null;
  filterEndDate: Date | null = null;
  filterIntervalYear: string = '1';
  filterMenu: any = {};

  listConfigurationMenu: any[] = [];
  listFilterMenu: any[] = [];
  typeOptionMenu: string = 'analisis-precios';

  user: any = {};
  today = new Date();

  loadingDataFilterMenu: boolean = false;
  loadingDataFilterDate: boolean = false;
  loaderAutogestionTable: boolean = false;
  monthNames: { [month: string]: string } = {
    '01': 'enero',
    '02': 'febrero',
    '03': 'marzo',
    '04': 'abril',
    '05': 'mayo',
    '06': 'junio',
    '07': 'julio',
    '08': 'agosto',
    '09': 'septiembre',
    '10': 'octubre',
    '11': 'noviembre',
    '12': 'diciembre',
  };

  columnOptions : any[] = [];
  selectedColumns: any[] = [];
  loadingMessage = '';
  uploadProgressPercentage = 0;

  constructor(
    public deviceDetectorService: DeviceDetectorService,
    public analisisPrecioService: AnalisisPrecioService,
    private message: NzMessageService,
    public utilService: UtilService,
    private router: Router,
  ) {
    this.isMobile = this.deviceDetectorService.isMobile;
    this.isTablet = this.deviceDetectorService.isTablet;
    this.isDesktop = this.deviceDetectorService.isDesktop;
  }
  async ngOnInit() {}

  async ngAfterViewInit() {
    const userStorage = localStorage.getItem('user');
    this.user = userStorage ? JSON.parse(userStorage) : null;
    if (!this.user) {
      this.message.error('No existe token de sesión, por favor inicie sesión');
      this.router.navigate(['']);
    }
    this.initializeFilterDate();
    this.loadDataMenu();
    this.loadData();
  }

  initializeFilterDate(): void {
    // Calcula las fechas de inicio y fin del mes actual
    this.filterEndDate = subDays(this.today, 1);
    this.filterStartDate = startOfMonth(this.filterEndDate);
  }

  async loadData() {

    if(this.selectedColumns.length == 0){
      this.message.warning(
        'Debes almenos seleccionar un filtro para proceder a buscar informacion'
      );
    }else{
      this.loaderAutogestionTable = true;
      const startDate = format(this.filterStartDate, 'yyyy-MM-dd');
      const endDate = format(this.filterEndDate, 'yyyy-MM-dd');
      const months: string[] = [];

      let currentDate: Date = new Date(`${startDate}T00:00:00Z`);
      let currentEndDate: Date = new Date(`${endDate}T00:00:00Z`);
      currentDate.setUTCHours(0, 0, 0, 0);
      currentEndDate.setUTCHours(0, 0, 0, 0);

      // Incrementa el mes hasta que alcances la fecha de fin
      while (currentDate < currentEndDate) {
        const year: number = currentDate.getUTCFullYear();
        const month: string = ('0' + (currentDate.getUTCMonth() + 1)).slice(-2);
        months.push(`${year}${month}`);
        currentDate.setUTCMonth(currentDate.getUTCMonth() + 1);
      }

      const years = [...new Set(months.map((date: any) => date.substring(0, 4)))];
      try {
        const response: any =
          await this.analisisPrecioService.configurationDataAutogestion(
            startDate,
            endDate,
            this.selectedColumns.map((x) => x.value).join(','),
            this.page,
            this.limit,
            JSON.stringify(this.listFilterMenu)
          );

        this.loaderAutogestionTable = false;
        this.dataAutogestionTable = response.data;
        this.total = Math.ceil(response?.total);
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
          this.loaderAutogestionTable = false;
        }
      }
      const columns = Object.keys(this.dataAutogestionTable[0]);
      columns.sort(this.compare);

      // Extraer los años
      this.structureData = {
        years,
        months,
        columns,
        data: this.dataAutogestionTable,
      };
      const sumaTotal = this.dataAutogestionTable.reduce(
        (acc: any, curr: any) => acc + (parseFloat(curr[`value`]) || 0),
        0
      );
      this.listTotalfooter = this.dataAutogestionTable;
      this.sumaTotal = parseFloat(sumaTotal).toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });
      sumaTotal > 0 ? (this.showTableFooter = true) : '';

    }
  }

  compare(a: string, b: string) {
    if (!isNaN(Number(a)) && !isNaN(Number(b))) {
      // Si ambos son números, se ordenan numéricamente
      return Number(a) - Number(b);
    } else if (!isNaN(Number(a))) {
      // Si solo "a" es un número, "b" va primero
      return 1;
    } else if (!isNaN(Number(b))) {
      // Si solo "b" es un número, "a" va primero
      return -1;
    } else {
      // Si ninguno es un número, se comparan como cadenas
      return a.localeCompare(b);
    }
  }

  calculateColumnTotal(column: string): any {
    let total: number = 0;
    this.dataAutogestionTable.forEach((item: any) => {
      if (!isNaN(parseFloat(item[column]))) {
        total += parseFloat(item[column]);
      }
    });
    return total.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  }

  calculateFilaTotal(fila: any): any {
    let total: number = 0;

    Object.keys(fila).forEach((key: any) => {
      if (this.validarFormatoFecha(key)) {
        // Verificar si el valor es numérico y no es una columna de metadatos
        if (!isNaN(parseFloat(fila[key]))) {
          total += parseFloat(fila[key]);
        }
      }
    });
    return total.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  }

  validarFormatoFecha(input: any) {
    // Expresión regular para el formato YYYYMM (por ejemplo, 202401)
    var formatoFecha = /^(19|20)\d{2}(0[1-9]|1[0-2])$/;

    // Verificar si el input coincide con el formato
    return formatoFecha.test(input);
  }

  calculateOverallTotal(): any {
    let total: number = 0;
    this.dataAutogestionTable.forEach((item: any) => {
      Object.keys(item).forEach((key: any) => {
        if (this.validarFormatoFecha(key)) {
          // Verificar si el valor es numérico y no es una columna de metadatos
          if (!isNaN(parseFloat(item[key]))) {
            total += parseFloat(item[key]);
          }
        }
      });
    });
    return total.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  }

  calculateColspanYear(years: any, actualy: any) {
    const count = years.filter((year: any) => year.startsWith(actualy)).length;
    return count;
  }

  setFixed(colum: any, fila: any) {
    if (this.validarFormatoFecha(fila)) {
      if (!isNaN(parseFloat(colum))) {
        return parseFloat(colum).toLocaleString('en-US', {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        });
      }
    }
    return colum;
  }

  setMonth(colum: any) {
    if (!isNaN(parseFloat(colum))) {
      const month = colum.substr(4, 2);
      return this.monthNames[month];
    }
    const nameColum = this.columnOptions?.find((item:any) => item.value == colum)
    return nameColum.label;
  }

  async loadDataMenu() {
    this.loadingDataFilterMenu = true;
    let configurationValues;
    try {
      [ configurationValues, ] = await Promise.all([  this.analisisPrecioService.getConfigValues(), ]);
      this.listConfigurationMenu = configurationValues;
    } catch (error) {
      console.error('Error al cargar los datos:', error);
      this.loadingDataFilterMenu = false;
    }
    this.loadingDataFilterMenu = false;
  }

  pageIndexChange(page: number): void {
    this.page = page;
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
    return endValue.getTime() < this.filterStartDate.getTime() || endValue.getTime() > yesterday.getTime();
  };

  handleFilterStartDateOpenChange(open: boolean): void {
    if (!open) {
      this.filterEndDatePicker.open();
    }
  }

  applyFilters() {
    if (this.filterStartDate && this.filterEndDate) {
      this.loadData();
    }
  }

  async handleFilterMenu({ filterMenu }: any) {
    this.listFilterMenu = filterMenu;
    this.loadData();
  }

  async downloadExcel(){
    const uuid = uuidv4()
    this.message.success('Su archivo se esta descargando, podra ver su avance en el modulo de descargables.');
    const startDate = format(this.filterStartDate, 'yyyy-MM-dd');
    const endDate = format(this.filterEndDate, 'yyyy-MM-dd');
    const downloadFile = true
    const user = JSON.parse(localStorage.getItem('user'))

    /*this.sseService.serverSentEventExcelInit(uuid);
    this.sseService.triggerEvent()
    this.sseService.getServerSentEventStatus().subscribe(event => {
      if (event.data == 'start') localStorage.setItem('status_progress', JSON.stringify({status: event.data, job_id: uuid}));
    });*/

    try {
      await this.analisisPrecioService.configurationDataAutogestion(
        startDate,
        endDate,
        this.selectedColumns.map((x) => x.value).join(','),
        this.page,
        this.limit,
        JSON.stringify(this.listFilterMenu),
        downloadFile,
        user.role,
        user.usuario_id,
        uuid
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
  
  async handleSelectVariable({ selectedColumns, columnOptions }: any) {
    this.selectedColumns = [...selectedColumns];
    this.columnOptions = [...columnOptions];
    if (this.selectedColumns.length == 0) {
      this.dataAutogestionTable = []
      this.structureData.data = []
      this.structureData.columns = []
      this.structureData.years = []
      this.structureData.months = []
      this.total = 0
    }
    this.loadData();
    this.loadDataMenu();
  }

  setFixedToNumber(colum: any) {
    return parseFloat(colum).toLocaleString('en-US', {});
  }
  
}
