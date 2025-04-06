export interface IHistoricCoestiStockRaw {
    "FECHA": string;
    "Centro": string;
    "Nombre 1": string;
    "Texto breve de material": string;
    "Material": string;
    "Grupo de artículos": string;
    "Almacén": string;
    "Unidad medida base": string;
    "Libre utilización": string;
    "Valor libre util.": string;
    fecha_tiempo_inicio_proceso: Date;
    fecha_tiempo_fin_proceso: Date;
}

export interface IHistoricCoestiStockResponse {
    success: boolean;
    message: string;
    data: IHistoricCoestiStockRaw[];
    totalRecords: number;
    totalPages: number;
    currentPage: number;
    perPage: number;
}