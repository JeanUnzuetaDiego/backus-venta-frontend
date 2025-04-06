import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ICoestiVentaStockResponse } from '../../dto/coestiVentaStock.dto';

@Injectable({
  providedIn: 'root'
})
export class CoestiService {

  constructor(private http: HttpClient) { }

  public getCoestiVentaStock(pageIndex?: number, pageLimit?: number, dateRange?: Date[]): Promise<ICoestiVentaStockResponse> {
    // let params = new HttpParams();
    // params = params.set('startDate', dateRange[0].toISOString());
    let params: any = {
      pageIndex,
      pageLimit,
      // startDate: dateRange && dateRange.length > 0 ? dateRange[0].toISOString() : null,
      // endDate: dateRange && dateRange.length > 1 ? dateRange[1].toISOString() : null
    };
    if (dateRange && dateRange.length === 2) {
      // params = params.set('startDate', dateRange[0].toISOString());
      const startDateUTC = new Date(Date.UTC(dateRange[0].getFullYear(), dateRange[0].getMonth(), dateRange[0].getDate(), 0, 0, 0));
      const endDateUTC = new Date(Date.UTC(dateRange[1].getFullYear(), dateRange[1].getMonth(), dateRange[1].getDate(), 23, 59, 59, 999));
      params['startDate'] = startDateUTC.toISOString();
      params['endDate'] = endDateUTC.toISOString();
      // params = params.set('endDate', dateRange[1].toISOString());
    }
    const obs$ = this.http.get<ICoestiVentaStockResponse>(`${environment.backendUrl}/api/v1/carga/coesti`, { params });
    return firstValueFrom(obs$);
  }  
}
