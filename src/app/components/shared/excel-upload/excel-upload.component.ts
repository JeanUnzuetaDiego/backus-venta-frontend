import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { UploadDataService } from './upload-data.service';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzAlertModule } from 'ng-zorro-antd/alert';
import { NzNotificationModule } from 'ng-zorro-antd/notification';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzPaginationModule } from 'ng-zorro-antd/pagination';
import { NzMessageService } from 'ng-zorro-antd/message';
import * as XLSX from 'xlsx';
import { v4 as uuidv4 } from 'uuid';
import { saveAs } from 'file-saver';
import { FileUploadService } from '../../../file-upload.service';
import { ExcelUploadService } from './excel-upload.service';

type Entity = 'supesa' | 'cencosud' | 'tottus' | 'tambo' | 'vega' | 'coesti' | 'oxxo';
type EntityType = 'stock' | 'venta';
interface ExcelHeaders {
  supesa: {
    stock: string[];
    venta: string[];
  };
  cencosud: {
    stock: string[];
    venta: string[];
  };
  tottus: string[];
  tambo: string[];
  vega: {
    stock: string[];
    venta: string[];
  };
  coesti: {
    stock: string[];
    venta: string[];
  };
  oxxo: {
    stock: string[];
    venta: string[];
  };
}

interface StructureWithExampleData {
  supesa: {
    stock: { thead: Array<{ title: string; nzWidth: number }>; data: Array<Array<string | number>> };
    venta: { thead: Array<{ title: string; nzWidth: number }>; data: Array<Array<string | number>> };
  };
  cencosud: {
    stock: { thead: Array<{ title: string; nzWidth: number }>; data: Array<Array<string | number>> };
    venta: { thead: Array<{ title: string; nzWidth: number }>; data: Array<Array<string | number>> };
  };
  tottus: { thead: Array<{ title: string; nzWidth: number }>; data: Array<Array<string | number>> };
  tambo: { thead: Array<{ title: string; nzWidth: number }>; data: Array<Array<string | number>> };
  vega: {
    stock: { thead: Array<{ title: string; nzWidth: number }>; data: Array<Array<string | number>> };
    venta: { thead: Array<{ title: string; nzWidth: number }>; data: Array<Array<string | number>> };
  };
  coesti: {
    stock: { thead: Array<{ title: string; column: string; nzWidth: number }>; };
    venta: { thead: Array<{ title: string; column: string; nzWidth: number }>; };
  };
  oxxo: {
    stock: { thead: Array<{ title: string; column: string; nzWidth: number }>; };
    venta: { thead: Array<{ title: string; column: string; nzWidth: number }>; };
  };
}
type EntityName = keyof StructureWithExampleData;

@Component({
  selector: 'app-excel-upload',
  standalone: true,
  imports: [CommonModule, NzCardModule, NzButtonModule, NzAlertModule, NzNotificationModule, NzSpinModule, NzTableModule, NzIconModule, NzPaginationModule],
  templateUrl: './excel-upload.component.html',
  styleUrl: './excel-upload.component.scss',
})
export class ExcelUploadComponent {
  loading = false;
  queryParams: string;
  entityName: EntityName;
  entityType: EntityType; // stock | venta

  showAlert = false;
  alertType: 'success' | 'error';
  alertMessage: string;
  isUploadButtonDisabled = true;
  selectedFileName = '';
  selectedFileSize = '';

