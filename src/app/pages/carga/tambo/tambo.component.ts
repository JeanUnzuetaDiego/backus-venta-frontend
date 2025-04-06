import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { UploadDataService } from '../../../components/shared/excel-upload/upload-data.service';

@Component({
  selector: 'app-tambo',
  standalone: true,
  imports: [CommonModule, NzTableModule, NzButtonModule, NzIconModule, NzDatePickerModule],
  templateUrl: './tambo.component.html',
  styleUrl: './tambo.component.scss'
})
export class TamboComponent {
  size: 'large' | 'small' | 'default' = 'default';
  data: any = [];
  
  constructor(
    private router: Router,
    private uploadDataService: UploadDataService
  ) { }

  ngOnInit() {
    this.uploadDataService.data = "tambo";
  }
  uploadFile() {
    this.router.navigate(['/cargar/excel'], { queryParams: { entity: this.uploadDataService.data } });
  }
}
