import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../../environments/environment';
import { HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class SameStoreSalesService {
  private token: string;

  constructor(private http: HttpClient) {
    this.token = localStorage.getItem('token');
  }

  public processDataSSSGraphicMonth(filterMenu?: any, typeFilter?: string, sssFilter?: string): Promise<any[]> {
    const params: any = {
      filterMenu, typeFilter, sssFilter
    };

    const obs$ = this.http.get<any[]>(`${environment.backendUrl}/api/v1/sales/graphic-sss-month`, { params });
    return firstValueFrom(obs$);
  }

  public processDataVentaShare(year?: String, months?: String, weeks?: String, filterMenu?: any): Promise<any[]> {
    const params: any = {
      year, months, weeks, filterMenu
    };
    const obs$ = this.http.get<any[]>(`${environment.backendUrl}/api/v1/cencosud/venta_share`, { params });
    return firstValueFrom(obs$);
  }

  public processDataEvolutionShare(year?: String, months?: String, filterMenu?: any): Promise<any[]> {
    const params: any = {
      year, months, filterMenu
    };
    const obs$ = this.http.get<any[]>(`${environment.backendUrl}/api/v1/cencosud/evolution_share`, { params });
    return firstValueFrom(obs$);
  }

  public processDataChartPieRetail(year?: String, months?: String, weeks?: String, filterZoomInChartPieRetail?: String, filterSelectionCategChartPieRetail?: String, filterSelectionMarcaChartPieRetail?: String ,filterMenu?: any): Promise<any[]> {
    const params: any = {
      year, months, weeks, filterZoomInChartPieRetail, filterSelectionCategChartPieRetail, filterSelectionMarcaChartPieRetail, filterMenu
    };
    const obs$ = this.http.get<any[]>(`${environment.backendUrl}/api/v1/cencosud/chart_pie/retail`, { params });
    return firstValueFrom(obs$);
  }

}
