import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { IUserAdminDto } from '../dto/userAdmin.dto';

@Injectable({
  providedIn: 'root'
})
export class UsuarioAdminService {
  private token: string;

  constructor(private http: HttpClient) {
    this.token = localStorage.getItem('token');
  }

  public getUsers(pageIndex?: number, pageLimit?: number, filterMenu?: any, rol_id?:any): Promise<any[]> {
    const params: any = {
      pageIndex, pageLimit, rol_id
    };
    const obs$ = this.http.get<any[]>(`${environment.backendUrl}/api/v1/users`, { params });
    return firstValueFrom(obs$);
  }
  
  public createdUser(request: IUserAdminDto): Promise<any[]> {
    const obs$ = this.http.post<any[]>(`${environment.backendUrl}/api/v1/user`, request, {  });
    return firstValueFrom(obs$);
  }

  public updateUser(userId: string, request: IUserAdminDto): Promise<any[]> {
    const obs$ = this.http.put<any[]>(`${environment.backendUrl}/api/v1/user/${userId}`, request, {  });
    return firstValueFrom(obs$);
  }

  public getUser(userId?: string): Promise<any[]> {
    const obs$ = this.http.get<any[]>(`${environment.backendUrl}/api/v1/user/${userId}`, {  });
    return firstValueFrom(obs$);
  }

  public validateUserId(userId?: string): Promise<any[]> {
    const obs$ = this.http.get<any[]>(`${environment.backendUrl}/api/v1/user/validate/${userId}`, {  });
    return firstValueFrom(obs$);
  }

  public deleteUser(userId?: string): Promise<any[]> {
    const obs$ = this.http.delete<any[]>(`${environment.backendUrl}/api/v1/user/${userId}`, {  });
    return firstValueFrom(obs$);
  }
  
}
