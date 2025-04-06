import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { UploadDataService } from '../../../components/shared/excel-upload/upload-data.service';

@Component({
  selector: 'app-supesa',
  standalone: true,
  imports: [CommonModule, NzButtonModule, NzTableModule, NzIconModule, NzDatePickerModule, NzTabsModule],
  templateUrl: './supesa.component.html',
  styleUrl: './supesa.component.scss'
})
export class SupesaComponent {
  size: 'large' | 'small' | 'default' = 'default';
  data: any = [];

  constructor(
    private router: Router,
    private uploadDataService: UploadDataService
  ) {}

  ngOnInit() {
    this.uploadDataService.data = 'supesa';
  }

  uploadFile(type: string) {
    this.router.navigate(['/cargar/excel'], { queryParams: { entity: this.uploadDataService.data+'-'+type } });
  }
}
