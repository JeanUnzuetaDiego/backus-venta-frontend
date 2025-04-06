import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom, timeout } from 'rxjs';
import { environment } from '../../../environments/environment';
import { HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class StockDohService {
  private token: string;

  constructor(private http: HttpClient) {
    this.token = localStorage.getItem('token');
  }

  public configurationDataStockDoH(startDate?: string, endDate?: string, columns?: string, estimationDays?: number, page?: number, limit?: number, filterMenu?: any, downloadFile?:boolean , rol_id?:string, user_id?:string, uuid?:string): Promise<any[]> {
    const params: any = {
      startDate, endDate, columns, page, limit, filterMenu, estimationDays, downloadFile,rol_id,user_id, uuid
    };
    const obs$ = this.http.get<any[]>(`${environment.backendUrl}/api/v1/sales/stock-doh`, { params }).pipe(timeout(60000*10));
    return firstValueFrom(obs$);
  }

  public configurationDataNameBackus(startDate?: string, endDate?: string, intervalYear?: string, filterMenu?: object): Promise<any[]> {
    const params: any = {
      startDate, endDate, intervalYear, filterMenu
    };
    const obs$ = this.http.get<any[]>(`${environment.backendUrl}/api/v1/precios/data-name-backus`, { params });
    return firstValueFrom(obs$);
  }
  public configurationDataGerenciaBackus(startDate?: string, endDate?: string, intervalYear?: string, filterMenu?: object): Promise<any[]> {
    const params: any = {
      startDate, endDate, intervalYear, filterMenu
    };
    const obs$ = this.http.get<any[]>(`${environment.backendUrl}/api/v1/precios/data-gerencia-backus`, { params });
    return firstValueFrom(obs$);
  }
  public configurationDataCapacidadNor(startDate?: string, endDate?: string, intervalYear?: string, filterMenu?: object): Promise<any[]> {
    const params: any = {
      startDate, endDate, intervalYear, filterMenu
    };
    const obs$ = this.http.get<any[]>(`${environment.backendUrl}/api/v1/precios/data-capacidad-nor`, { params });
    return firstValueFrom(obs$);
  }
  // Obtiene los valores de configuración
  public getConfigValues(): Promise<any[]> {
    const params: any = { };
    const obs$ = this.http.get<any[]>(`${environment.backendUrl}/api/v1/config/values`, { params });
    return firstValueFrom(obs$);
  }

}
