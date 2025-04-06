import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from "@angular/common/http";
import { firstValueFrom } from "rxjs";
import { environment } from "./environments/environment";


@Injectable({
  providedIn: 'root'
})
export class FileUploadService {

  constructor(private http: HttpClient) { }

  public async uploadFile(url: string, file: File, fileName: string): Promise<any> {
    const formData = new FormData();
    formData.append('file', file);
    const response = await fetch(`${environment.backendUrl}/api/v1/${url}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: formData
    });
  }

  public async uploadFileETL(data: FormData): Promise<any> {
    try {
      const obs$ = this.http.post<any>(`${environment.backendUrl}/api/v1/carga/file/upload`, data, { });
      return await firstValueFrom(obs$);
    } catch (error) {
      console.error('Error al guardar los datos de precio:', error);
      throw error;
    }
  }

}
