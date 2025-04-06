import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../../environments/environment';
import { HttpHeaders } from '@angular/common/http';
import { timeout } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AutoGestionService {
  private token: string;

  constructor(private http: HttpClient) {
    this.token = localStorage.getItem('token');
  }

  public configurationDataAutogestion(startDate?: string, endDate?: string, columns?: string, page?: number, limit?: number, filterMenu?: any, downloadFile?:boolean , rol_id?:string, user_id?:string, uuid?:string): Promise<any[]> {
    const params: any = {
      startDate, endDate, columns, page, limit, filterMenu, downloadFile,rol_id,user_id, uuid
    };
    const obs$ = this.http.get<any[]>(`${environment.backendUrl}/api/v1/sales/autogestion`, { params }).pipe(timeout(60000*10));
    return firstValueFrom(obs$);
  }
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
  public configurationResumeAmount(startDate?: string, endDate?: string, intervalYear?: string, filterMenu?: object): Promise<any[]> {
    const params: any = {
      startDate, endDate, intervalYear, filterMenu
    };
    const obs$ = this.http.get<any[]>(`${environment.backendUrl}/api/v1/sales/resume-amount`, { params });
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
  public configurationDataCdMas(startDate?: string, endDate?: string, intervalYear?: string, filterMenu?: object): Promise<any[]> {
    const params: any = {
      startDate, endDate, intervalYear, filterMenu
    };
    const obs$ = this.http.get<any[]>(`${environment.backendUrl}/api/v1/sales/data-cd-mas`, { params });
    return firstValueFrom(obs$);
  }
  public configurationDataMontoSellOut(startDate?: string, endDate?: string, intervalYear?: string, filterMenu?: object): Promise<any[]> {
    const params: any = {
      startDate, endDate, intervalYear, filterMenu
    };
    const obs$ = this.http.get<any[]>(`${environment.backendUrl}/api/v1/sales/data-monto`, { params });
    return firstValueFrom(obs$);
  }
  // Obtiene los valores de configuración
  public getConfigValues(): Promise<any[]> {
    const params: any = { };
    const obs$ = this.http.get<any[]>(`${environment.backendUrl}/api/v1/config/values`, { params });
    return firstValueFrom(obs$);
  }
}