  excelHeaders: ExcelHeaders = {
    supesa: {
      stock: ['FECHA', 'COD_SPSA', 'COD_PRODUCTO_PROVEEDOR', 'DESCRIPCION', 'UMB', 'MARCA', 'COD_LOCAL', 'DESCRIPCION_LOCAL', 'TIPO', 'INVENTARIO(u)', 'MIX', 'QUIEBRE'],
      venta: ['PERIODO', 'COD_SPSA', 'COD_PRODUCTO_PROVEEDOR', 'DESCRIPCION', 'MARCA', 'ESTADO_PROD.', 'UMB', 'COD_LOCAL', 'COD_LOCAL_PROVEEDOR', 'DESCRIPCION_LOCAL', 'ESTADO_LOCAL', 'FORMATO', 'TIPO', 'VTA_PERIODO(u)', 'VTA_PUBLICO($)', 'VTA_COSTO($)'],
    },
    cencosud: {
      stock: ['FECHA', 'COD_CENCOSUD', 'COD_PRODUCTO_PROVEEDOR', 'DESCRIPCION', 'MARCA', 'ESTADO_PROD', 'UMB', 'COD_LOCAL', 'COD_LOCAL_PROVEEDOR', 'DESCRIPCION_LOCAL', 'ESTADO_LOCAL', 'FORMATO', 'TIPO', 'INVENTARIO(u)', 'TRANSITO(u)', 'MIX', 'QUIEBRE', 'PRECIO_COSTO'],
      venta: ['PERIODO', 'COD_CENCOSUD', 'COD_PRODUCTO_PROVEEDOR', 'DESCRIPCION', 'MARCA', 'ESTADO_PROD.', 'UMB', 'COD_LOCAL', 'COD_LOCAL_PROVEEDOR', 'DESCRIPCION_LOCAL', 'ESTADO_LOCAL', 'FORMATO', 'TIPO', 'VTA_PERIODO(u)', 'VTA_PUBLICO($)', 'VTA_COSTO($)', 'CANAL_VTA'],
    },
    tottus: ['Upc', 'Sku', 'Estilo', 'Descripción del Producto', 'Marca', 'Modelo', 'Estado', 'Umb', 'Surtido', 'N° Local', 'Nombre Local', 'Venta(u)', 'Venta al publico(C/IVA)', 'Venta en Costo(S/IVA)', 'Contribución', 'Inventario en Locales(U)', 'Tránsito(U)', 'Vta Promedio periodo consulta', 'Días de inventario', 'Inv a Costo(S/IVA)'],
    tambo: ['IdTienda', 'TdaNombre', 'TdaCluster', 'ProdSku', 'ProdNombre', 'MarcaProd','Cantidad Vendida', 'VentaSinIGV', 'Año', 'Mes', 'Dia'],
    vega: {
      stock: ['Periodo', 'FECHA', 'Marca', 'Linea', 'Almacen', 'Sucursal', 'Categoria', 'CodProducto', 'Producto', 'Mes', 'Anio', 'Mundo', 'Formato', 'FactorMax', 'StockFisico', 'Cantidad', 'COD_SUCURSAL', 'CODIGOBARRAS'],
      venta: ['Periodo', 'FECHA', 'MES', 'ANIO', 'CATEGORIA', 'PRODUCTO', 'DESC_MARCA', 'DESC_LINEA', 'Sucursal', 'Formato', 'Cantidad', 'Cajas', 'ValorVenta', 'CodProducto', 'COD_SUCURSAL', 'CODIGOBARRAS'],
    },
    coesti: {
      stock: ['FECHA', 'Centro', 'Nombre 1', 'Material', 'Texto breve de material', 'Grupo de artículos', 'Almacén', 'Unidad medida base', 'Libre utilización', 'Valor libre util.'],
      venta: ['COD', 'ESTACION', 'FAMILIA', 'CATEGORIA', 'FECHA', 'MATERIAL', 'DESCRIPCION', 'CANTIDAD', 'S/IGV', 'C/IGV', 'EAN', 'NEGOCIO'],
    },
    oxxo: {
      stock: ['FECHA', 'Cod Tienda', 'Nombre Tienda', 'EAN', 'DESCRIPCIÓN', 'CATEGORÍA', 'STOCK'],
      venta: ['FECHA', 'Cod Tienda', 'NOMBRE', 'CATEGORÍA', 'EAN', 'DESCRIPCIÓN', 'Unidades vendidas netas', 'Ventas netas (sin IGV)'],
    }
  };

