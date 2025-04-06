import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../environments/environment';
import { UserDto } from '../dto/user.dto';
import * as jwt_decode from 'jwt-decode';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(
    private http: HttpClient,
    private route: Router
    ) {}

  public async login(user: UserDto) {
    try {
      const result = await firstValueFrom(this.http.post(`${environment.backendUrl}/api/v1/login`, user)) as any;
      localStorage.setItem('token', result.token);
      const findUser = result.user.user;
      const findConfigRol = result.user.configRol;
      localStorage.setItem('user', JSON.stringify({role: findUser.role, usuario_id: findUser.user_id, nombre: findUser.name, configRol: findConfigRol}));
      return { success: true };
    } catch (error) {
      if (error instanceof HttpErrorResponse) {
        return error.error;
      }
    }
    return { success: true };
  }
  public async validaToken() {
    try {
      const result = await firstValueFrom<any>(this.http.get(`${environment.backendUrl}/api/v1/user/admin-table-count`,{
      params:{page:1},
      // headers: {
      //   Authorization: `Bearer ${this.getToken()}`
      // }
    }))
      return result;
    } catch (error) {
      if (error instanceof HttpErrorResponse) {
        return error.error;
      }
    }
    return { success: true };
  }
  public getToken() {
     const token = localStorage.getItem('token');

    if (!token) {
      return null;
    }

    // const data = jwt_decode(token) as any;
    const data = {exp: 12};

    if (Date.now() >= data.exp * 1000) {
      localStorage.removeItem('token');
      return null;
    }

    return token;
  }

  public getUser() {
    const data = localStorage.getItem('user');

    if (!data) {
      return null;
    }

    const user = JSON.parse(data);

    return user;
  }

  public getRole() {
    const user = this.getUser();
    return user.role;
  }

  public getLastVisitedUrl() {
    return localStorage.getItem('lastVisitedUrl');
  }

  public setLastVisitedUrl(url: string) {
    localStorage.setItem('lastVisitedUrl', url);
  }

  public logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.route.navigate([""]);
  }
}
