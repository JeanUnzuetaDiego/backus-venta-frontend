import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { RouterModule } from '@angular/router';
import { NzListModule } from 'ng-zorro-antd/list';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { FormsModule } from '@angular/forms';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { FilterSearchTableComponent } from '../../../components/shared/filter-search-table/filter-search-table.component';
import { SkusInformadosService } from './skus-informados.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzPaginationModule } from 'ng-zorro-antd/pagination';
import { SkuInformadoEditComponent } from './sku-informado-edit/sku-informado-edit.component';
import { NzModalModule, NzModalService } from 'ng-zorro-antd/modal';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzSliderModule } from 'ng-zorro-antd/slider';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzPopoverModule } from 'ng-zorro-antd/popover';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { NzDrawerModule } from 'ng-zorro-antd/drawer';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import Constantes from '../../../util/constants/constantes';
import { FilterSearchTableExcelComponent } from '../../../components/shared/filter-search-table-excel/filter-search-table-excel.component';

@Component({
  selector: 'app-sku-informado',
  standalone: true,
  imports: [CommonModule, FormsModule, NzPaginationModule, NzDrawerModule, NzAvatarModule, NzToolTipModule, NzPopoverModule, NzButtonModule, NzSliderModule, NzSpinModule, NzIconModule, NzDatePickerModule, NzTableModule, NzInputModule, NzGridModule, NzSelectModule, NzLayoutModule, NzListModule, NzMenuModule, NzTabsModule, RouterModule, NzModalModule, NzCheckboxModule,NzPaginationModule, FilterSearchTableComponent, FilterSearchTableExcelComponent],
  templateUrl: './skus-informados.component.html',
  styleUrl: './skus-informados.component.scss',
})

export class SkusInformadosComponent implements OnInit {
  spiner = false;
  listSkusInformados: any[] = [];
  filteredListSkusInformados: any[] = [];
  filterDefaultCadenaId: any[] = [{ text: Constantes.DEFAULT_SELECT.SELECIONAR_TODOS, value: Constantes.DEFAULT_SELECT.VALUE_SELECIONAR_TODOS + "-1", selected: false }];
  filterDefaultSKUBackus: any[] = [{ text: Constantes.DEFAULT_SELECT.SELECIONAR_TODOS, value: Constantes.DEFAULT_SELECT.VALUE_SELECIONAR_TODOS + "-2", selected: false }];
  filterDefaultSKUCadena: any[] = [{ text: Constantes.DEFAULT_SELECT.SELECIONAR_TODOS, value: Constantes.DEFAULT_SELECT.VALUE_SELECIONAR_TODOS + "-3", selected: false }];
  selectedFiltersCheckbox: any = {isSelectFilterSkuCadena: false, isSelectFilterSkuBackus: false, isSelectFilterCadenaID: false};
  isActiveFilterSkuCadena: boolean = false;
  isActiveFilterSkuBackus: boolean = false;
  isActiveFilterCadenaID: boolean = false;
  
  optionVacioCadenaId : any = { text: Constantes.DEFAULT_SELECT.VACIOS, value: Constantes.DEFAULT_SELECT.VALUE_SELECIONAR_VACIO + "-1", selected: false };
  optionVacioSKUBackus : any = { text: Constantes.DEFAULT_SELECT.VACIOS, value: null, selected: false };
  optionVacioSKUCadena : any = { text: Constantes.DEFAULT_SELECT.VACIOS, value: Constantes.DEFAULT_SELECT.VALUE_SELECIONAR_VACIO + "-3", selected: false };
  
  selectedFilterData: { [key: string]: string[] } = {};
  
  page = 1;
  limit = 29;
  total:any = 0;
  selectedRow: string = '';

  //Filters Table
  filterNameCadenaID: any[] = [];
  filterNameSKUCadena: any[] = [];
  filterNameSKUBackus: any[] = [];
  filterNameDescripcionCadena: any[] = [];
  filterNameDescripcionBackus: any[] = [];
  isInitialLoad: boolean = true;