  structureWithExampleData: StructureWithExampleData = {
    supesa: {
      stock: {
        thead: [
          {title: 'FECHA', nzWidth: 100},
          {title: 'COD_SPSA', nzWidth: 110},
          {title: 'COD_PRODUCTO_PROVEEDOR', nzWidth: 230},
          {title: 'DESCRIPCION', nzWidth: 180},
          {title: 'UMB', nzWidth: 60},
          {title: 'MARCA', nzWidth: 80},
          {title: 'COD_LOCAL', nzWidth: 110},
          {title: 'DESCRIPCION_LOCAL', nzWidth: 170},
          {title: 'TIPO', nzWidth: 100},
          {title: 'INVENTARIO(u)', nzWidth: 120},
          {title: 'MIX', nzWidth: 100},
          {title: 'QUIEBRE', nzWidth: 100},
        ],
        data: [
          ['22/05/24', '20056096', '', 'CRISTAL-CERVEZA-LT-473-ML', 'UN', 'CRISTAL', 52, 'SPSA-PVEA-BRASIL', 'LOCAL', 3, 0, 0],
          ['22/05/24', '20327629', '', 'MIKES-HARD-LEMONADE-VODKA-LT-355-ML', 'UN', 'MIKES', 1, 'SPSA-PVEA-LOS-OLIVOS', 'LOCAL', 2, 0, 0],
        ],
      },
      venta: {
        thead: [
          {title: 'PERIODO', nzWidth: 110},
          {title: 'COD_SPSA', nzWidth: 100},
          {title: 'COD_PRODUCTO_PROVEEDOR', nzWidth: 230},
          {title: 'DESCRIPCION', nzWidth: 180},
          {title: 'MARCA', nzWidth: 90},
          {title: 'ESTADO_PROD', nzWidth: 120},
          {title: 'UMB', nzWidth: 60},
          {title: 'COD_LOCAL', nzWidth: 110},
          {title: 'COD_LOCAL_PROVEEDOR', nzWidth: 230},
          {title: 'DESCRIPCION_LOCAL', nzWidth: 180},
          {title: 'ESTADO_LOCAL', nzWidth: 130},
          {title: 'FORMATO', nzWidth: 100},
          {title: 'TIPO', nzWidth: 80},
          {title: 'VTA_PERIODO(u)', nzWidth: 140},
          {title: 'VTA_PUBLICO($)', nzWidth: 140},
          {title: 'VTA_COSTO($)', nzWidth: 130},
        ],
        data: [
          ['1/05/24', '20256340', '', 'MIKE-S-HARD-PASSION-FRUIT-LT-355-ML', 'MIKES', 'INACTIVO', 'UN', 1940, '', 'SPSA-SANJOSEC2-AN-MS', 'ACTIVO', 'SPSA', 'L', 1, 4.15, 3.94],
          ['1/05/24', '20171726', '', 'GUARANA-GASEOSA-BT-450-ML', 'GUARANA', 'ACTIVO', 'UN', 1358, '', 'SPSA-GUARDIH10PIU-MS', 'ACTIVO', 'SPSA', 'L', 3, 5.07, 4.68],
        ],
      },
    },
    cencosud: {
      stock: {
        thead: [
          {title: 'FECHA', nzWidth: 100},
          {title: 'COD_CENCOSUD', nzWidth: 150},
          {title: 'COD_PRODUCTO_PROVEEDOR', nzWidth: 230},
          {title: 'DESCRIPCION', nzWidth: 160},
          {title: 'MARCA', nzWidth: 100},
          {title: 'ESTADO_PROD', nzWidth: 120},
          {title: 'UMB', nzWidth: 90},
          {title: 'COD_LOCAL', nzWidth: 110},
          {title: 'COD_LOCAL_PROVEEDOR', nzWidth: 200},
          {title: 'DESCRIPCION_LOCAL', nzWidth: 170},
          {title: 'ESTADO_LOCAL', nzWidth: 130},
          {title: 'FORMATO', nzWidth: 100},
          {title: 'TIPO', nzWidth: 100},
          {title: 'INVENTARIO(u)', nzWidth: 140},
          {title: 'TRANSITO(u)', nzWidth: 130},
          {title: 'MIX', nzWidth: 100},
          {title: 'QUIEBRE', nzWidth: 100},
          {title: 'PRECIO_COSTO', nzWidth: 140},
        ],
        data: [
          ['17/05/24', 703743, '', 'GUARAN¡ 300ML', 'GUARANA', 'ACTIVO', 'UN', 'H001', '', 'Hipermercado Metro Chorrillos', 'ACTIVO', 'Tiendas Metro', 'L', 34, 0, 1, 0, 0.86],
          ['17/05/24', 973306, '', 'CUSQUE—A  DOBLE MALTA 620 ML', 'CUSQUE—A', 'ACTIVO', 'UN', 'S014', '', 'Supermercado Metro Ventanilla', 'ACTIVO', 'Tiendas Metro', 'L', 0, 0, 1, 1, 4.39],
        ],
      },
      venta: {
        thead: [
          {title: 'PERIODO', nzWidth: 100},
          {title: 'COD_CENCOSUD', nzWidth: 150},
          {title: 'COD_PRODUCTO_PROVEEDOR', nzWidth: 230},
          {title: 'DESCRIPCION', nzWidth: 180},
          {title: 'MARCA', nzWidth: 100},
          {title: 'ESTADO_PROD.', nzWidth: 130},
          {title: 'UMB', nzWidth: 90},
          {title: 'COD_LOCAL', nzWidth: 110},
          {title: 'COD_LOCAL_PROVEEDOR', nzWidth: 200},
          {title: 'DESCRIPCION_LOCAL', nzWidth: 170},
          {title: 'ESTADO_LOCAL', nzWidth: 130},
          {title: 'FORMATO', nzWidth: 100},
          {title: 'TIPO', nzWidth: 100},
          {title: 'VTA_PERIODO(u)', nzWidth: 140},
          {title: 'VTA_PUBLICO($)', nzWidth: 140},
          {title: 'VTA_COSTO($)', nzWidth: 120},
          {title: 'CANAL_VTA', nzWidth: 100},
        ],
        data: [
          ['3/05/24', 921567, '', 'CERVEZA PILSEN CALLAO BOT 305ML RT', 'PILSEN', 'ACTIVO', 'UN', 'H014', '', 'Hipermercado Metro Plaza Norte', 'ACTIVO', 'Tiendas Metro', 'L', 3, 11.7, 7.53, 'PISO DE VENTA'],
          ['3/05/24', 245734, '', 'AGUA SAN MATEO SIN GAS 2.5L', 'SAN MATEO', 'ACTIVO', 'BOT', 'H007', '', 'Hipermercado Metro IngenierÌa', 'ACTIVO', 'Tiendas Metro', 'L', 14, 35.57, 33.04, 'PISO DE VENTA'],
        ],
      },
    },
    tottus: {
      thead: [
        {title: 'Upc', nzWidth: 110},
        {title: 'Sku', nzWidth: 80},
        {title: 'Estilo', nzWidth: 80},
        {title: 'Descripción del Producto', nzWidth: 180},
        {title: 'Marca', nzWidth: 120},
        {title: 'Modelo', nzWidth: 120},
        {title: 'Estado', nzWidth: 80},
        {title: 'Umb', nzWidth: 70},
        {title: 'Surtido', nzWidth: 70},
        {title: 'N° Local', nzWidth: 120},
        {title: 'Nombre Local', nzWidth: 120},
        {title: 'Venta(u)', nzWidth: 120},
        {title: 'Venta al publico(C/IVA)', nzWidth: 120},
        {title: 'Venta en Costo(S/IVA)', nzWidth: 120},
        {title: 'Contribución', nzWidth: 120},
        {title: 'Inventario en Locales(U)', nzWidth: 120},
        {title: 'Tránsito(U)', nzWidth: 120},
        {title: 'Vta Promedio periodo consulta', nzWidth: 120},
        {title: 'Días de inventario', nzWidth: 120},
        {title: 'Inv a Costo(S/IVA)', nzWidth: 120},
      ],
      data: [
        ['7.75375E+12', 10000180, 0, 'SIX PACK MALTA CUZQUE—A BOTELLAX330ML', '', '', 'Eliminado', 'UNI', 'NO', 103, 'HT-Mega Plaza', 0, 0, 0, 0, 0, 0, 0, 0, 0],
        ['7.75375E+12', 10000180, 0, 'SIX PACK MALTA CUZQUE—A BOTELLAX330ML', '', '', 'Eliminado', 'UNI', 'NO', 104, 'Las Begonias',  0, 0, 0, 0, 0, 0, 0, 0, 0]
      ],
    },
    tambo: {
      thead: [
        {title: 'IdTienda', nzWidth: 100},
        {title: 'TdaNombre', nzWidth: 110},
        {title: 'TdaCluster', nzWidth: 120},
        {title: 'ProdSku', nzWidth: 80},
        {title: 'ProdNombre', nzWidth: 160},
        {title: 'MarcaProd', nzWidth: 120},
        {title: 'Cantidad Vendida', nzWidth: 120},
        {title: 'VentaSinIGV', nzWidth: 80},
        {title: 'Año', nzWidth: 40},
        {title: 'Mes', nzWidth: 40},
        {title: 'Dia', nzWidth: 40},
      ],
      data: [
        [175, 'T-ASPERO', 'BARRIO CONSERVADOR', '1000355', 'CERVEZA PILSEN TWELVE PACK LATA X 355 ML', 'PILSEN', 37, '1501.94914', 2024, 5, 4],
        [305, 'SANBARTOLO', 'BARRIO CONSERVADOR', '1007996', 'BEBIDA DE MAIZ GOLDEN SIXPACK LATA X 355 ML', 'GOLDEN', 0, '0', 2024, 5, 5],
      ],
    },
    vega: {
      stock: {
        thead: [
          {title: 'Periodo', nzWidth: 100},
          {title: 'FECHA', nzWidth: 100},
          {title: 'Marca', nzWidth: 100},
          {title: 'Linea', nzWidth: 140},
          {title: 'Almacen', nzWidth: 100},
          {title: 'Sucursal', nzWidth: 100},
          {title: 'Categoria', nzWidth: 140},
          {title: 'CodProducto', nzWidth: 110},
          {title: 'Producto', nzWidth: 140},
          {title: 'Mes', nzWidth: 100},
          {title: 'Anio', nzWidth: 100},
          {title: 'Mundo', nzWidth: 100},
          {title: 'Formato', nzWidth: 100},
          {title: 'FactorMax', nzWidth: 100},
          {title: 'StockFisico', nzWidth: 100},
          {title: 'Cantidad', nzWidth: 100},
          {title: 'COD_SUCURSAL', nzWidth: 130},
          {title: 'CODIGOBARRAS', nzWidth: 130},
        ],
        data: [
          ['202405', '6/05/24', 'CORONA', 'CERVEZA NO RETORNABLE IMPORTADA', 'SURCO', 'SURCO', 'CERVEZA NO RETORNABLE', '410621', 'CORONA EXTRA 355 ML LATA', 'May-24', '2024', 'BEBIDAS Y SNACKS', 'CASH&CARRY', 24, 38, 38, '0035', '7.70106E+12'],
          ['202405', '4/05/24', 'CORONA', 'CERVEZA NO RETORNABLE IMPORTADA', 'MALVINAS', 'MALVINAS', 'CERVEZA NO RETORNABLE', '411822', 'CORONA CERV. 355ML BOT. (X23)', 'May-24', '2024', 'BEBIDAS Y SNACKS', 'MARKET', 24, 5, 5, '0036', '75032715'],
        ],
      },
      venta: {
        thead: [
          {title: 'Periodo', nzWidth: 80},
          {title: 'FECHA', nzWidth: 80},
          {title: 'MES', nzWidth: 80},
          {title: 'ANIO', nzWidth: 60},
          {title: 'CATEGORIA', nzWidth: 140},
          {title: 'PRODUCTO', nzWidth: 140},
          {title: 'DESC_MARCA', nzWidth: 120},
          {title: 'DESC_LINEA', nzWidth: 120},
          {title: 'Sucursal', nzWidth: 100},
          {title: 'Formato', nzWidth: 100},
          {title: 'Cantidad', nzWidth: 80},
          {title: 'Cajas', nzWidth: 70},
          {title: 'ValorVenta', nzWidth: 100},
          {title: 'CodProducto', nzWidth: 105},
          {title: 'COD_SUCURSAL', nzWidth: 130},
          {title: 'CODIGOBARRAS', nzWidth: 130},
        ],
        data: [
          ['202405', '10/05/24', 'May-24', '2024', 'CERVEZA NO RETORNABLE', 'CRISTAL CERV.355ML UNIVERSITARIO', 'CRISTAL', 'CERVEZA NO RETORNABLE IMPORTADA', 'SAN ANTONIO', 'CASH&CARRY', 6, 1, 19.91528, 410637, '0031', '7.75375E+12'],
          ['202405', '10/05/24', 'May-24', '2024', 'CERVEZA RETORNABLE', 'CRISTAL CERVEZA 305 ML CJ X 24 RETORNABLE', 'CRISTAL', 'CERVEZA RETORNABLE', 'COLONIAL', 'CASH&CARRY', 120, 5, 269.06746, 410575, '0037', '7.75375E+12'],
        ],
      },
    },
    coesti: {
      stock: {
        thead: [
          {title: 'FECHA', column: 'FECHA', nzWidth: 50},
          {title: 'Centro', column: 'Centro', nzWidth: 100},
          {title: 'Nombre 1', column: 'Nombre 1', nzWidth: 220},
          {title: 'Fecha', column: 'fecha',nzWidth: 90},
          {title: 'Material', column: 'Material', nzWidth: 80},
          {title: 'Texto breve de material', column: 'Texto breve de material', nzWidth: 170},
          {title: 'Grupo de artículos', column: 'Grupo de artículos', nzWidth: 140},
          {title: 'Almacén', column: 'Almacén', nzWidth: 100},
          {title: 'Unidad medida base', column: 'Unidad medida base', nzWidth: 160},
          {title: 'Libre utilización', column: 'Libre utilización', nzWidth: 120},
          {title: 'Valor libre util.', column: 'Valor libre util.', nzWidth: 120},
          {title: 'Fecha Inicio Proceso', column: 'fecha_tiempo_inicio_proceso', nzWidth: 160},
          {title: 'Fecha Fin Proceso', column: 'fecha_tiempo_fin_proceso', nzWidth: 150},
        ],
      },
      venta: {
        thead: [
          {title: 'Fecha', column: 'fecha', nzWidth: 90},
          {title: 'COD', column: 'COD', nzWidth: 50},
          {title: 'ESTACION', column: 'ESTACION', nzWidth: 140},
          {title: 'FAMILIA', column: 'FAMILIA', nzWidth: 170},
          {title: 'CATEGORIA', column: 'CATEGORIA', nzWidth: 100},
          {title: 'FECHA', column: 'FECHA', nzWidth: 80},
          {title: 'MATERIAL', column: 'MATERIAL', nzWidth: 100},
          {title: 'DESCRIPCION', column: 'DESCRIPCION', nzWidth: 180},
          {title: 'CANTIDAD', column: 'CANTIDAD', nzWidth: 160},
          {title: 'S/IGV', column: 'S/IGV', nzWidth: 50},
          {title: 'C/IGV', column: 'C/IGV', nzWidth: 50},
          {title: 'EAN', column: 'EAN', nzWidth: 110},
          {title: 'NEGOCIO', column: 'NEGOCIO', nzWidth: 80},
          {title: 'Fecha Inicio Proceso', column: 'fecha_tiempo_inicio_proceso', nzWidth: 160},
          {title: 'Fecha Fin Proceso', column: 'fecha_tiempo_fin_proceso', nzWidth: 150},
        ],
      }
    },
    oxxo: {
      stock: {
        thead: [
          {title: 'Fecha', column: 'fecha',nzWidth: 90},
          {title: 'FECHA', column: 'FECHA', nzWidth: 80},
          {title: 'Cod Tienda', column: 'Cod Tienda', nzWidth: 90},
          {title: 'Nombre Tienda', column: 'Nombre Tienda', nzWidth: 100},
          {title: 'EAN', column: 'EAN', nzWidth: 100},
          {title: 'DESCRIPCIÓN', column: 'DESCRIPCIÓN', nzWidth: 240},
          {title: 'CATEGORÍA', column: 'CATEGORÍA', nzWidth: 110},
          {title: 'STOCK', column: 'STOCK', nzWidth: 80},
          {title: 'Fecha Inicio Proceso', column: 'fecha_tiempo_inicio_proceso', nzWidth: 160},
          {title: 'Fecha Fin Proceso', column: 'fecha_tiempo_fin_proceso', nzWidth: 150},
        ],
      },
      venta: {
        thead: [
          {title: 'Fecha', column: 'fecha', nzWidth: 90},
          {title: 'FECHA', column: 'FECHA', nzWidth: 80},
          {title: 'Cod Tienda', column: 'Cod Tienda', nzWidth: 100},
          {title: 'NOMBRE', column: 'NOMBRE', nzWidth: 100},
          {title: 'CATEGORÍA', column: 'CATEGORÍA', nzWidth: 100},
          {title: 'EAN', column: 'EAN', nzWidth: 120},
          {title: 'DESCRIPCIÓN', column: 'DESCRIPCIÓN', nzWidth: 240},
          {title: 'Unidades vendidas netas', column: 'Unidades vendidas netas', nzWidth: 180},
          {title: 'Ventas netas (sin IGV)', column: 'Ventas netas (sin IGV)', nzWidth: 160}, 
          {title: 'Fecha Inicio Proceso', column: 'fecha_tiempo_inicio_proceso', nzWidth: 160},
          {title: 'Fecha Fin Proceso', column: 'fecha_tiempo_fin_proceso', nzWidth: 150},
        ],
      },
    },
  };

