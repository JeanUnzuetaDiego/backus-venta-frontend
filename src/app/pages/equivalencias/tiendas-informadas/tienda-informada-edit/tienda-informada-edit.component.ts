import { Component, Input } from '@angular/core';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { FormControl, FormGroup, FormsModule, NonNullableFormBuilder, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
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
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { NzPaginationModule } from 'ng-zorro-antd/pagination';
import { NzDrawerModule } from 'ng-zorro-antd/drawer';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzSliderModule } from 'ng-zorro-antd/slider';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzMessageService } from 'ng-zorro-antd/message';
import { Observable, Observer } from 'rxjs';
import { NzFormModule } from 'ng-zorro-antd/form';
import { da, is } from 'date-fns/locale';
import { TiendasInformadasService } from '../tiendas-informadas.service';
import { IPocInformado } from '../../../dto/pocInformado.dto';
import { format } from 'date-fns';

@Component({
  selector: 'app-tienda-informada-edit',
  standalone: true,
  imports: [ReactiveFormsModule, NzFormModule, CommonModule, FormsModule, NzPaginationModule, NzDrawerModule, NzAvatarModule, NzToolTipModule, NzPopoverModule, NzButtonModule, NzSliderModule, NzSpinModule, NzIconModule, NzDatePickerModule, NzTableModule, NzInputModule, NzGridModule, NzSelectModule, NzLayoutModule, NzListModule, NzMenuModule, NzTabsModule, RouterModule, NzCheckboxModule],
  templateUrl: './tienda-informada-edit.component.html',
  styleUrl: './tienda-informada-edit.component.scss'
})
export class TiendaInformadaEditComponent {
  @Input() cadena_id: string; 
  @Input() poc_cadena: string; 

  isLoadingAction: boolean = false;
  pocInformadoRequest: IPocInformado = {};
  isLoading = false;
  user: any = {};

  validateForm: FormGroup<{
    cadena_id: FormControl<string>;
    poc_cadena: FormControl<string>;
    poc_backus: FormControl<string>;
    nombre_cadena: FormControl<string>;
    nombre_backus: FormControl<string>;
    direccion_backus: FormControl<string>;
    gerencia_backus: FormControl<string>;
    cadena_backus: FormControl<string>;
    subcadena_backus: FormControl<string>;
    kam_backus: FormControl<string>;
    usuario_id_creacion: FormControl<string>;
    usuario_id_modificacion: FormControl<string>;
    fecha_tiempo_creacion: FormControl<string>;
    fecha_tiempo_modificacion: FormControl<string>;
  }>;

  constructor(
    private fb: NonNullableFormBuilder,
    private modalRef: NzModalRef,
    private message: NzMessageService,
    private tiendasInformadasService: TiendasInformadasService
  ) {
    this.validateForm = this.fb.group({
      cadena_id: ['', [Validators.required] ],
      poc_cadena: ['', [Validators.required] ],
      poc_backus: ['', [] ],
      nombre_cadena: ['', [] ],
      nombre_backus: ['', [] ],
      direccion_backus: ['', [] ],
      gerencia_backus: ['', [] ],
      cadena_backus: ['', [] ],
      subcadena_backus: ['', [] ],
      kam_backus: ['', [] ],
      usuario_id_creacion: ['', [] ],
      usuario_id_modificacion: ['', [] ],
      fecha_tiempo_creacion: ['', [] ],
      fecha_tiempo_modificacion: ['', [] ]
    });
  }

  ngOnInit(): void {
    const userStorage = localStorage.getItem('user');
    this.user = userStorage ? JSON.parse(userStorage) : null;
    this.loadData();
  }

  loadData() {
    this.isLoading = true;
    this.validateForm.get('cadena_id').disable();
    this.validateForm.get('poc_cadena').disable();
    this.validateForm.get('usuario_id_creacion').disable();
    this.validateForm.get('usuario_id_modificacion').disable();
    this.validateForm.get('fecha_tiempo_creacion').disable();
    this.validateForm.get('fecha_tiempo_modificacion').disable();
    this.tiendasInformadasService.configurationGetTienda(this.cadena_id, this.poc_cadena).then((data: any) => {
      if(data?.data){
        data.data[0].fecha_tiempo_creacion = data.data[0].fecha_tiempo_creacion ? format(data.data[0].fecha_tiempo_creacion, 'yyyy-MM-dd HH:mm:ss') : null;
        data.data[0].fecha_tiempo_modificacion = data.data[0].fecha_tiempo_modificacion ? format(data.data[0].fecha_tiempo_modificacion, 'yyyy-MM-dd HH:mm:ss') : null;
        this.validateForm.patchValue(data.data[0]);
      }
    this.isLoading = false;

    }).catch((error) => {
      this.isLoading = false;
      this.message.error('Error al cargar los usuarios');
    });
  }

  submitForm(): void {
    this.isLoadingAction = true;
    this.pocInformadoRequest.cadena_id = this.validateForm.value.cadena_id;
    this.pocInformadoRequest.poc_cadena = this.validateForm.value.poc_cadena;
    this.pocInformadoRequest.poc_backus = this.validateForm.value.poc_backus;
    this.pocInformadoRequest.nombre_cadena = this.validateForm.value.nombre_cadena;
    this.pocInformadoRequest.nombre_backus = this.validateForm.value.nombre_backus;
    this.pocInformadoRequest.direccion_backus = this.validateForm.value.direccion_backus;
    this.pocInformadoRequest.gerencia_backus = this.validateForm.value.gerencia_backus;
    this.pocInformadoRequest.cadena_backus = this.validateForm.value.cadena_backus;
    this.pocInformadoRequest.subcadena_backus = this.validateForm.value.subcadena_backus;
    this.pocInformadoRequest.kam_backus = this.validateForm.value.kam_backus;
    this.pocInformadoRequest.usuario_id_modificacion = this.user?.usuario_id;

    this.tiendasInformadasService.configurationUpdatePoc(this.cadena_id, this.poc_cadena, this.pocInformadoRequest).then((response: any) => {
      this.isLoadingAction = false;
      this.modalRef.destroy(true);
    }).catch((error) => {
      this.isLoadingAction = false;
      this.message.error('Error al actualizar el sku informado');
    });

  }


  closeModal(e: MouseEvent) : void{
    e.preventDefault();
    this.modalRef.destroy();
  }
}
