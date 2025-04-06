import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzDropdownMenuComponent } from 'ng-zorro-antd/dropdown';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputGroupComponent } from 'ng-zorro-antd/input';
import { NzTableModule } from 'ng-zorro-antd/table';

@Component({
  standalone: true,
  selector: 'app-filter-search-table',
  templateUrl: './filter-search-table.component.html',
  imports: [NzDropdownMenuComponent, FormsModule, NzIconModule, NzButtonModule, NzCheckboxModule, NzTableModule, NzInputGroupComponent, CommonModule],
  styleUrls: ['./filter-search-table.component.scss']
})
export class FilterSearchTableComponent {
  private _filterItems: any;

  @Input()
  set filterItems(value: any) {
    if (value && typeof value[Symbol.iterator] === 'function') {
      // Verifica si value es iterable antes de asignarlo
      this._filterItems = value;
      this.originalFilterItems = [...value]; // Crea una copia de value
      this.initialFilterItems = [...value]; // Crea una copia de value
    } else {
      // Maneja el caso en el que value no es iterable
      console.error('Error: filterItems is not iterable');
    }
  }

  get filterItems(): any {
    return this._filterItems;
  }

  @Input()
  textPlaceholder = 'Buscar';

  @Output() filterItemsChange = new EventEmitter<any>();
  @Output() changeFilterItems = new EventEmitter<any>();

  inputFilter: string | null = null;
  hideFilter = false;
  originalFilterItems: any[] = [];
  initialFilterItems: any[] = [];
  selectedfilterItems: any[] = [];
  isBtnResetDisabled = true;

  getIconClass() {
    return this.initialFilterItems.some((item: any) => item.selected) ? 'icon-color-blue' : 'icon-color-gray';
  }

  handleInputFilter() {
    if (this.inputFilter) {
      // Si inputFilterSku no es nulo ni vacío, filtra initialFilterItems
      const lowerCaseFilter = this.inputFilter.toLowerCase();
      this.initialFilterItems = this.originalFilterItems.filter((item: any) => item.text.toLowerCase().includes(lowerCaseFilter));
    } else {
      // Si inputFilterSku es nulo o vacío, restaura initialFilterItems a su estado original
      this.initialFilterItems = [...this.originalFilterItems];
    }
  }

  async handleHideFilter(isOpenMenuFilter: any) {
    if (isOpenMenuFilter) this.hideFilter = true;
    else {
      // Compara el estado original de initialFilterItems con su estado actual
      const initialFilterItems = JSON.stringify(this.initialFilterItems);
      const originalFilterItems = JSON.stringify(this.originalFilterItems);

      if (initialFilterItems != originalFilterItems) {
        // Si los dos estados son diferentes, se han realizado cambios
        this.confirmFilter()
      }
    }
  }

  updateSingleFilterItemChecked() {
    // Comprueba si todos los elementos en initialFilterItems tienen su propiedad 'selected' establecida en false
    // Devuelve true si todos los elementos no están seleccionados, y false si al menos uno está seleccionado
    const nothingSelected = this.initialFilterItems.every((item: any) => item.selected ==  false);
    this.selectedfilterItems = this.initialFilterItems.filter((item: any) => item.selected).map((item: any) => item.value);
    this.originalFilterItems = [...this.initialFilterItems] // Guarda el estado inicial de initialFilterItems
    this.isBtnResetDisabled = nothingSelected;
  }

  // Método para actualizar el estado del botón de reinicio basado en la selección de los items
  clearFilterSelected() {
    this.initialFilterItems.forEach((item: any) => item.selected = false);
    this.isBtnResetDisabled = true;
    this.confirmFilter()
  }

  async confirmFilter() {
    this.selectedfilterItems = this.initialFilterItems.filter((item: any) => item.selected).map((item: any) => item.value);
    this.originalFilterItems = [...this.initialFilterItems] // Guarda el estado inicial de initialFilterItems
    this.hideFilter = false;

    this.changeFilterItems.emit({selectedFilterItems: this.selectedfilterItems, filterItems: this.initialFilterItems});
  }
}
