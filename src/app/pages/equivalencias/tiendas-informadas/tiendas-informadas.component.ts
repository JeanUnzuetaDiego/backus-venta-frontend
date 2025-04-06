import { Component, OnInit, AfterViewInit, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { RouterModule } from '@angular/router';
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
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzSliderModule } from 'ng-zorro-antd/slider';
import { NzModalModule, NzModalService } from 'ng-zorro-antd/modal';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { FilterSearchTableComponent } from '../../../components/shared/filter-search-table/filter-search-table.component';
import { NzMessageService } from 'ng-zorro-antd/message';
import { TiendasInformadasService } from './tiendas-informadas.service';
import { FilterSearchTableExcelComponent } from '../../../components/shared/filter-search-table-excel/filter-search-table-excel.component';
import { NzPaginationModule } from 'ng-zorro-antd/pagination';
import { TiendaInformadaEditComponent } from './tienda-informada-edit/tienda-informada-edit.component';
import Constantes from '../../../util/constants/constantes';

@Component({
  selector: 'app-tiendas-informadas',
  standalone: true,
  imports: [CommonModule, FormsModule, NzPaginationModule, NzDrawerModule, NzAvatarModule, NzToolTipModule, NzPopoverModule, NzButtonModule, NzSliderModule, NzSpinModule, NzIconModule, NzDatePickerModule, NzTableModule, NzInputModule, NzGridModule, NzSelectModule, NzLayoutModule, NzListModule, NzMenuModule, NzTabsModule, RouterModule, NzModalModule, NzCheckboxModule,NzPaginationModule, FilterSearchTableExcelComponent],
  templateUrl: './tiendas-informadas.component.html',
  styleUrl: './tiendas-informadas.component.scss',
})

export class TiendasInformadasComponent implements OnInit {
  spiner = false;

  listTiendasInformadas: any[] = [];

  filterDefaultCadenaId: any[] = [{ text: Constantes.DEFAULT_SELECT.SELECIONAR_TODOS, value: Constantes.DEFAULT_SELECT.VALUE_SELECIONAR_TODOS + "-1", selected: false }];
  filterDefaultPOCBackus: any[] = [{ text: Constantes.DEFAULT_SELECT.SELECIONAR_TODOS, value: Constantes.DEFAULT_SELECT.VALUE_SELECIONAR_TODOS + "-2", selected: false }];
  filterDefaultPOCCadena: any[] = [{ text: Constantes.DEFAULT_SELECT.SELECIONAR_TODOS, value: Constantes.DEFAULT_SELECT.VALUE_SELECIONAR_TODOS + "-3", selected: false }];

  optionVacioCadenaId : any = { text: Constantes.DEFAULT_SELECT.VACIOS, value: Constantes.DEFAULT_SELECT.VALUE_SELECIONAR_VACIO + "-1", selected: false };
  optionVacioPOCBackus : any = { text: Constantes.DEFAULT_SELECT.VACIOS, value: null, selected: false };
  optionVacioPOCCadena : any = { text: Constantes.DEFAULT_SELECT.VACIOS, value: Constantes.DEFAULT_SELECT.VALUE_SELECIONAR_VACIO + "-3", selected: false };

  filterNameCadenaId: any[] = [];
  filterNamePocCadena: any[] = [];
  filterNamePocBackus: any[] = [];

  selectedFilterNameAll: any[] = [];

  selectedFilterCadenaId: any[] = [];
  selectedFilterPocCadena: any[] = [];
  selectedFilterPocBackus: any[] = [];

  //Filter Initial Table
  filterIinitialNameCadenaID: any[] = [];
  filterIinitialNamePOCCadena: any[] = [];
  filterIinitialNamePOCBackus: any[] = [];

  page = 1;
  limit = 30;
  total:any = 0;

  selectedRow: string = '';

  constructor(
    private tiendasInformadasService: TiendasInformadasService,
    private message: NzMessageService,
    private modal: NzModalService
  ) { 
    this.selectedRow = localStorage.getItem('equivalencia_tiendas_item');
  }

  ngOnInit(): void {
    this.loadData();
  }