  selectors = {
    supesa: '#supesafile',
    cencosud: '#cencosudfile',
    tottus: '#tottusfile',
    tambo: '#tambofile',
    vega: '#vegafile',
    coesti: '#coestifile',
    oxxo: '#oxxofile',
  };

  loaderTable: boolean = false;
  // listHistoricCoestiStockRaw: IHistoricCoestiStockRaw[] = [];
  // listHistoricCoestiVentaRaw: IHistoricCoestiVentaRaw[] = [];
  data: any = [];
  pageIndex: number = 1;
  pageSize: number = 10;
  totalRecords: number = 0;

  constructor(
    private router: Router,
    private activeRoute: ActivatedRoute,
    private notification: NzNotificationService,
    private uploadDataService: UploadDataService,
    private fileUploadService: FileUploadService,
    private excelUploadService: ExcelUploadService,
    private message: NzMessageService,
  ) {}

  async ngOnInit() {
    this.entityName = this.uploadDataService.data as EntityName;

    this.activeRoute.queryParams.subscribe(params => {
      this.queryParams = params['entity'];
      this.entityName = this.entityName ?? this.queryParams.split('-')[0]  as EntityName;
      this.entityType = this.queryParams.split('-')[1] as EntityType;
    });
    this.loadData();
  }

  loadData() {
    this.loaderTable = true;
    this.excelUploadService.getDataHistoricEntity(this.entityName, this.entityType, this.pageIndex, this.pageSize).then((data) => {
      this.data = data?.data;
      this.totalRecords = data?.totalRecords;
      this.loaderTable = false;
    }).catch((error) => {
      this.message.error('Error al cargar los usuarios', error);
      this.loaderTable = false;
    }); 
  }

