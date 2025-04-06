import { NgModule } from '@angular/core';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzListModule } from 'ng-zorro-antd/list';
import { CommonModule } from '@angular/common';
import { VentasGraficoModalComponent } from './ventas-grafico-modal.component';

@NgModule({
  declarations: [VentasGraficoModalComponent],
  imports: [NzModalModule, NzListModule, CommonModule],
  exports: [VentasGraficoModalComponent]
})
export class VentasGraficoModalModule { }
