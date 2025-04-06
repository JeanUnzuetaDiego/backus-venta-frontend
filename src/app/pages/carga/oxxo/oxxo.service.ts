import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../../environments/environment';
import { IOxxoVentaStockResponse } from '../../dto/oxxoVentaStock.dto';

@Injectable({
  providedIn: 'root'
})
export class OxxoService {

  constructor(private http: HttpClient) { }

  public getOxxoVentaStock(pageIndex?: number, pageLimit?: number, dateRange?: Date[]): Promise<IOxxoVentaStockResponse> {
    let params: any = { pageIndex, pageLimit };
    if (dateRange && dateRange.length === 2) {
      const startDateUTC = new Date(Date.UTC(dateRange[0].getFullYear(), dateRange[0].getMonth(), dateRange[0].getDate(), 0, 0, 0));
      const endDateUTC = new Date(Date.UTC(dateRange[1].getFullYear(), dateRange[1].getMonth(), dateRange[1].getDate(), 23, 59, 59, 999));
      params['startDate'] = startDateUTC.toISOString();
      params['endDate'] = endDateUTC.toISOString();
    }
    const obs$ = this.http.get<IOxxoVentaStockResponse>(`${environment.backendUrl}/api/v1/carga/oxxo`, { params });
    return firstValueFrom(obs$);
  }  
}
