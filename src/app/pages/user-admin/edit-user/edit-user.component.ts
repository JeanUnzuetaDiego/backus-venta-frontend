import { Component, Input } from '@angular/core';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { AbstractControl, AsyncValidatorFn, FormBuilder, FormControl, FormGroup, FormsModule, NonNullableFormBuilder, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
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
import { NzDatePickerComponent, NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzSliderModule } from 'ng-zorro-antd/slider';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzMessageService } from 'ng-zorro-antd/message';
import { Observable, Observer } from 'rxjs';
import { NzFormModule } from 'ng-zorro-antd/form';
import { is } from 'date-fns/locale';
import { UsuarioAdminService } from '../user-admin.service';
import { IUserAdminDto } from '../../dto/userAdmin.dto';

@Component({
  selector: 'app-edit-user',
  standalone: true,
  imports: [ReactiveFormsModule, NzFormModule, CommonModule, FormsModule, NzPaginationModule, NzDrawerModule, NzAvatarModule, NzToolTipModule, NzPopoverModule, NzButtonModule, NzSliderModule, NzSpinModule, NzIconModule, NzDatePickerModule, NzTableModule, NzInputModule, NzGridModule, NzSelectModule, NzLayoutModule, NzListModule, NzMenuModule, NzTabsModule, RouterModule, NzCheckboxModule],
  templateUrl: './edit-user.component.html',
  styleUrl: './edit-user.component.scss'
})
export class EditUserComponent {
  @Input() userId: string; 
  isEdit: boolean = false;
  isActiveUser: boolean = false;
  isLoadingAction: boolean = false;
  userRequest: IUserAdminDto = {};
  validateForm: FormGroup<{
    user_id: FormControl<string>;
    name: FormControl<string>;
    email: FormControl<string>;
    password: FormControl<string>;
    confirm: FormControl<string>;
    role: FormControl<string>;
    activate: FormControl<boolean>;
  }>;
  constructor(
    private fb: NonNullableFormBuilder,
    public usuarioAdminService: UsuarioAdminService,
    private modalRef: NzModalRef
  ) {
    
    
  }

  ngOnInit(): void {
    this.isEdit = this.userId ? true : false;
    this.validateForm = this.fb.group({
      user_id: ['', [Validators.required], this.isEdit ? [] : [this.userNameAsyncValidator]],
      // user_id: ['', [Validators.required]],
      name: ['', [Validators.required]],
      email: ['', [Validators.email, Validators.required]],
      password: ['', []],
      confirm: ['', []],
      role: ['', [Validators.required]],
      activate: [false, []]
    });
    //obtener el usuario
    if(this.isEdit){
      this.validateForm.get('user_id').disable();
      this.usuarioAdminService.getUser(this.userId).then((response: any) => {
        this.validateForm.patchValue(response.data);
        this.validateForm.controls['password'].setValue(null);
        this.validateForm.controls['confirm'].setValue(null);
        this.validateForm.controls.password.setValidators([]);
        this.validateForm.controls.confirm.setValidators([this.confirmValidatorEdit]);
        this.isActiveUser = response.data.activate;
        // this.validateForm.controls.user_id.setValidators([this.userNameAsyncValidator]);
      }).catch((error) => {
        console.log('error-getUser', error);
      });
    }else{
      // this.validateForm.controls.user_id.setValidators([this.userNameAsyncValidator]);
      this.validateForm.controls.password.setValidators([Validators.required]);
      this.validateForm.controls.confirm.setValidators([this.confirmValidator]);
    }
    
  }

  closeModal(e: MouseEvent) : void{
    e.preventDefault();
    this.modalRef.destroy();
  }

  submitForm(): void {
    this.userRequest.user_id = this.validateForm.value.user_id;
    this.userRequest.name = this.validateForm.value.name;
    this.userRequest.email = this.validateForm.value.email;
    this.userRequest.password = this.validateForm.value.password;
    this.userRequest.role = this.validateForm.value.role;
    this.userRequest.activate = this.validateForm.value.activate;
    this.isLoadingAction = true;
    if(this.isEdit){
      //editar usuario
      this.usuarioAdminService.updateUser(this.userId, this.userRequest).then((response: any) => {
        this.isLoadingAction = false;
        this.modalRef.destroy(true);
      }).catch((error) => {
        console.log('error', error);
      });
      // return;
    }else{
      //crear usuario
      this.usuarioAdminService.createdUser(this.userRequest).then((response: any) => {
        this.isLoadingAction = false;
        this.modalRef.destroy(true);
      }).catch((error) => {
        console.log('error', error);
      });
    }
  }

  resetForm(e: MouseEvent): void {
    e.preventDefault();
    this.validateForm.reset();
    
  }

  validateConfirmPassword(): void {
    setTimeout(() => this.validateForm.controls.confirm.updateValueAndValidity());
  }

  userNameAsyncValidator: AsyncValidatorFn = (control: AbstractControl) =>
    new Observable((observer: Observer<ValidationErrors | null>) => {
      this.usuarioAdminService.validateUserId(control.value).then((response: any) => {
        if (!response?.success) {
          observer.next({ error: true, duplicated: true });
        } else {
          observer.next(null);
        }
        observer.complete();
      }).catch((error) => {
        console.log('error', error);
      });
    });

  confirmValidatorEdit: ValidatorFn = (control: AbstractControl) => {
      if (control.value !== this.validateForm.controls.password.value) {
        return { confirm: true, error: true };
      }
      return {};
    };
 
  checkChange(value: boolean){
    this.isActiveUser = value;
  }
  confirmValidator: ValidatorFn = (control: AbstractControl) => {
    if (!control.value) {
      return { error: true, required: true };
    } else if (control.value !== this.validateForm.controls.password.value) {
      return { confirm: true, error: true };
    }
    return {};
  };

  
}
