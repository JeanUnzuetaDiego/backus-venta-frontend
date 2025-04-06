export interface IOxxoVentaStock {
    fecha: Date;
    poc: string;
    sku: string;
    poc_nombre: string;
    sku_descripcion: string;
    venta: number;
    venta_cantidad: number;
    venta_importe_costo: number;
    venta_importe_venta: number;
    stock: number;
    stock_cantidad: number;
    stock_importe_costo: number;
    fecha_tiempo_inicio_proceso: Date;
    fecha_tiempo_fin_proceso: Date;
}

export interface IOxxoVentaStockResponse {
    success: boolean;
    message: string;
    data: IOxxoVentaStock[];
    totalRecords: number;
    totalPages: number;
    currentPage: number;
    perPage: number;
}