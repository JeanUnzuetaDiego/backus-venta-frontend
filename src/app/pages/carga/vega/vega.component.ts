import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { UploadDataService } from '../../../components/shared/excel-upload/upload-data.service';

@Component({
  selector: 'app-vega',
  standalone: true,
  imports: [CommonModule, NzTableModule, NzButtonModule, NzIconModule, NzTabsModule, NzDatePickerModule],
  templateUrl: './vega.component.html',
  styleUrl: './vega.component.scss'
})
export class VegaComponent {
  size: 'large' | 'small' | 'default' = 'default';
  data: any= [];
  
  constructor(
    private router: Router,
    private uploadDataService: UploadDataService
  ) { }

  ngOnInit() {
    this.uploadDataService.data = "vega";
  }
  uploadFile(type: string) {
    this.router.navigate(['/cargar/excel'], { queryParams: { entity: this.uploadDataService.data+'-'+type } });
  }
}
