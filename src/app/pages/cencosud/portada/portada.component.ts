import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { Router } from '@angular/router';  // Importa Router
import { NzTabPosition } from 'ng-zorro-antd/tabs';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { PortadaService } from './portada.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzSpinModule } from 'ng-zorro-antd/spin';

@Component({
  selector: 'app-portada',
  standalone: true,
  imports: [CommonModule, RouterOutlet, NzGridModule, NzSpinModule],
  templateUrl: './portada.component.html',
  styleUrls: ['./portada.component.scss']
})
export class PortadaComponent {
  isCollapsed = false;
  nzTabPosition: NzTabPosition = 'bottom';
  selectedIndex = 27;
  user: any = {};
  today = new Date();
  dataProductPortadas: any = [];

  log(args: any[]): void {
    console.log(args);
  }
  constructor(
    private router: Router,
    public portadaService: PortadaService,
    private message: NzMessageService
  ) { }  // Inyecta Router en el constructor

  isLoginPage(): boolean {
    return this.router.url === '/login'; 
  }

  ngOnInit(): void {

  }

  async ngAfterViewInit() {
    const userStorage = localStorage.getItem('user');
    this.user = userStorage ? JSON.parse(userStorage) : null;
    if (!this.user) {
      this.message.error('No existe token de sesión, por favor inicie sesión');
      this.router.navigate(['']);
    }
    this.loadData();
  }

  async loadData(){
    //carga los productos de la portada
    const resultData: any = await this.portadaService.getProductsPortada();
    this.dataProductPortadas = resultData;

  }

}
