import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PortadaService {
  private token: string;

  constructor(private http: HttpClient) {
    this.token = localStorage.getItem('token');
  }

  // Obtiene los productos de la portada - Home
  public getProductsPortada(): Promise<any[]> {
    const params: any = { };
    const obs$ = this.http.get<any[]>(`${environment.backendUrl}/api/v1/sales/portada`, { params });
    return firstValueFrom(obs$);
  }
  
}
