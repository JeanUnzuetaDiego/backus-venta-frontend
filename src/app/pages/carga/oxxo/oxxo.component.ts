import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzPaginationModule } from 'ng-zorro-antd/pagination';
import { NzMessageService } from 'ng-zorro-antd/message';
import { UploadDataService } from '../../../components/shared/excel-upload/upload-data.service';
import { OxxoService } from './oxxo.service';
import { IOxxoVentaStock } from '../../dto/oxxoVentaStock.dto';

@Component({
  selector: 'app-oxxo',
  standalone: true,
  imports: [CommonModule, FormsModule, NzButtonModule, NzTableModule, NzIconModule, NzDatePickerModule, NzPaginationModule],
  templateUrl: './oxxo.component.html',
  styleUrl: './oxxo.component.scss',
})
export class OxxoComponent {
  loaderTable: boolean = false;
  listOxxoVentaStock: IOxxoVentaStock[] = [];
  pageIndex: number = 1;
  pageSize: number = 10;
  totalRecords: number = 0;
  dateRange: Date[] = [];

  constructor(
    private router: Router,
    private uploadDataService: UploadDataService,
    private oxxoService: OxxoService,
    private message: NzMessageService,
  ) {}

  ngOnInit() {
    this.uploadDataService.data = 'oxxo';
    this.setDefaultDateRange();
    this.loadData();
  }

  async ngAfterViewInit() {}

  setDefaultDateRange() {
    const today = new Date();
    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);

    this.dateRange = [firstDayOfMonth, yesterday];
  }

  loadData() {
    this.loaderTable = true;
    this.oxxoService.getOxxoVentaStock(this.pageIndex, this.pageSize, this.dateRange).then((data) => {
      this.listOxxoVentaStock = data?.data;
      this.totalRecords = data?.totalRecords;
      this.loaderTable = false;
    }).catch((error) => {
      this.message.error('Error al cargar los usuarios', error);
      this.loaderTable = false;
    });
  }

  handlePageEvent(pageIndex: number) {
    this.pageIndex = pageIndex;
    this.loadData();
  }

  setFixedToNumber(colum: any) {
    return parseFloat(colum).toLocaleString('en-US', {});
  }

  nzDisabledDate = (current: Date): boolean => {
    return current && current >= new Date(new Date().setHours(0, 0, 0, 0));
  }

  onDateRangeChange(result: Date[]): void {
    if (result && result.length === 2) {
      const startDate = new Date(result[0].getFullYear(), result[0].getMonth(), result[0].getDate(), 0, 0, 0);
      const endDate = new Date(result[1].getFullYear(), result[1].getMonth(), result[1].getDate(), 23, 59, 59, 999);
      this.dateRange = [startDate, endDate];
      this.loadData();
    }
  }

  uploadFile(type: string) {
    this.router.navigate(['/cargar/excel'], { queryParams: { entity: this.uploadDataService.data+'-'+type } });
  }
}
