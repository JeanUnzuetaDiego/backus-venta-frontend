import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UtilService {

  constructor() { }

  formatearNumeroConComas(numero: number|string): string {
    if (numero === null || numero === undefined) return ''
    numero = typeof numero === 'string' ? parseFloat(numero) : numero;
    const partes = numero.toString().split('.');
    partes[0] = partes[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    return partes.join('.');
  }

  redondearNumeroDosDecimalesx100(numero: number): number {
    // Esta es la forma más correcta de redondear un número con JavaScript, to fixed no cumple su fución correctamente.
    return Math.round(numero * 100 * 100) / 100;
  };

  convertirNumeroCuatroDecimalesEntre100(numero: number): number {
    return Math.round((numero / 100) * 10 ** 4) / 10 ** 4;
  };
}