  handlePageEvent(pageIndex: number) {
    this.pageIndex = pageIndex;
    this.loadData();
  }

  setFixedToNumber(colum: any) {
    return parseFloat(colum).toLocaleString('en-US', {});
  }

  async onExcelFileSelected(entity: Entity) {
    const selector = this.selectors[entity];
    const inputNode = document.querySelector(selector) as HTMLInputElement;
    const file = inputNode.files?.[0];
  
    if (!file) return;
  
    this.loading = true;
    this.isUploadButtonDisabled = true;
    this.showAlert = false;

    const isValidExcel = await this.isValid(entity, file);
    this.loading = false;
    this.showAlert = true;

    if (isValidExcel) {
      this.alertType = 'success';
      this.alertMessage = 'Todos las columnas requeridas están presentes en el archivo seleccionado';
      this.isUploadButtonDisabled = false;
      this.selectedFileName = file.name;
      this.selectedFileSize = (file.size / 1024 / 1024).toFixed(2) + ' MB';
    } else {
      this.alertType = 'error';
      this.alertMessage = 'No todas las columnas requeridas están presentes en el archivo seleccionado';
      this.selectedFileName = '';
      this.selectedFileSize = '';
      inputNode.value = '';
    }
  }

  async onUploadFile() {
    const selector = this.selectors[this.entityName];
    const inputNode = document.querySelector(selector) as HTMLInputElement;
    const file = inputNode.files?.[0];

    if (!file || this.isUploadButtonDisabled) return;

    this.loading = true;
    try {
      const formData = new FormData();
      // const uuid = uuidv4();
      formData.append('file', file);
      formData.append('uuid', uuidv4());
      formData.append('typeEntity', this.entityType);
      formData.append('entity', this.entityName);
      await this.fileUploadService.uploadFileETL(formData).then((res) => {
        this.showAlert = false;
        this.isUploadButtonDisabled = true;
        this.selectedFileName = '';
        this.selectedFileSize = '';
        inputNode.value = '';
        this.createNotification('success', 'Archivo subido', 'El archivo excel se subió correctamente');
        this.loadData();
      })
      .catch((error) => {
        console.log('error-uploadExcelOrCsv', error);
        this.createNotification('error', error?.error?.message, 'Ocurrió un error al subir el archivo excel');
      });
      
    } catch (error: any) {
      const messageError = error?.error || 'Error al subir el archivo excel';
      this.createNotification('error', messageError, 'Ocurrió un error al subir el archivo excel');
    }
    this.loading = false;
  }

