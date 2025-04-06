import { Component, OnInit } from '@angular/core';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzPaginationModule } from 'ng-zorro-antd/pagination';
import { NzProgressModule } from 'ng-zorro-antd/progress';
import { DescargablesService } from './descargables.service';
import { NzTableModule } from 'ng-zorro-antd/table';
import { CommonModule } from '@angular/common';
import { ServerSentEventService } from '../../services/server-sent-event.service';
@Component({
  selector: 'app-descargables',
  standalone: true,
  imports: [CommonModule,NzPaginationModule,NzProgressModule,NzIconModule, NzTableModule],
  templateUrl: './descargables.component.html',
  styleUrl: './descargables.component.scss'
})
export class DescargablesComponent {
  folders:any[] = []
  listOfData: any[] = []
  page = 1
  limit = 15
  total = 0
  user = JSON.parse(localStorage.getItem('user'))
  rol_id = this.user.role
  loadingMessage = '';
  loaderAutogestionTable= false
  uploadProgressPercentage = 0;
  stats?: {user: number, direccion: number, gerencia: number, tienda: number, subcadena: number, sku: number, skuB2b: number,bitacora: number, edlp: number, venta: number};
  dates?: {user: string, direccion: string, gerencia: string, tienda: string, subcadena: string, sku: string, skuB2b: string, bitacora: string, edlp: string, venta: string};
  loading = false;
  success = false;
  error = false;
  actor = 'gio'

  constructor(private descargablesService: DescargablesService,private sseService: ServerSentEventService,) {
    
  }

  ngOnInit(){
    this.load()
    /*this.sseService.getServerSentEventStatus('gio').subscribe(event => {
      console.log(event)
      if (event.data == 'start') localStorage.setItem('status_progress', JSON.stringify({status: event.data}));
    });*/

  }
  pageIndexChange(page: number): void {
    this.page = page;
    console.log('page:', page);
    this.load();
  }
  async load(){
    try {
      const user = JSON.parse(localStorage.getItem('user'))
      this.loaderAutogestionTable = true
      const response = await this.descargablesService.getDescargables(this.page,this.limit, this.rol_id, user.usuario_id);
      this.listOfData = response.data;
      this.total = response.total
      this.loaderAutogestionTable = false
    } catch (error) {
      console.error('Error al obtener los permisos:', error);
    }
  }
}
