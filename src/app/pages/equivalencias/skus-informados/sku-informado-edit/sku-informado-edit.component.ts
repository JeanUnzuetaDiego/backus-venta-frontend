import { Component, Input } from '@angular/core';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { FormControl, FormGroup, FormsModule, NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { RouterModule } from '@angular/router';
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
import { NzFormModule } from 'ng-zorro-antd/form';
import { SkusInformadosService } from '../skus-informados.service';
import { SkuInformadoDto } from '../../../dto/skuInformado.dto';
import { format } from 'date-fns';

@Component({
  selector: 'app-sku-informado-edit',
  standalone: true,
  imports: [ReactiveFormsModule, NzFormModule, CommonModule, FormsModule, NzPaginationModule, NzDrawerModule, NzAvatarModule, NzToolTipModule, NzPopoverModule, NzButtonModule, NzSliderModule, NzSpinModule, NzIconModule, NzDatePickerModule, NzTableModule, NzInputModule, NzGridModule, NzSelectModule, NzLayoutModule, NzListModule, NzMenuModule, NzTabsModule, RouterModule, NzCheckboxModule],
  templateUrl: './sku-informado-edit.component.html',
  styleUrl: './sku-informado-edit.component.scss'
})
export class SkuInformadoEditComponent {
  @Input() cadena_id: string; 
  @Input() sku_cadena: string; 

  isLoadingAction: boolean = false;
  skuInformadoRequest: SkuInformadoDto = {};
  isLoading = false;
  user: any = {};

  validateForm: FormGroup<{
    cadena_id: FormControl<string>;
    sku_cadena: FormControl<string>;
    sku_backus: FormControl<string>;
    descripcion_cadena: FormControl<string>;
    descripcion_backus: FormControl<string>;
    descripcion_norma_backus: FormControl<string>;
    categoria_backus: FormControl<string>;
    subcategoria_backus: FormControl<string>;
    kpi_backus: FormControl<string>;
    marca_backus: FormControl<string>;
    tipo_backus: FormControl<string>;
    unidad_cadena: FormControl<number>;
    unidad_backus: FormControl<number>;
    capacidad_backus: FormControl<number>;
    capacidad_norma_backus: FormControl<string>;
    tipo_envase_backus: FormControl<string>;
    formato_backus: FormControl<string>;
    formato_norma_backus: FormControl<string>;
    formato_venta_backus: FormControl<string>;
    factor_conversion_cencosud_backus: FormControl<number>;
    serve_backus: FormControl<string>;
    cobertura_backus: FormControl<number>;
    produccion_backus: FormControl<string>;
    kpi_formato_backus: FormControl<string>;
    envase_backus: FormControl<string>;
    stock_out_backus: FormControl<number>;
    factor_conversion_cambio_corona_backus: FormControl<string>;
    usuario_id_creacion: FormControl<string>;
    usuario_id_modificacion: FormControl<string>;
    fecha_tiempo_creacion: FormControl<string>;
    fecha_tiempo_modificacion: FormControl<string>;
  }>;

  constructor(
    private fb: NonNullableFormBuilder,
    private modalRef: NzModalRef,
    private message: NzMessageService,
    private skusInformadosService: SkusInformadosService
  ) {
    this.validateForm = this.fb.group({
      cadena_id: ['', [Validators.required] ],
      sku_cadena: ['', [Validators.required] ],
      sku_backus: ['', [] ],
      descripcion_cadena: ['', [] ],
      descripcion_backus: ['', [] ],
      descripcion_norma_backus: ['', [] ],
      categoria_backus: ['', [] ],
      subcategoria_backus: ['', [] ],
      kpi_backus: ['', [] ],
      marca_backus: ['', [] ],
      tipo_backus: ['', [] ],
      unidad_cadena: [0, [] ],
      unidad_backus: [0, [] ],
      capacidad_backus: [0, [] ],
      capacidad_norma_backus: ['', [] ],
      tipo_envase_backus: ['', [] ],
      formato_backus: ['', [] ],
      formato_norma_backus: ['', [] ],
      formato_venta_backus: ['', [] ],
      factor_conversion_cencosud_backus: [0, [] ],
      serve_backus: ['', [] ],
      cobertura_backus: [0, [] ],
      produccion_backus: ['', [] ],
      kpi_formato_backus: ['', [] ],
      envase_backus: ['', [] ],
      stock_out_backus: [0, [] ],
      factor_conversion_cambio_corona_backus: ['', [] ],
      usuario_id_creacion: ['', [] ],
      usuario_id_modificacion: ['', [] ],
      fecha_tiempo_creacion: ['', [] ],
      fecha_tiempo_modificacion: ['', [] ]
    });
  }

  ngOnInit(): void {
    const userStorage = localStorage.getItem('user');
    this.user = userStorage ? JSON.parse(userStorage) : null;
    console.log("user=>",this.user);
    this.loadData();
  }

  async ngAfterViewInit() {
  }

  loadData() {
    this.isLoading = true;
    this.validateForm.get('cadena_id').disable();
    this.validateForm.get('sku_cadena').disable();
    this.validateForm.get('usuario_id_creacion').disable();
    this.validateForm.get('usuario_id_modificacion').disable();
    this.validateForm.get('fecha_tiempo_creacion').disable();
    this.validateForm.get('fecha_tiempo_modificacion').disable();
    this.skusInformadosService.configurationGetSkuInformados(this.cadena_id, this.sku_cadena).then((data: any) => {
      if(data?.data){
        data.data[0].fecha_tiempo_creacion = data.data[0].fecha_tiempo_creacion ? format(data.data[0].fecha_tiempo_creacion, 'yyyy-MM-dd HH:mm:ss') : null;
        data.data[0].fecha_tiempo_modificacion = data.data[0].fecha_tiempo_modificacion ? format(data.data[0].fecha_tiempo_modificacion, 'yyyy-MM-dd HH:mm:ss') : null;
        this.validateForm.patchValue(data.data[0]);
      }
      this.isLoading = false;

    }).catch((error) => {
      this.message.error('Error al cargar los usuarios');
      this.isLoading = false;

    });
  }


  submitForm(): void {
    this.isLoadingAction = true;
    this.skuInformadoRequest.cadena_id = this.validateForm.value.cadena_id;
    this.skuInformadoRequest.sku_cadena = this.validateForm.value.sku_cadena;
    this.skuInformadoRequest.sku_backus = this.validateForm.value.sku_backus;
    this.skuInformadoRequest.descripcion_cadena = this.validateForm.value.descripcion_cadena;
    this.skuInformadoRequest.descripcion_backus = this.validateForm.value.descripcion_backus;
    this.skuInformadoRequest.descripcion_norma_backus = this.validateForm.value.descripcion_norma_backus;
    this.skuInformadoRequest.categoria_backus = this.validateForm.value.categoria_backus;
    this.skuInformadoRequest.subcategoria_backus = this.validateForm.value.subcategoria_backus;
    this.skuInformadoRequest.kpi_backus = this.validateForm.value.kpi_backus;
    this.skuInformadoRequest.marca_backus = this.validateForm.value.marca_backus;
    this.skuInformadoRequest.tipo_backus = this.validateForm.value.tipo_backus;
    this.skuInformadoRequest.unidad_cadena = this.validateForm.value.unidad_cadena;
    this.skuInformadoRequest.unidad_backus = this.validateForm.value.unidad_backus;
    this.skuInformadoRequest.capacidad_backus = this.validateForm.value.capacidad_backus;
    this.skuInformadoRequest.capacidad_norma_backus = this.validateForm.value.capacidad_norma_backus;
    this.skuInformadoRequest.tipo_envase_backus = this.validateForm.value.tipo_envase_backus;
    this.skuInformadoRequest.formato_backus = this.validateForm.value.formato_backus;
    this.skuInformadoRequest.formato_norma_backus = this.validateForm.value.formato_norma_backus;
    this.skuInformadoRequest.formato_venta_backus = this.validateForm.value.formato_venta_backus;
    this.skuInformadoRequest.factor_conversion_cencosud_backus = this.validateForm.value.factor_conversion_cencosud_backus;
    this.skuInformadoRequest.serve_backus = this.validateForm.value.serve_backus;
    this.skuInformadoRequest.cobertura_backus = this.validateForm.value.cobertura_backus;
    this.skuInformadoRequest.produccion_backus = this.validateForm.value.produccion_backus;
    this.skuInformadoRequest.kpi_formato_backus = this.validateForm.value.kpi_formato_backus;
    this.skuInformadoRequest.envase_backus = this.validateForm.value.envase_backus;
    this.skuInformadoRequest.stock_out_backus = this.validateForm.value.stock_out_backus;
    this.skuInformadoRequest.factor_conversion_cambio_corona_backus = parseFloat(parseFloat(this.validateForm.value.factor_conversion_cambio_corona_backus).toFixed(10));
    this.skuInformadoRequest.fecha_tiempo_creacion = this.validateForm.value.fecha_tiempo_creacion;
    this.skuInformadoRequest.fecha_tiempo_modificacion = this.validateForm.value.fecha_tiempo_modificacion;
    this.skuInformadoRequest.usuario_id_modificacion = this.user?.usuario_id;
    
    this.skusInformadosService.configurationUpdateSkuInformado(this.cadena_id, this.sku_cadena, this.skuInformadoRequest).then((response: any) => {
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