  deleteFile() {
    this.selectedFileName = '';
    this.selectedFileSize = '';
    this.showAlert = false;
    this.isUploadButtonDisabled = true;
    // eliminamos la referencia del archivo
    const selector = this.selectors[this.entityName];
    const inputNode = document.querySelector(selector) as HTMLInputElement;
    inputNode.value = '';
  }

  async isValid(entity: Entity, file: File) {
    const data = await file.arrayBuffer();
    const workbook = XLSX.read(data, { sheetRows: 1 });
    let result = XLSX.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]], { header: 1 })[0] as string[];
    const headers = result.map(header => header.trim());
    if (entity === 'supesa') {
      return this.excelHeaders[entity][this.entityType].every((header) => headers.includes(header));
    } else if(entity === 'cencosud') {
      return this.excelHeaders[entity][this.entityType].every((header) => headers.includes(header));
    } else if (entity === 'vega') {
      return this.excelHeaders[entity][this.entityType].every((header) => headers.includes(header));
    } else if (entity === 'coesti') {
      return this.excelHeaders[entity][this.entityType].every((header) => headers.includes(header));
    } else if (entity === 'oxxo') {
      return this.excelHeaders[entity][this.entityType].every((header) => headers.includes(header));
    } else {
      return this.excelHeaders[entity].every((header) => headers.includes(header));
    }
  }

  async uploadExcelOrCsv(entity: Entity, file: File) {
    const formData = new FormData();
    // const uuid = uuidv4();
    formData.append('file', file);
    formData.append('uuid', uuidv4());
    formData.append('typeEntity', this.entityType);
    formData.append('entity', entity);
    await this.fileUploadService.uploadFileETL(formData).then((res) => {
    })
    .catch((error) => {
      console.log('error-uploadFileETL', error);
    });
  }

  async uploadExcelOrCsv_1(entity: Entity, file: File) {
    const newFileName = `${this.entityName}-${this.entityType ? this.entityType+'-' : ''}${new Date().getTime()}.${file.name.split('.')[1]}`;
    const newFile = new File([file], newFileName, { type: file.type });
    // await this.fileUploadService.uploadFile(this.urls[entity], file, entity+'-'+this.entityType);
    await this.fileUploadService.uploadFile('file/upload', newFile, entity+'-'+this.entityType);
  }

  createNotification(type: string, title: string, description: string): void {
    this.notification.create(type, title, description);
  }

  returnStore() {
    this.router.navigate([`/cargar/${this.entityName}`]);
  }

  downloadExcelPlantilla(): void {
    this.excelUploadService.downloadExcelPlantilla(this.entityName, this.entityType).then((response: any) => {
      console.log('response', response);
      if (response.success) {
        saveAs(response.file_url, `${this.entityName}.xlsx`);
        return;
      }
      // Asumiendo que el servicio devuelve un Blob directamente
    }, error => {
      console.error('Error al descargar la plantilla:', error);
    });
  }

}
