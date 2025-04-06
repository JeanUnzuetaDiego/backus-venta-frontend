import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, firstValueFrom, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';
import * as jwt_decode from 'jwt-decode';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class PermisosService {
  constructor(
    private http: HttpClient,
    private route: Router
    ) {}

    public async getPermisos(): Promise<any> {
      try {
        const headers = new HttpHeaders({
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        });
        const response = await this.http.get<any>(`${environment.backendUrl}/api/v1/config/permisos`, {  })
          .pipe(
            catchError(error => throwError(error))
          )
          .toPromise();
        return response;
      } catch (error) {
        if (error instanceof HttpErrorResponse) {
          return error.error;
        }
        throw error;
      }
    }
    public async updatePermisos(permiso:any): Promise<any> {
      try {
        const headers = new HttpHeaders({
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        });
        const response = await this.http.put<any>(`${environment.backendUrl}/api/v1/config/permisos`,{permiso}, {  })
          .pipe(
            catchError(error => throwError(error))
          )
          .toPromise();
        return response;
      } catch (error) {
        if (error instanceof HttpErrorResponse) {
          return error.error;
        }
        throw error;
      }
    }
}
