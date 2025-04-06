import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../../environments/environment'
import { HttpHeaders } from '@angular/common/http';
import { IPocInformado } from '../../dto/pocInformado.dto';

@Injectable({
  providedIn: 'root'
})
export class TiendasInformadasService {
  private token: string;

  constructor(private http: HttpClient) {``
    this.token = localStorage.getItem('token');
  }

   public configurationDataTiendasInformadas(filterTable?: any, pageSize?:any, pageLimit?:any): Promise<any[]> {
    let params: any = {};
    if (filterTable !== undefined) {
      params = { filterTable: JSON.stringify(filterTable),pageSize,pageLimit };
    }else{
      params = {
        pageSize,
        pageLimit
      }
    }
    const obs$ = this.http.get<any[]>(`${environment.backendUrl}/api/v1/equivalencias/tiendas-informadas`, { params });
    return firstValueFrom(obs$);
  } 

  public configurationGetTienda(cadena_id: any, poc_cadena: any): Promise<any[]> {
    const params: any = {
      cadena_id, poc_cadena
    };
    const obs$ = this.http.get<any[]>(`${environment.backendUrl}/api/v1/equivalencias/get-poc`, { params });
    return firstValueFrom(obs$);
  }

  public configurationUpdatePoc(cadena_id: string, poc_cadena: string, pocInformadoRequest: IPocInformado): Promise<any[]> {
    const params: any = {
      cadena_id, poc_cadena
    };
    const obs$ = this.http.put<any[]>(`${environment.backendUrl}/api/v1/equivalencias/update-poc`, pocInformadoRequest, { params });
    return firstValueFrom(obs$);
  }

}