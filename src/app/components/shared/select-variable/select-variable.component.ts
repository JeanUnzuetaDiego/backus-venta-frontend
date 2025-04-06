import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzListModule } from 'ng-zorro-antd/list';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzIconModule } from 'ng-zorro-antd/icon';


@Component({
  selector: 'app-select-variable',
  standalone: true,
  imports: [CommonModule, FormsModule, NzButtonModule, NzSpinModule, NzInputModule, NzGridModule, NzSelectModule, NzListModule, NzCheckboxModule, NzIconModule],
  templateUrl: './select-variable.component.html',
  styleUrl: './select-variable.component.scss'
})
export class SelectVariableComponent {

  columnOptions = [
    // { label: 'Mes (pendite)', value: '', checked: false, show:false },
    { label: 'Cadena', value: 'poc_cadena_backus', checked: false, show:false },
    { label: 'Formato', value: 'poc_subcadena_backus', checked: false, show:false },
    { label: 'Direccion', value: 'poc_direccion_backus', checked: false, show:false },
    { label: 'Gerencia', value: 'poc_gerencia_backus', checked: false, show:false },
    // { label: 'Zone Nielsen', value: 'zona_nielsen', checked: false, show:false },
    // { label: 'Sub Canal', value: 'sub_canal_backus', checked: false, show:false},
    // { label: 'Cluster', value: 'cluster_backus', checked: false, show:false },
    // { label: 'Supervisor', value: 'supervisor_backus', checked: false, show:false },
    // { label: 'Cobertura Tienda', value: 'sku_cobertura_backus', checked: false, show:false },
    { label: 'Código Tienda B2B', value: 'poc_cadena', checked: false, show:false},
    { label: 'Código Tienda Backus', value: 'poc_backus', checked: false, show:false},
    { label: 'Nombre Tienda B2B', value: 'poc_nombre_cadena', checked: false, show:false},
    { label: 'Nombre Tienda Backus', value: 'poc_nombre_backus', checked: false, show:false},
    { label: 'Código SKU B2B', value: 'sku_cadena', checked: false, show:false},
    { label: 'Código SKU Backus', value: 'sku_backus', checked: false, show:false},
    { label: 'Descripcion SKU B2B', value: 'sku_descripcion_cadena', checked: false, show:false},
    { label: 'Descripcion SKU Backus', value: 'sku_descripcion_backus', checked: false, show:false},
    { label: 'Descripcion Norma', value: 'sku_descripcion_norma_backus', checked: false, show:false },
    { label: 'Categoria', value: 'sku_categoria_backus', checked: false, show:false },
    { label: 'Sub Categoria', value: 'sku_subcategoria_backus', checked: false, show:false },
    { label: 'KPI SKU', value: 'sku_kpi_backus', checked: false, show:false },
    { label: 'Marca', value: 'sku_marca_backus', checked: false, show:false },
    { label: 'Tipo', value: 'sku_tipo_backus', checked: false, show:false },
    { label: 'Capacidad Norma', value: 'sku_capacidad_norma_backus', checked: false, show:false },
    { label: 'Formato Norma', value: 'sku_formato_norma_backus', checked: false, show:false },
    { label: 'Formato de Venta', value: 'sku_formato_venta_backus', checked: false, show:false},
    // { label: 'Tipo de Envase', value: 'tipo_de_envase', checked: false, show:false },
    { label: 'Cobertura SKU', value: 'sku_cobertura_backus', checked: false, show:false},
    { label: 'Serve', value: 'sku_serve_backus', checked: false, show:false }
    // { label: 'CD MASS', value: 'cd_mass', checked: false, show:false }
  ];
  selectedColumns: any[] = [];

  @Output() changeSelectColumns = new EventEmitter<any>();
  
  constructor() { }

  ngOnInit() {
  }


  deselectAll() {
    // Des-selecciona todas las columnas
    this.selectedColumns = [];
    // Actualiza el modelo columnOptions para des-seleccionar todos los checkboxes
    this.columnOptions = this.columnOptions.map((option) => {
      return {
        ...option,
        checked: false,
      };
    });
    this.changeSelectColumns.emit({ selectedColumns : this.selectedColumns, columnOptions: this.columnOptions});
  }

  updateSingleCheckedVariable(): void {
    this.columnOptions.forEach((option) =>
      option.checked == true ? (option.show = true) : (option.show = false)
    );
    this.selectedColumns = this.columnOptions.filter(
      (option) => option.checked
    );
    this.changeSelectColumns.emit({ selectedColumns : this.selectedColumns, columnOptions: this.columnOptions});
  }

}