  async loadData() {
    this.spiner = true;
    try {
      this.selectedFilterNameAll= [];
      this.selectedFilterNameAll.push({key: Constantes.POC_TABLE.CADENA_ID, value: this.selectedFilterCadenaId});
      this.selectedFilterNameAll.push({key: Constantes.POC_TABLE.POC_CADENA, value: this.selectedFilterPocCadena});
      this.selectedFilterNameAll.push({key: Constantes.POC_TABLE.POC_BACKUS, value: this.selectedFilterPocBackus});

      const result: any =
        await this.tiendasInformadasService.configurationDataTiendasInformadas(
          this.selectedFilterNameAll,
          this.page,
          this.limit
        );
      this.listTiendasInformadas = result?.data;
      this.total = result.count;
      if (result.filters) {
        const {
          filterCadenaId = [],
          filterPocCadena = [],
          filterPocBackus = [],
        } = result.filters;
        let filterNameCadenaId = filterCadenaId?.sort() ?? [];
        filterNameCadenaId = filterNameCadenaId.map((item: string) => ({ text: item, value: item, selected: this.selectedFilterCadenaId.some((value: string) => value == item)}));
        this.filterIinitialNameCadenaID = [...this.filterDefaultCadenaId, ...filterNameCadenaId];
        this.filterNameCadenaId = [...this.filterIinitialNameCadenaID];

        let filterNamePOCCadena = filterPocCadena?.sort() ?? [];
        filterNamePOCCadena = filterNamePOCCadena.map((item: string) => ({ text: item, value: item, selected: this.selectedFilterPocCadena.some((value: string) => value == item)}));
        this.filterIinitialNamePOCCadena = [...this.filterDefaultPOCCadena, ...filterNamePOCCadena];
        this.filterNamePocCadena = [...this.filterIinitialNamePOCCadena];

        let filterNamePOCBackus= filterPocBackus?.sort() ?? [];
        filterNamePOCBackus = filterNamePOCBackus.map((item: string) => ({ text: item, value: item, selected: this.selectedFilterPocBackus.some((value: string) => value == item)})).map((item: any) => item.value == null ? this.optionVacioPOCBackus : item);
        filterNamePOCBackus.sort(this.compareVacioBackus.bind(this));
        this.filterIinitialNamePOCBackus = [...this.filterDefaultPOCBackus, ...filterNamePOCBackus];
        this.filterNamePocBackus = [...this.filterIinitialNamePOCBackus];
       
      }
      this.spiner = false;
    } catch (error) {
      this.message.error('Error al cargar datos de Tiendas Informadas');
      console.log('Error: ', error);
      this.spiner = false;
    }
  }

  pageIndexChange(page: number): void {
    this.page = page;
    this.loadData();
  }

  editPOC(data: any, event: MouseEvent): void {
    event.stopPropagation();
    const dialogModal = this.modal.create({
      nzTitle: '<div class="blur-header">Editar Equivalencia POC</div>',
      nzContent: TiendaInformadaEditComponent,
      nzFooter: null,
      nzWidth: '50%',
      nzStyle: { 
        'border-radius': '10px', /* Opcional: para redondear los bordes del modal */
      },
      nzWrapClassName: 'custom-modal', 
    });
    // Obtiene la instancia del componente y pasa el userId
    const instance = dialogModal.getContentComponent();
    instance.cadena_id = data.cadena_id;
    instance.poc_cadena = data.poc_cadena;
    dialogModal.afterClose.subscribe((result) => {
      if (result) {
        this.message.success('poc actualizado correctamente');
        this.loadData();
      }
    });
  }


  async handleFilterCadenaId({ selectedFilterItems, filterItems }: any) {
    this.filterNameCadenaId = filterItems.map((item: any) => ({
      text: item.text,
      value: item.value,
      selected: item.selected,
    }));
    this.selectedFilterCadenaId = [...selectedFilterItems];
    this.loadData();
  }

  async handleFilterPocCadena({ selectedFilterItems, filterItems }: any) {
    this.filterNamePocCadena = filterItems.map((item: any) => ({
      text: item.text,
      value: item.value,
      selected: item.selected,
    }));
    this.selectedFilterPocCadena = [...selectedFilterItems];
    this.loadData();
  }

  async handleFilterPocBackus({ selectedFilterItems, filterItems }: any) {
    this.filterNamePocBackus = filterItems.map((item: any) => ({
      text: item.text,
      value: item.value,
      selected: item.selected,
    }));
    this.selectedFilterPocBackus = [...selectedFilterItems];
    this.loadData();
  }

  selectRow(item: any) {
    const selectedRow = JSON.stringify(item);
    if (this.selectedRow === selectedRow) {
      localStorage.setItem('equivalencia_tiendas_item', '');
      this.selectedRow = '';
    } else {
      this.selectedRow = selectedRow;
      localStorage.setItem('equivalencia_tiendas_item', selectedRow);
    }
  }
  
  setFixedToNumber(colum: any) {
    return parseFloat(colum).toLocaleString('en-US', {});
  }

  // Define la función de comparación
  compareVacioBackus(a: any, b: any) {
    if (a.value === this.optionVacioPOCBackus.value) {
      return -1;
    } else if (b.value === this.optionVacioPOCBackus.value) {
      return 1;
    }
    return 0;
  }

  toJSONString(item: any): string {
    return JSON.stringify(item);
  }
}