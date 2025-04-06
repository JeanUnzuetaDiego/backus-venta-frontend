import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
    providedIn: 'root'
  })

  //AUN FALTA ACTUALIZAR EN EL BACK CON EL NOMBRE DE LA VISTA DAILY-FOCUS.SERVICE.TS
  export class VentaService {
    constructor(private http: HttpClient) {}
  
    public processSalesData(startDate?: string, endDate?: string, intervalYear?: string, filterMenu?: object): Promise<any[]> {
      const params: any = {
        startDate, endDate, intervalYear, filterMenu
      };
  
      const obs$ = this.http.get<any[]>(`${environment.backendUrl}/api/v1/sales/graphic`, { params });
      return firstValueFrom(obs$);
    }
    public configurationTableKpiSku(startDate?: string, endDate?: string, intervalYear?: string, filterMenu?: object): Promise<any[]> {
      const params: any = {
        startDate, endDate, intervalYear, filterMenu
      };
      const obs$ = this.http.get<any[]>(`${environment.backendUrl}/api/v1/sales/table-kpi-sku`, { params });
      return firstValueFrom(obs$);
    }
    public configurationTableRetail(startDate?: string, endDate?: string, intervalYear?: string, filterMenu?: object): Promise<any[]> {
      const params: any = {
        startDate, endDate, intervalYear, filterMenu
      };
      const obs$ = this.http.get<any[]>(`${environment.backendUrl}/api/v1/sales/table-retail`, { params });
      return firstValueFrom(obs$);
    }
    public configurationTableTopBackus(startDate?: string, endDate?: string, intervalYear?: string, filterMenu?: object): Promise<any[]> {
      const params: any = {
        startDate, endDate, intervalYear, filterMenu
      };
      const obs$ = this.http.get<any[]>(`${environment.backendUrl}/api/v1/sales/table-top-backus`, { params });
      return firstValueFrom(obs$);
    }
    public configurationTableBottomBackus(startDate?: string, endDate?: string, intervalYear?: string, filterMenu?: object): Promise<any[]> {
      const params: any = {
        startDate, endDate, intervalYear, filterMenu
      };
      const obs$ = this.http.get<any[]>(`${environment.backendUrl}/api/v1/sales/table-bottom-backus`, { params });
      return firstValueFrom(obs$);
    }
    public configurationTableTopDescriptionNor(startDate?: string, endDate?: string, intervalYear?: string, filterMenu?: object): Promise<any[]> {
      const params: any = {
        startDate, endDate, intervalYear, filterMenu
      };
      const obs$ = this.http.get<any[]>(`${environment.backendUrl}/api/v1/sales/table-top-description-nor`, { params });
      return firstValueFrom(obs$);
    }
    public configurationDataNameBackus(startDate?: string, endDate?: string, intervalYear?: string, filterMenu?: object): Promise<any[]> {
      const params: any = {
        startDate, endDate, intervalYear, filterMenu
      };
      const obs$ = this.http.get<any[]>(`${environment.backendUrl}/api/v1/sales/data-name-backus`, { params });
      return firstValueFrom(obs$);
    }
    public configurationDataZoneNielsen(startDate?: string, endDate?: string, intervalYear?: string, filterMenu?: object): Promise<any[]> {
      const params: any = {
        startDate, endDate, intervalYear, filterMenu
      };
      const obs$ = this.http.get<any[]>(`${environment.backendUrl}/api/v1/sales/data-zone-nielsen`, { params });
      return firstValueFrom(obs$);
    }
    public configurationDataGerenciaBackus(startDate?: string, endDate?: string, intervalYear?: string, filterMenu?: object): Promise<any[]> {
      const params: any = {
        startDate, endDate, intervalYear, filterMenu
      };
      const obs$ = this.http.get<any[]>(`${environment.backendUrl}/api/v1/sales/data-gerencia-backus`, { params });
      return firstValueFrom(obs$);
    }
    public configurationDataClusterBackus(startDate?: string, endDate?: string, intervalYear?: string, filterMenu?: object): Promise<any[]> {
      const params: any = {
        startDate, endDate, intervalYear, filterMenu
      };
      const obs$ = this.http.get<any[]>(`${environment.backendUrl}/api/v1/sales/data-cluster-backus`, { params });
      return firstValueFrom(obs$);
    }
    public configurationDataSupervisorBackus(startDate?: string, endDate?: string, intervalYear?: string, filterMenu?: object): Promise<any[]> {
      const params: any = {
        startDate, endDate, intervalYear, filterMenu
      };
      const obs$ = this.http.get<any[]>(`${environment.backendUrl}/api/v1/sales/data-supervisor-backus`, { params });
      return firstValueFrom(obs$);
    }
    public configurationDataMarca(startDate?: string, endDate?: string, intervalYear?: string, filterMenu?: object): Promise<any[]> {
      const params: any = {
        startDate, endDate, intervalYear, filterMenu
      };
      const obs$ = this.http.get<any[]>(`${environment.backendUrl}/api/v1/sales/data-marca`, { params });
      return firstValueFrom(obs$);
    }
    public configurationDataTipo(startDate?: string, endDate?: string, intervalYear?: string, filterMenu?: object): Promise<any[]> {
      const params: any = {
        startDate, endDate, intervalYear, filterMenu
      };
      const obs$ = this.http.get<any[]>(`${environment.backendUrl}/api/v1/sales/data-tipo`, { params });
      return firstValueFrom(obs$);
    }
    public configurationDataCapacidadNor(startDate?: string, endDate?: string, intervalYear?: string, filterMenu?: object): Promise<any[]> {
      const params: any = {
        startDate, endDate, intervalYear, filterMenu
      };
      const obs$ = this.http.get<any[]>(`${environment.backendUrl}/api/v1/sales/data-capacidad-nor`, { params });
      return firstValueFrom(obs$);
    }
  }
  