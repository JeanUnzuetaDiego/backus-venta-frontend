import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { UploadDataService } from '../../../components/shared/excel-upload/upload-data.service';
// import { getISOWeek } from 'date-fns';

@Component({
  selector: 'app-tottus',
  standalone: true,
  imports: [CommonModule, NzTableModule, NzButtonModule, NzIconModule, NzDatePickerModule],
  templateUrl: './tottus.component.html',
  styleUrl: './tottus.component.scss'
})
export class TottusComponent {
  size: 'large' | 'small' | 'default' = 'default';
  data = [
    {
      upc: '123456',
      sku: 'SKU001',
      descripcion: 'Descripción del Producto 1',
      marca: 'Marca A',
      modelo: 'Modelo X',
      estado: 'Nuevo',
      umb: 'Unidad',
      surtido: 'Surtido 1',
      nLocal: 'Local 1',
      nombreLocal: 'Nombre Local 1',
      ventaU: 10,
      ventaPublico: 100,
      ventaCosto: 80,
      contribucion: 20,
      inventarioLocales: 5,
      transito: 2,
      vtaPromedio: 15,
      diasInventario: 10,
      invCosto: 50
    },
  ];
  
  constructor(
    private router: Router,
    private uploadDataService: UploadDataService
  ) { }

  ngOnInit() {
    this.uploadDataService.data = "tottus";
  }
  uploadFile() {
    this.router.navigate(['/cargar/excel'], { queryParams: { entity: this.uploadDataService.data } });
  }
}
