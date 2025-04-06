import { NzTableSortOrder } from "ng-zorro-antd/table";

  export interface DataItemMixProducto {
    sku_kpi_backus: string;
    mix: number;
    mixpa: number;
    sohl: number;
    sohlpa: number;
    var: string | null;
  }

  export interface ColumnItemMixProducto {
    title: string;
    sortOrder: NzTableSortOrder | null;
    sortFn: (a: DataItemMixProducto, b: DataItemMixProducto) => number;
  }

  // Mix Cadena
  export interface DataItemMixCadena {
    poc_cadena_backus: string;
    mix: number;
    mixpa: number;
    sohl: number;
    sohlpa: number;
    var: string | null;
  }

  export interface ColumnItemMixCadena {
    title: string;
    sortOrder: NzTableSortOrder | null;
    sortFn: (a: DataItemMixCadena, b: DataItemMixCadena) => number;
  }

  // Top 10 Var % SOHL dataTopBackusTable
  export interface DataItemTop10VarSOHL {
    poc_nombre_cadena: string;
    sohl: number;
    sohlpa: number;
    varhl: number;
    var: string | null;
  }

  export interface ColumnItemTop10VarSOHL {
    title: string;
    sortOrder: NzTableSortOrder | null;
    sortFn: (a: DataItemTop10VarSOHL, b: DataItemTop10VarSOHL) => number;
  }

  // Bottom 10 Var% SO HL
  export interface DataItemBottom10VarSOHL {
    poc_nombre_cadena: string;
    sohl: number;
    sohlpa: number;
    varhl: number;
    var: string | null;
  }

  export interface ColumnItemBottom10VarSOHL {
    title: string;
    sortOrder: NzTableSortOrder | null;
    sortFn: (a: DataItemBottom10VarSOHL, b: DataItemBottom10VarSOHL) => number;
  }

  // Performance Top SKU
  export interface DataItemPerformanceTopSKU {
    sku_descripcion_norma_backus: string;
    sohl: number;
    sohlpa: number;
    varhl: number;
    var: string | null;
  }

  export interface ColumnItemPerformanceTopSKU {
    title: string;
    sortOrder: NzTableSortOrder | null;
    sortFn: (a: DataItemPerformanceTopSKU, b: DataItemPerformanceTopSKU) => number;
  }

  export interface sumTotals {
    [key: string]: number;
  }