  //Filter Initial Table
  filterIinitialNameCadenaID: any[] = [];
  filterIinitialNameSKUCadena: any[] = [];
  filterIinitialNameSKUBackus: any[] = [];

  //Filters Table
  selectedFilterCadenaID: any[] = [];
  selectedFilterSKUCadena: any[] = [];
  selectedFilterSKUBackus: any[] = [];
  selectedFilterDescripcionCadena: any[] = [];
  selectedFilterDescripcionBackus: any[] = [];

  //
  selectedFilterNameAll: any[] = [];

  constructor(
    private skusInformadosService: SkusInformadosService,
    private message: NzMessageService,
    private modal: NzModalService
  ) { 
    this.selectedRow = localStorage.getItem('equivalencia_sku_item');
  }

  ngOnInit(): void {
    this.loadInitialData();
    // this.loadFilterDataTable();
  }

  async loadInitialData() {
    this.loadData(true);
  }

  pageIndexChange(page: number): void {
    this.page = page;
    this.loadInitialData();
  }

  async loadData(initialLoad: boolean = false) {
    try {
      if (initialLoad) {
        this.spiner = true;
      }
      this.selectedFilterNameAll= [];
      this.selectedFilterNameAll.push({key: Constantes.SKU_TABLE.CADENA_ID, value: this.selectedFilterCadenaID});
      this.selectedFilterNameAll.push({key: Constantes.SKU_TABLE.SKU_CADENA, value: this.selectedFilterSKUCadena});
      this.selectedFilterNameAll.push({key: Constantes.SKU_TABLE.SKU_BACKUS, value: this.selectedFilterSKUBackus});
      this.selectedFilterNameAll.push({key: Constantes.SKU_TABLE.DESCRIPCION_CADENA, value: this.selectedFilterDescripcionCadena});
      this.selectedFilterNameAll.push({key: Constantes.SKU_TABLE.DESCRIPCION_BACKUS, value: this.selectedFilterDescripcionBackus});
      const result: any = await this.skusInformadosService.configurationDataSkusInformados(
        this.selectedFilterNameAll,
        this.page,
        this.limit
      );
      this.listSkusInformados = initialLoad ? result.data || [] : result.data;
      this.total = result.count
      const {
        filterCadenaId = [],
        filterSKUCadena = [],
        filterSKUBackus = [],
      } = result.filters;
      
      await this.loadFilterDataTable(filterCadenaId, filterSKUCadena, filterSKUBackus);

    } catch (error) {
      this.handleError(error);
    } finally {
      if (initialLoad) {
        this.spiner = false;
      }
    }
  }

