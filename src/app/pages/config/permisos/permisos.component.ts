import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterOutlet, RouterModule } from '@angular/router';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzListModule } from 'ng-zorro-antd/list';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzSliderModule } from 'ng-zorro-antd/slider';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { NzPopoverModule } from 'ng-zorro-antd/popover';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { FormsModule } from '@angular/forms';
import { PermisosService } from './permisos.service';


interface ItemData {
  id: number;
  rol: string;
  mt_portada: boolean;
  mt_ka_summary: boolean;
  mt_analisis_precios: boolean;
  mt_tabla_autogestion: boolean;
  mt_venta_diario: boolean;
  mt_stock_doh: boolean;
  mt_same_store_sales: boolean;
  eq_portada: boolean;
  createdAt:string;
  updatedAt:string;
  eq_skus_informados: boolean;
  eq_skus_no_informados: boolean;
  eq_skus_vacios: boolean;
  eq_tiendas_informadas: boolean;
  eq_tiendas_no_informadas: boolean;
  eq_tiendas_en_blanco: boolean;
  config: boolean;
}

@Component({
  selector: 'app-permisos',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    NzSliderModule,
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
    NzDividerModule,
    NzPopoverModule,
    NzSpinModule,
    FormsModule
  ],
  templateUrl: './permisos.component.html',
  styleUrl: './permisos.component.scss'
})
export class PermisosComponent implements OnInit {
  itemSelected = 0
  spin = false
  dataSet: ItemData[] = []

  editCache: { [key: string]: { edit: boolean; data: ItemData } } = {};
  listOfData: ItemData[] = [];

  constructor(private permisosService:PermisosService){

  }
  startEdit(id: number): void {
    this.itemSelected = id
    this.editCache[id].edit = true;
  }

  cancelEdit(id: number): void {
    const index = this.listOfData.findIndex(item => item.id === id);
    this.editCache[id] = {
      data: { ...this.listOfData[index] },
      edit: false
    };
  }

  async saveEdit(id: number): Promise<void> {
    this.spin = true
    const index = this.listOfData.findIndex(item => item.id === id);
    Object.assign(this.listOfData[index], this.editCache[id].data);
    await this.permisosService.updatePermisos(this.listOfData[index])
    this.editCache[id].edit = false;
    this.spin = false
  }

  updateEditCache(): void {
    this.listOfData.forEach(item => {
      this.editCache[item.id] = {
        edit: false,
        data: { ...item }
      };
    });
  }

  async ngOnInit(): Promise<void> {
    try {
      const response = await this.permisosService.getPermisos();
      this.listOfData = response.permisos;
      this.listOfData.sort((a, b) => a.id - b.id);
      await this.updateEditCache();
    } catch (error) {
      console.error('Error al obtener los permisos:', error);
    }
  }
}
