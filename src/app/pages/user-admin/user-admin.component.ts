import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { Router, RouterModule } from '@angular/router';
import { NzListModule } from 'ng-zorro-antd/list';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzPopoverModule } from 'ng-zorro-antd/popover';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { FormsModule } from '@angular/forms';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { NzPaginationModule } from 'ng-zorro-antd/pagination';
import { NzDrawerModule } from 'ng-zorro-antd/drawer';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzDatePickerComponent, NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzSliderModule } from 'ng-zorro-antd/slider';
import { NzModalModule, NzModalService } from 'ng-zorro-antd/modal';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { format, startOfMonth, endOfMonth, setMonth, differenceInCalendarDays, parse } from 'date-fns';
import { es } from 'date-fns/locale';
import { NzMessageService } from 'ng-zorro-antd/message';
import { UsuarioAdminService } from './user-admin.service';
import { EditUserComponent } from './edit-user/edit-user.component';
@Component({
  selector: 'app-user-admin',
  standalone: true,
  imports: [CommonModule, FormsModule, NzPaginationModule, NzDrawerModule, NzAvatarModule, NzToolTipModule, NzPopoverModule, NzButtonModule, NzSliderModule, NzSpinModule, NzIconModule, NzDatePickerModule, NzTableModule, NzInputModule, NzGridModule, NzSelectModule, NzLayoutModule, NzListModule, NzMenuModule, NzTabsModule, RouterModule, NzModalModule, NzCheckboxModule],
  templateUrl: './user-admin.component.html',
  styleUrl: './user-admin.component.scss'
})
export class UserAdminComponent {
  user: any = {};
  pageIndex: number = 1;
  pageSize: number = 10;
  totalRecords: number = 0;
  listUsers: any[] = [];
  loaderUsersTable: boolean = false;
  constructor(
    public usuarioAdminService: UsuarioAdminService,
    private message: NzMessageService,
    private modal: NzModalService,
    private router: Router
  ) {
    
  }
  async ngOnInit() { }

  async ngAfterViewInit() {
    const userStorage = localStorage.getItem('user');
    this.user = userStorage ? JSON.parse(userStorage) : null;
    if (!this.user) {
      this.message.error('No existe token de sesión, por favor inicie sesión');
      this.router.navigate(['']);
    }
    this.loadData();
  }
  
  loadData() {
    this.loaderUsersTable = true;
    this.usuarioAdminService.getUsers(this.pageIndex, this.pageSize).then((data: any) => {
      this.listUsers = data?.data;
      this.totalRecords = data?.totalRecords
      this.loaderUsersTable = false;
    }).catch((error) => {
      this.message.error('Error al cargar los usuarios');
      this.loaderUsersTable = false;
    });
  }

  handlePageEvent(pageIndex: number) {
    this.pageIndex = pageIndex;
    this.loadData();
  }

  addUser(): void {
    const dialogModal = this.modal.create({
      nzTitle: 'Agregar usuario',
      nzContent: EditUserComponent,
      nzFooter: null
    });
    // const instance = dialogModal.getContentComponent();
    // instance.userId = 'sad';
    dialogModal.afterClose.subscribe((result) => {
      if (result) {
        this.message.success('Usuario creado correctamente');
        this.loadData();
      }else if(result === false){
        this.message.error('Error al crear el usuario');
      }
    });
  }

  editUser(userId: string): void {
    const dialogModal = this.modal.create({
      nzTitle: 'Editar usuario',
      nzContent: EditUserComponent,
      nzFooter: null
    });
    // Obtiene la instancia del componente y pasa el userId
    const instance = dialogModal.getContentComponent();
    instance.userId = userId;
    dialogModal.afterClose.subscribe((result) => {
      if (result) {
        this.message.success('Usuario actualizado correctamente');
        this.loadData();
      }
    });
  }

  removeUser(userId: string): void {
    this.modal.confirm({
      nzTitle: `¿Estás seguro que quieres eliminar el usuario ${userId}?`,
      nzOnOk: () =>
        new Promise((resolve, reject) => {
          setTimeout(Math.random() > 0.5 ? resolve : reject, 1000);
          this.usuarioAdminService.deleteUser(userId).then(() => {
            this.message.success('Usuario eliminado correctamente');
            this.loadData();
          }).catch(() => {
            this.message.error('Error al eliminar el usuario');
          });
        }).catch(() => console.log('Oops errors!'))
    });
  }
}
