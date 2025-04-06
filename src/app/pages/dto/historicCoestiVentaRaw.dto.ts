export interface IHistoricCoestiVentaRaw {
    fecha: Date;
    "COD": string;
    ESTACION: string;
    FAMILIA: string;
    CATEGORIA: string;
    FECHA: string;
    MATERIAL: string;
    "DESCRIPCION": string;
    CANTIDAD: string;
    "S/IGV": string;
    "C/IGV": string;
    EAN: string;
    NEGOCIO: string;
    fecha_tiempo_inicio_proceso: string;
    fecha_tiempo_fin_proceso: string;
}

export interface IHistoricCoestiVentaResponse {
    success: boolean;
    message: string;
    data: IHistoricCoestiVentaRaw[];
    totalRecords: number;
    totalPages: number;
    currentPage: number;
    perPage: number;
}