  async loadFilterDataTable(filterCadenaId:any, filterSKUCadena:any, filterSKUBackus:any ){
    
    if(this.selectedFiltersCheckbox.isSelectFilterCadenaID && !this.selectedFiltersCheckbox.isSelectFilterSkuCadena && !this.selectedFiltersCheckbox.isSelectFilterSkuBackus){
      this.filterNameCadenaID = [...this.filterIinitialNameCadenaID];
    }else{
      let filterNameCadenaID = filterCadenaId?.sort() ?? [];
      filterNameCadenaID = filterNameCadenaID.map((item: string) => ({ text: item, value: item, selected: this.selectedFilterCadenaID.some((value: string) => value == item)}));
      this.filterNameCadenaID = [...this.filterDefaultCadenaId, ...filterNameCadenaID];
      // this.filterNameCadenaID = [...this.filterIinitialNameCadenaID];
    }
    if(this.selectedFiltersCheckbox.isSelectFilterSkuCadena && !this.selectedFiltersCheckbox.isSelectFilterCadenaID && !this.selectedFiltersCheckbox.isSelectFilterSkuBackus){
      this.filterNameSKUCadena = [...this.filterIinitialNameSKUCadena];
    }else{
      let filterNameSKUCadena = filterSKUCadena?.sort() ?? [];
      filterNameSKUCadena = filterNameSKUCadena.map((item: string) => ({ text: item, value: item, selected: this.selectedFilterSKUCadena.some((value: string) => value == item)}));
      this.filterNameSKUCadena = [...this.filterDefaultSKUCadena, ...filterNameSKUCadena];
      // this.filterNameSKUCadena = [...this.filterIinitialNameSKUCadena];
    }

    if(this.selectedFiltersCheckbox.isSelectFilterSkuBackus && !this.selectedFiltersCheckbox.isSelectFilterCadenaID && !this.selectedFiltersCheckbox.isSelectFilterSkuCadena){
      this.filterNameSKUBackus = [...this.filterIinitialNameSKUBackus];
    }else{
      let filterNameSKUBackus= filterSKUBackus?.sort() ?? [];
      filterNameSKUBackus = filterNameSKUBackus.map((item: string) => ({ text: item, value: item, selected: this.selectedFilterSKUBackus.some((value: string) => value == item)})).map((item: any) => item.value == null ? this.optionVacioSKUBackus : item);
      filterNameSKUBackus.sort(this.compareVacioBackus.bind(this));
      this.filterNameSKUBackus = [...this.filterDefaultSKUBackus, ...filterNameSKUBackus];
      // this.filterNameSKUBackus = [...this.filterIinitialNameSKUBackus];
    }

    if(this.isInitialLoad){
      this.filterIinitialNameCadenaID = [...this.filterNameCadenaID];
      this.filterIinitialNameSKUCadena = [...this.filterNameSKUCadena];
      this.filterIinitialNameSKUBackus = [...this.filterNameSKUBackus];
      this.isInitialLoad = false;
    }
    
     
  }

  handleError(error: any) {
    this.message.error('Ocurrió un error al cargar los datos.');
    console.error('Error: ', error);
    this.spiner = false;
  }

  editSKU(data: any, event: MouseEvent): void {
    event.stopPropagation();
    const dialogModal = this.modal.create({
      nzTitle: 'Editar Equivalencia SKU',
      nzContent: SkuInformadoEditComponent,
      nzFooter: null,
      nzWidth: '80%',
      nzStyle: { 
        'border-radius': '10px', /* Opcional: para redondear los bordes del modal */
      },
      nzWrapClassName: 'custom-modal', 
    });
    // Obtiene la instancia del componente y pasa el userId
    const instance = dialogModal.getContentComponent();
    instance.cadena_id = data.cadena_id;
    instance.sku_cadena = data.sku_cadena;
    dialogModal.afterClose.subscribe((result) => {
      if (result) {
        this.message.success('SKU actualizado correctamente');
        this.loadInitialData();
      }
    });
  }

  async handleFilterCadenaID({ selectedFilterItems, filterItems, isRemoveFilter }: any) {
    this.isActiveFilterCadenaID = isRemoveFilter ? false : true;
    this.selectedFiltersCheckbox.isSelectFilterCadenaID = isRemoveFilter ? false : true;
    this.selectedFiltersCheckbox.isSelectFilterSkuCadena = this.isActiveFilterSkuCadena;
    this.selectedFiltersCheckbox.isSelectFilterSkuBackus = this.isActiveFilterSkuBackus;
    this.filterNameCadenaID = filterItems.map((item: any) => ({
      text: item.text,
      value: item.value,
      selected: item.selected,
    }));
    this.selectedFilterCadenaID = [...selectedFilterItems];
    this.filterIinitialNameCadenaID = this.filterIinitialNameCadenaID.map((item: any) => ({ ...item, selected: false}));
    this.filterIinitialNameCadenaID = this.filterIinitialNameCadenaID.map((item: any) => ({ ...item, selected: this.selectedFilterCadenaID.some((value: string) => value == item.value)}));
    this.loadInitialData();
  }

