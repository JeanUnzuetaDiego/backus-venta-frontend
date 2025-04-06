import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { Router } from '@angular/router';  // Importa Router
import { NzTabPosition } from 'ng-zorro-antd/tabs';
import { NzGridModule } from 'ng-zorro-antd/grid';

@Component({
  selector: 'app-pos-pernod',
  standalone: true,
  imports: [CommonModule, RouterOutlet, NzGridModule],
  templateUrl: './portada-pernod.component.html',
  styleUrls: ['./portada-pernod.component.scss']
})
export class PortadaPernodComponent {
  isCollapsed = false;
  nzTabPosition: NzTabPosition = 'bottom';
  selectedIndex = 27;

  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  log(args: any[]): void {
    console.log(args);
  }
  constructor(private router: Router) { }  // Inyecta Router en el constructor



  ngOnInit(): void {

  }
}