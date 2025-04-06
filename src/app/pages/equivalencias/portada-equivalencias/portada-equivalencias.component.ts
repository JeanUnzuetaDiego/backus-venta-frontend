import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { Router, RouterModule } from '@angular/router';
import { NzListModule } from 'ng-zorro-antd/list';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzPopoverModule } from 'ng-zorro-antd/popover';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { FormsModule } from '@angular/forms';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzSliderModule } from 'ng-zorro-antd/slider';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  selector: 'app-portada-equivalencias',
  standalone: true,
  imports: [CommonModule, FormsModule, NzPopoverModule, NzButtonModule, NzSliderModule, NzSpinModule, NzIconModule, NzDatePickerModule, NzTableModule, NzInputModule, NzGridModule, NzSelectModule, NzLayoutModule, NzListModule, NzTabsModule, RouterModule, NzCheckboxModule],
  templateUrl: './portada-equivalencias.component.html',
  styleUrl: './portada-equivalencias.component.scss',
})
export class PortadaEquivalenciasComponent implements OnInit {
  spiner = false;
  dataPortadaEquivalencias: any[] = [];
  loaderPortadaEquivalencias: boolean = false;

  constructor(
    private message: NzMessageService
  ) { }

  ngOnInit(): void {
    this.loadData();
  }

  async loadData() {
    
  }

  
}
