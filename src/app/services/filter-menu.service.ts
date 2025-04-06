import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { environment } from '../environments/environment';
import { HttpHeaders } from '@angular/common/http';
import { timeout } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class FilterMenuService {
  private token: string;

  constructor(private http: HttpClient) {
    this.token = localStorage.getItem('token');
  }

  public configurationDataAutogestion(startDate?: string, endDate?: string, columns?: string, page?: number, limit?: number): Promise<any[]> {
    const params: any = {
      startDate, endDate, columns, page, limit
    };
    const obs$ = this.http.get<any[]>(`${environment.backendUrl}/api/v1/precios/data-autogestion`, { params })
    .pipe(timeout(60000*10)); // tiempo de espera de 5 minutos
    return firstValueFrom(obs$);
  }
  public configurationDataNameBackus(startDate?: string, endDate?: string, intervalYear?: string, filterMenu?: object): Promise<any[]> {
    const params: any = {
      startDate, endDate, intervalYear, filterMenu
    };
    const obs$ = this.http.get<any[]>(`${environment.backendUrl}/api/v1/precios/data-name-backus`, { params });
    return firstValueFrom(obs$);
  }
  public configurationDataZoneNielsen(startDate?: string, endDate?: string, intervalYear?: string, filterMenu?: object): Promise<any[]> {
    const params: any = {
      startDate, endDate, intervalYear, filterMenu
    };
    const obs$ = this.http.get<any[]>(`${environment.backendUrl}/api/v1/precios/data-zone-nielsen`, { params });
    return firstValueFrom(obs$);
  }
  public configurationDataGerenciaBackus(startDate?: string, endDate?: string, intervalYear?: string, filterMenu?: object): Promise<any[]> {
    const params: any = {
      startDate, endDate, intervalYear, filterMenu
    };
    const obs$ = this.http.get<any[]>(`${environment.backendUrl}/api/v1/precios/data-gerencia-backus`, { params });
    return firstValueFrom(obs$);
  }
  public configurationDataClusterBackus(startDate?: string, endDate?: string, intervalYear?: string, filterMenu?: object): Promise<any[]> {
    const params: any = {
      startDate, endDate, intervalYear, filterMenu
    };
    const obs$ = this.http.get<any[]>(`${environment.backendUrl}/api/v1/precios/data-cluster-backus`, { params });
    return firstValueFrom(obs$);
  }
  public configurationDataSupervisorBackus(startDate?: string, endDate?: string, intervalYear?: string, filterMenu?: object): Promise<any[]> {
    const params: any = {
      startDate, endDate, intervalYear, filterMenu
    };
    const obs$ = this.http.get<any[]>(`${environment.backendUrl}/api/v1/precios/data-supervisor-backus`, { params });
    return firstValueFrom(obs$);
  }
  public configurationDataMarca(startDate?: string, endDate?: string, intervalYear?: string, filterMenu?: object): Promise<any[]> {
    const params: any = {
      startDate, endDate, intervalYear, filterMenu
    };
    const obs$ = this.http.get<any[]>(`${environment.backendUrl}/api/v1/precios/data-marca`, { params });
    return firstValueFrom(obs$);
  }
  public configurationDataTipo(startDate?: string, endDate?: string, intervalYear?: string, filterMenu?: object): Promise<any[]> {
    const params: any = {
      startDate, endDate, intervalYear, filterMenu
    };
    const obs$ = this.http.get<any[]>(`${environment.backendUrl}/api/v1/precios/data-tipo`, { params });
    return firstValueFrom(obs$);
  }
  public configurationDataCapacidadNor(startDate?: string, endDate?: string, intervalYear?: string, filterMenu?: object): Promise<any[]> {
    const params: any = {
      startDate, endDate, intervalYear, filterMenu
    };
    const obs$ = this.http.get<any[]>(`${environment.backendUrl}/api/v1/precios/data-capacidad-nor`, { params });
    return firstValueFrom(obs$);
  }
  public configurationDataCdMas(startDate?: string, endDate?: string, intervalYear?: string, filterMenu?: object): Promise<any[]> {
    const params: any = {
      startDate, endDate, intervalYear, filterMenu
    };
    const obs$ = this.http.get<any[]>(`${environment.backendUrl}/api/v1/precios/data-cd-mas`, { params });
    return firstValueFrom(obs$);
  }
}
