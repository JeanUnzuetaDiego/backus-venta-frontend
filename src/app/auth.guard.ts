import { CanActivateFn } from '@angular/router';
import {jwtDecode} from 'jwt-decode';
import { Router } from '@angular/router';


export const authGuard = () => {
  const router = new Router()
  const token  = localStorage.getItem('token')
  const isValid = isTokenValid(token)
  if(isValid){
    return true;
  }else{
    router.navigate([""])
    return false

  }
};

const isTokenValid = (token: string): boolean  => {
  try {
    const decodedToken: any = jwtDecode(token);

    if (decodedToken.exp * 1000 < Date.now()) {
      return false; // El token ha expirado
    }

    return true; // El token es válido
  } catch (error) {
    return false; // Token inválido
  }
}

