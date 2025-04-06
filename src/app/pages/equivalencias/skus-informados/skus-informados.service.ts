import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../../environments/environment';
import { SkuInformadoDto } from '../../dto/skuInformado.dto';

@Injectable({
  providedIn: 'root'
})
export class SkusInformadosService {

  constructor(private http: HttpClient) {
    const token = localStorage.getItem('token');
  }

  public configurationDataSkusInformados(filterTable: any, pageSize?:any, pageLimit?:any): Promise<any[]> {
    let params: any = {};
    if (filterTable !== undefined) {
      params = { filterTable: JSON.stringify(filterTable),pageSize,pageLimit };
    }else{
      params = {
        pageSize,
        pageLimit
      }
    }
  
    const obs$ = this.http.get<any[]>(`${environment.backendUrl}/api/v1/equivalencias/sku-informados`, { params });
    return firstValueFrom(obs$);
  }

  public configurationGetSkuInformados(cadena_id: any, sku_cadena: any): Promise<any[]> {
    const params: any = {
      cadena_id, sku_cadena
    };
    const obs$ = this.http.get<any[]>(`${environment.backendUrl}/api/v1/equivalencias/get-sku`, { params });
    return firstValueFrom(obs$);
  }

  public configurationUpdateSkuInformado(cadena_id: string, sku_cadena: string, skuInformadoRequest: SkuInformadoDto): Promise<any[]> {
    const params: any = {
      cadena_id, sku_cadena
    };
    const obs$ = this.http.put<any[]>(`${environment.backendUrl}/api/v1/equivalencias/update-sku`, skuInformadoRequest, { params });
    return firstValueFrom(obs$);
  }

  // Obtiene los valores de configuración
  public getConfigValues(): Promise<any[]> {
    const params: any = { };
    const obs$ = this.http.get<any[]>(`${environment.backendUrl}/api/v1/config/values`, { params });
    return firstValueFrom(obs$);
  }

  // Obtiene los filstro de SKU
  public configurationFilterSku(): Promise<any[]> {
    const params: any = { };
    const obs$ = this.http.get<any[]>(`${environment.backendUrl}/api/v1/equivalencias/filters`, { params });
    return firstValueFrom(obs$);
  }
  
}