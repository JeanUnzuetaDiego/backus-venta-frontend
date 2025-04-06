import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../../environments/environment';
// import { IHistoricCoestiStockResponse } from '../../../pages/dto/historicCoestiStockRaw.dto';
// import { IHistoricCoestiVentaResponse } from '../../../pages/dto/historicCoestiVentaRaw.dto';

@Injectable({
  providedIn: 'root'
})
export class ExcelUploadService {

  constructor(private http: HttpClient) { }

  public getDataHistoricEntity(entityName: string, entityType?: string, pageIndex?: number, pageLimit?: number): Promise<any> {
    const params = { entityName, entityType, pageIndex, pageLimit };
    const obs$ = this.http.get<any>(`${environment.backendUrl}/api/v1/carga/data-historic-entity`, { params });
    return firstValueFrom(obs$);
  }

  public async downloadExcelPlantilla(entity: string, type: string): Promise<any> {
    try {
      const params = { entity, type };
      const obs$ = this.http.get<any>(`${environment.backendUrl}/api/v1/download/excel-plantilla`, { params });
      return await firstValueFrom(obs$);
    } catch (error) {
      console.error('Error al cargar los datos:', error);
      throw error;
    }
  }

  // public getHistoricCoestiVenta(pageIndex?: number, pageLimit?: number): Promise<IHistoricCoestiVentaResponse> {
  //   const params = { pageIndex, pageLimit };
  //   const obs$ = this.http.get<IHistoricCoestiVentaResponse>(`${environment.backendUrl}/api/v1/carga/coesti/eventa-h`, { params });
  //   return firstValueFrom(obs$);
  // }    
}