  async handleFilterSKUCadena({ selectedFilterItems, filterItems, isRemoveFilter }: any) {
    this.isActiveFilterSkuCadena = isRemoveFilter ? false : true;
    this.selectedFiltersCheckbox.isSelectFilterCadenaID =  this.isActiveFilterCadenaID;
    this.selectedFiltersCheckbox.isSelectFilterSkuCadena = isRemoveFilter ? false : true;
    this.selectedFiltersCheckbox.isSelectFilterSkuBackus = this.isActiveFilterSkuBackus;
    this.filterNameSKUCadena = filterItems.map((item: any) => ({
      text: item.text,
      value: item.value,
      selected: item.selected,
    }));
    this.selectedFilterSKUCadena = [...selectedFilterItems];
    this.filterIinitialNameSKUCadena = this.filterIinitialNameSKUCadena.map((item: any) => ({ ...item, selected: false}));
    this.filterIinitialNameSKUCadena = this.filterIinitialNameSKUCadena.map((item: any) => ({ ...item, selected: this.selectedFilterSKUCadena.some((value: string) => value == item.value)}));
    console.log('filterIinitialNameSKUCadena', this.filterIinitialNameSKUCadena);
    this.loadInitialData();
  }

  async handleFilterSKUBackus({ selectedFilterItems, filterItems, isRemoveFilter }: any) {
    this.isActiveFilterSkuBackus = isRemoveFilter ? false : true;
    this.selectedFiltersCheckbox.isSelectFilterCadenaID = this.isActiveFilterCadenaID;
    this.selectedFiltersCheckbox.isSelectFilterSkuCadena = this.isActiveFilterSkuCadena;
    this.selectedFiltersCheckbox.isSelectFilterSkuBackus = isRemoveFilter ? false : true;
    this.filterNameSKUBackus = filterItems.map((item: any) => ({
      text: item.text,
      value: item.value,
      selected: item.selected,
    }));
    this.selectedFilterSKUBackus = [...selectedFilterItems];
    this.filterIinitialNameSKUBackus = this.filterIinitialNameSKUBackus.map((item: any) => ({ ...item, selected: false}));
    this.filterIinitialNameSKUBackus = this.filterIinitialNameSKUBackus.map((item: any) => ({ ...item, selected: this.selectedFilterSKUBackus.some((value: string) => value == item.value)}));
    this.loadInitialData();
  }

  async handleFilterDescripcionCadena({ selectedFilterItems, filterItems }: any) {
    this.filterNameDescripcionCadena = filterItems.map((item: any) => ({
      text: item.text,
      value: item.value,
      selected: item.selected,
    }));
    this.selectedFilterDescripcionCadena = [...selectedFilterItems];
    this.loadInitialData();
  }

  async handleFilterDescripcionBackus({ selectedFilterItems, filterItems }: any) {
    this.filterNameDescripcionBackus = filterItems.map((item: any) => ({
      text: item.text,
      value: item.value,
      selected: item.selected,
    }));
    this.selectedFilterDescripcionBackus = [...selectedFilterItems];
    this.loadInitialData();
  }

  setFixedToNumber(colum: any) {
    return parseFloat(colum).toLocaleString('en-US', {});
  }

  // Define la función de comparación
  compareVacioBackus(a: any, b: any) {
    if (a.value === this.optionVacioSKUBackus.value) {
      return -1;
    } else if (b.value === this.optionVacioSKUBackus.value) {
      return 1;
    }
    return 0;
  }

  selectRow(item: any) {
    const selectedRow = JSON.stringify(item);
    if (this.selectedRow === selectedRow) {
      localStorage.setItem('equivalencia_sku_item', '');
      this.selectedRow = '';
    } else {
      this.selectedRow = selectedRow;
      localStorage.setItem('equivalencia_sku_item', selectedRow);
    }
  }

  toJSONString(item: any): string {
    return JSON.stringify(item);
  }
}