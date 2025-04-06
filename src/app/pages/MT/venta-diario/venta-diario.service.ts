import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../../environments/environment';
import { HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class VentaDiarioService {
  private token: string;

  constructor(private http: HttpClient) {
    this.token = localStorage.getItem('token');
  }

  public configurationDataVentaDiario(startDate?: string, endDate?: string, pageIndex?: number, pageLimit?: number, filterMenu?: any, filterTable?: any, downloadFile?:any, rol_id?:any, user_id?:string, uuid?:string): Promise<any[]> {
    const params: any = {
      startDate, endDate, pageIndex, pageLimit, filterMenu, filterTable: JSON.stringify(filterTable), downloadFile,rol_id,user_id, uuid
    };
    const obs$ = this.http.get<any[]>(`${environment.backendUrl}/api/v1/sales/venta-diario`, { params });
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
  public configurationDataKpiGestion(startDate?: string, endDate?: string, intervalYear?: string, filterMenu?: any, filterTable?: any): Promise<any[]> {
    const params: any = {
      startDate, endDate, intervalYear, filterMenu, filterTable: JSON.stringify(filterTable)
    };
    const obs$ = this.http.get<any[]>(`${environment.backendUrl}/api/v1/sales/data-kpi-gestion`, { params });
    return firstValueFrom(obs$);
  }
  public configurationTableKpiSku(startDate?: string, endDate?: string, intervalYear?: string, filterMenu?: object, exportar?: boolean): Promise<any> {
    const params: any = {
      startDate, endDate, intervalYear, filterMenu, exportar
    };

    if (exportar) {
      // Cuando exportar es true, responseType debe ser 'blob'
      const obs$ = this.http.get(`${environment.backendUrl}/api/v1/sales/table-kpi-sku`, { params, responseType: 'blob' });
      return firstValueFrom(obs$);
    } else {
      // Cuando exportar es false, responseType puede ser 'json' o puede omitirse ya que 'json' es el valor predeterminado
      const obs$ = this.http.get<any>(`${environment.backendUrl}/api/v1/sales/table-kpi-sku`, { params });
      return firstValueFrom(obs$);
    }
  }
  public configurationTableRetail(startDate?: string, endDate?: string, intervalYear?: string, filterMenu?: object, exportar?: boolean): Promise<any> {
    const params: any = {
      startDate, endDate, intervalYear, filterMenu, exportar
    };
    if (exportar) {
      // Cuando exportar es true, responseType debe ser 'blob'
      const obs$ = this.http.get(`${environment.backendUrl}/api/v1/sales/table-retail`, { params, responseType: 'blob' });
      return firstValueFrom(obs$);
    } else {
      // Cuando exportar es false, responseType puede ser 'json' o puede omitirse ya que 'json' es el valor predeterminado
      const obs$ = this.http.get<any>(`${environment.backendUrl}/api/v1/sales/table-retail`, { params });
      return firstValueFrom(obs$);
    }
  }
  public configurationTableTopBackus(startDate?: string, endDate?: string, intervalYear?: string, filterMenu?: object, exportar?: boolean): Promise<any> {
    const params: any = {
      startDate, endDate, intervalYear, filterMenu, exportar
    };

    if (exportar) {
      // Cuando exportar es true, responseType debe ser 'blob'
      const obs$ = this.http.get(`${environment.backendUrl}/api/v1/sales/table-top-backus`, { params, responseType: 'blob' });
      return firstValueFrom(obs$);
    } else {
      // Cuando exportar es false, responseType puede ser 'json' o puede omitirse ya que 'json' es el valor predeterminado
      const obs$ = this.http.get<any>(`${environment.backendUrl}/api/v1/sales/table-top-backus`, { params });
      return firstValueFrom(obs$);
    }
  }

  // Obtiene los valores de configuración
  public getConfigValues(): Promise<any[]> {
    const params: any = { };
    const obs$ = this.http.get<any[]>(`${environment.backendUrl}/api/v1/config/values`, { params });
    return firstValueFrom(obs$);
  }

}
