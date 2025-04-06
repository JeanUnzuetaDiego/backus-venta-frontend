import { Component, ViewChild } from '@angular/core';
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
import { NzDrawerModule } from 'ng-zorro-antd/drawer';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzDatePickerComponent, NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzSliderModule } from 'ng-zorro-antd/slider';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { format, startOfMonth, differenceInCalendarDays, subDays } from 'date-fns';
import { UtilService } from '../../../util.service'
import { AutoGestionService } from './autogestion.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzPaginationModule } from 'ng-zorro-antd/pagination';
import { DrawerWrapperComponent } from '../../../components/shared/drawer-wrapper/drawer-wrapper.component';
import { v4 as uuidv4 } from "uuid";
import { SelectVariableComponent } from '../../../components/shared/select-variable/select-variable.component';

@Component({
  selector: 'app-autogestion',
  standalone: true,
  imports: [CommonModule, FormsModule, NzDrawerModule, NzAvatarModule, NzToolTipModule, NzPopoverModule, NzButtonModule, NzSliderModule, NzSpinModule, NzIconModule, NzDatePickerModule, NzTableModule, NzInputModule, NzGridModule, NzSelectModule,  NzLayoutModule, NzListModule, NzMenuModule, NzTabsModule, RouterModule, NzModalModule,NzPaginationModule, NzCheckboxModule, DrawerWrapperComponent, SelectVariableComponent],
  templateUrl: './autogestion.component.html',
  styleUrl: './autogestion.component.scss'
})
export class AutogestionComponent {
  @ViewChild('filterEndDatePicker') filterEndDatePicker!: NzDatePickerComponent;

  dataAutogestionTable: any = [];
  filterStartDate: Date | null = null;
  filterEndDate: Date | null = null;
  filterIntervalYear: string = '1';
  filterMenu: any = {};
  user: any = {};
  today = new Date();

  listConfigurationMenu: any[] = [];
  listFilterMenu: any[] = [];
  typeOptionMenu: string = 'autogestion';

  loadingDataFilterMenu: boolean = false;
  loaderAutogestionTable: boolean = false;
  loadingDataFilterDate: boolean = false;
  loaderTopDescriptionNorTable: boolean = false;
  page = 1;
  limit = 15;
  total:any = 0;
  checkOptionsOne: any[] = [];

  selectedColumns: any[] = [];

  constructor(
    // public deviceDetectorService: DeviceDetectorService,
    public autogestionService: AutoGestionService,
    private message: NzMessageService,
    public utilService: UtilService,
    private router: Router,
  ) {
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
    this.loadData();
  }

  pageIndexChange(page: number): void {
    this.page = page;
    this.loadData();
  }

  async loadData() {
    if(this.selectedColumns.length == 0){
      this.message.warning(
        'Debes al menos seleccionar un filtro para proceder a buscar informacion'
      );
    }else{
      const startDate = format(this.filterStartDate, 'yyyy-MM-dd')
      const endDate = format(this.filterEndDate, 'yyyy-MM-dd')
      this.loaderAutogestionTable = true;

      let  configurationDataAutogestion: {total:any,ventas:[]} = {
        total: undefined,
        ventas: []
      };
      try {
        const [result] = await Promise.all([
          this.autogestionService.configurationDataAutogestion(startDate, endDate, this.selectedColumns.map((x) => x.value).join(','), this.page, this.limit,JSON.stringify(this.listFilterMenu)),
        ]);
        if (result && typeof result === 'object' && 'total' in result && 'ventas' in result) {
          this.dataAutogestionTable = result.ventas;
          this.total = result.total;
        } else {
          throw new Error('Invalid data structure');
        }
        this.loaderAutogestionTable = false;
        this.loadingDataFilterDate = false;

      } catch (error) {
        this.message.error('Error al cargar los datos');
        console.log('Error al cargar los datos:', error);
        this.loaderAutogestionTable = false;
        this.loadingDataFilterDate = false;
      }
    }
    
  }

  calculateColumnTotal(colum:any){
    let total = 0
    this.dataAutogestionTable.forEach((element: any) => {
      if (element[`${colum}`]) {
        const value = parseFloat(element[`${colum}`]);
        total += value;
      }
    })
    return total.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  }

  calculateColumnTotalToNumber(colum:any){
    let total = 0
    this.dataAutogestionTable.forEach((element: any) => {
      if (element[`${colum}`]) {
        const value = parseFloat(element[`${colum}`]);
        total += value;
      }
    })
    return total.toLocaleString('en-US', {});
  }

  calculateColumnTotalHL(colum:any){
    let total = 0
    this.dataAutogestionTable.forEach((element: any) => {
      if (element[`${colum}`]) {
        const value = parseFloat(element[`${colum}`]);
        total += value;
      }
    })
    return total.toLocaleString('en-US', {
      minimumFractionDigits: 6,
      maximumFractionDigits: 6,
    });
  }

  setFixed(colum: any) {
    return parseFloat(colum).toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  }

  setFixedHL(colum: any) {
    return parseFloat(colum).toLocaleString('en-US', {
      minimumFractionDigits: 6,
      maximumFractionDigits: 6,
    });
  }

  setFixedToNumber(colum: any) {
    return parseFloat(colum).toLocaleString('en-US', {});
  }

  initializeFilterDate(): void {
    // Calcula las fechas de inicio y fin del mes actual
    this.filterEndDate = subDays(this.today, 1);
    this.filterStartDate = startOfMonth(this.filterEndDate);
  }

  async loadDataMenu() {
    
    this.loaderTopDescriptionNorTable = true;
    this.loadingDataFilterMenu = true;
    let configurationValues;
    try {
      [
        configurationValues,
      ] = await Promise.all([
        this.autogestionService.getConfigValues(),
      ]);
      this.listConfigurationMenu = configurationValues;
      } catch (error) {
        console.error('Error al cargar los datos:', error);
        this.loadingDataFilterMenu = false;
      }
      this.loadingDataFilterMenu = false;

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
    if(!open) {
      this.filterEndDatePicker.open();
    }
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
    const uuid = uuidv4()
    const user = JSON.parse(localStorage.getItem('user'))
    try {
      const response: any =
        await this.autogestionService.configurationDataAutogestion(
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
  
  async handleFilterMenu({ filterMenu }: any) {
    this.listFilterMenu = filterMenu;
    this.loadData();
  }

  async handleSelectVariable({ selectedColumns, columnOptions }: any) {
    this.selectedColumns = [...selectedColumns];
    this.checkOptionsOne = [...columnOptions];
    if(this.selectedColumns.length == 0){
      this.dataAutogestionTable = []
      this.total = 0
    }
    this.loadData();
    this.loadDataMenu();
  }

}