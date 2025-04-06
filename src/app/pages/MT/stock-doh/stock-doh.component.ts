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
import { NzPaginationModule } from 'ng-zorro-antd/pagination';
import { FormsModule } from '@angular/forms';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { NzDrawerModule } from 'ng-zorro-antd/drawer';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzDatePickerComponent, NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzSliderModule } from 'ng-zorro-antd/slider';
import { DeviceDetectorService } from '../../../services/device-detector.service';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { format, addDays, subDays } from 'date-fns';
import { UtilService } from '../../../util.service'
import { NzMessageService } from 'ng-zorro-antd/message';
import { StockDohService } from './stock-doh.service';
import { DrawerWrapperComponent } from '../../../components/shared/drawer-wrapper/drawer-wrapper.component';
import { SelectVariableComponent } from '../../../components/shared/select-variable/select-variable.component';
import { v4 as uuidv4 } from "uuid";

@Component({
  selector: 'app-stock-doh',
  standalone: true,
  imports: [CommonModule, FormsModule, NzDrawerModule, NzPaginationModule, NzAvatarModule, NzToolTipModule, NzPopoverModule, NzButtonModule, NzSliderModule, NzSpinModule, NzIconModule, NzDatePickerModule, NzTableModule, NzInputModule, NzGridModule, NzSelectModule,  NzLayoutModule, NzListModule, NzMenuModule, NzTabsModule, RouterModule, NzModalModule, NzCheckboxModule, DrawerWrapperComponent, SelectVariableComponent],
  templateUrl: './stock-doh.component.html',
  styleUrl: './stock-doh.component.scss'
})
export class StockDohComponent implements OnInit, AfterViewInit {
  @ViewChild('filterEndDatePicker') filterEndDatePicker!: NzDatePickerComponent;

  value: number;
  dEstimado: number = 7;
  dataAutogestionTable: any = [];
  page = 1;
  limit = 15;
  total : any = 0;
  isDesktop: boolean = false;
  isMobile: boolean = false;
  isTablet: boolean = false;
  filterStartDate: Date | null = null;
  filterEndDate: Date | null = null;
  filterMenu: any = {};
  user: any = {};
  today = new Date();
  listConfigurationMenu: any[] = [];
  listFilterMenu: any[] = [];
  typeOptionMenu: string = 'stock-doh';
  loadingDataFilterMenu: boolean = false;
  loadingDataFilterDate: boolean = false;
  loaderAutogestionTable: boolean = false;
  columnOptions : any[] = [];
  selectedColumns: any[] = [];

  constructor(
    public deviceDetectorService: DeviceDetectorService,
    public stockDoHService: StockDohService,
    private message: NzMessageService,
    public utilService: UtilService,
    private router: Router,
  ) {
    this.isMobile = this.deviceDetectorService.isMobile;
    this.isTablet = this.deviceDetectorService.isTablet;
    this.isDesktop = this.deviceDetectorService.isDesktop;
  }
  async ngOnInit() { 
    
  }

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
    this.filterStartDate = subDays(this.today, 1);
  }

  async loadData() {
    if(this.selectedColumns.length == 0){
      this.message.warning(
        'Debes al menos seleccionar un filtro para proceder a buscar informacion'
      );
      this.loaderAutogestionTable = false;
      this.loadingDataFilterDate = false;
      this.dataAutogestionTable = [];
      this.total = 0;
    }else{
      const startDate = format(this.filterStartDate, 'yyyy-MM-dd')
      const endDate =  format(addDays(this.filterStartDate,this.dEstimado),'yyyy-MM-dd' )
  
      this.loaderAutogestionTable = true;
      try {
        this.dataAutogestionTable = [];
        const [response] = await Promise.all([
          this.stockDoHService.configurationDataStockDoH(startDate, endDate, this.selectedColumns.map((x) => x.value).join(','), (this.dEstimado-1), this.page, this.limit, JSON.stringify(this.listFilterMenu)), 
        ]);
        
        if (response && typeof response === 'object' && 'total' in response && 'ventas' in response) {
          this.dataAutogestionTable = response.ventas;
          this.total = response.total;
        } else {
          throw new Error('Invalid data structure');
        }
        this.loaderAutogestionTable = false;
        this.loadingDataFilterDate = false;

        // this.total = response.total;
  
        // this.loaderAutogestionTable = false;
      } catch (error:any) {
        this.message.error('Error al cargar los datos');
        console.log('Error al cargar los datos:', error);
        this.loaderAutogestionTable = false;
        this.loadingDataFilterDate = false;
      }
  
    }
  }

  async loadDataMenu() {
    this.loadingDataFilterMenu = true;
    let configurationValues, configurationDataCdMas;
    try {
      [
        configurationValues,
      ] = await Promise.all([
        this.stockDoHService.getConfigValues(),
      ]);
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
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    return startValue.getTime() > yesterday.getTime();
  }; 

  handleFilterStartDateOpenChange(open: boolean): void {
    if (!open) {
      this.filterEndDatePicker.open();
    }
  }

  calculateColumnTotal(colum:any){
    let total = 0
    this.dataAutogestionTable.forEach((value:any) => {
      total += parseFloat(value[`${colum}`])
    })
    return total.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  }

  calculateColumnTotalToNumber(colum:any){
    let total = 0
    this.dataAutogestionTable.forEach((value:any) => {
      total += parseFloat(value[`${colum}`])
    })
    return total.toLocaleString('en-US', {});
  }

  calculateColumnTotalHL(colum:any){
    let total = 0
    this.dataAutogestionTable.forEach((value:any) => {
      total += parseFloat(value[`${colum}`])
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

  async handleFilterMenu({ filterMenu }: any) {
    this.listFilterMenu = filterMenu;
    this.loadData();
  }

  applyFilters() {
    // this.loadingDataFilterDate = true;
    if (this.filterStartDate) {
      this.loadData();
    }
  }

  roundToNearestSeven(value: number) {
    value = Number(value);
    if (value <= 10) {
      this.dEstimado = 7;
    } else {
      this.dEstimado = Math.round(value / 7) * 7;
    }
  }

  changeSlider(){
    this.loadData();
  }

  async handleSelectVariable({ selectedColumns, columnOptions }: any) {
    this.selectedColumns = [...selectedColumns];
    this.columnOptions = [...columnOptions];
    this.loadData();
    this.loadDataMenu();
  }

  async downloadExcel(){
    this.message.success('Su archivo se esta descargando, podra ver su avance en el modulo de descargables.');
    const startDate = format(this.filterStartDate, 'yyyy-MM-dd');
    const endDate = startDate;
    const downloadFile = true
    const uuid = uuidv4()
    const user = JSON.parse(localStorage.getItem('user'))
    try {
      const response: any =
        await this.stockDoHService.configurationDataStockDoH(
          startDate,
          endDate,
          this.selectedColumns.map((x) => x.value).join(','),
          (this.dEstimado-1),
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

}
