import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, firstValueFrom, throwError } from 'rxjs';
import { environment } from '../../environments/environment';
import * as jwt_decode from 'jwt-decode';
import { Router } from '@angular/router';
import { AuthService } from '../main/auth.service';

@Injectable({
  providedIn: 'root'
})
export class DescargablesService {
  constructor(
    private http: HttpClient,
    private route: Router,
    private authService: AuthService,
    ) {}

    public async getDescargables(page:any, limit:any, rol_id:any, user_id:any): Promise<any> {
      try {

        const body = {
            page,
            limit,
            rol_id,
            user_id
        }

        const headers = new HttpHeaders({
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        });
        const response = await this.http.post<any>(`${environment.backendUrl}/api/v1/descargables`, body, { headers })
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
    public async getTask(id: string): Promise<any> {
      const result = await firstValueFrom(this.http.get(`${environment.backendUrl}/api/v1/task?userId=${id}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      }));
      return result
    }

}
