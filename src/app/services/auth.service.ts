import { Injectable, OnDestroy } from '@angular/core';
import { fromEvent, Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
    getToken(): string | null {
      return localStorage.getItem('token');
    }
  
    isTokenExpired(): boolean {
      const token = this.getToken();
      if (!token) {
        return true;
      }
  
      const tokenPayload = JSON.parse(atob(token.split('.')[1]));
      const expiration = tokenPayload.exp * 1000; // Convertir a milisegundos
      return Date.now() >= expiration;
    }

    removeToken(): void {
        localStorage.removeItem('token');
    }

  }