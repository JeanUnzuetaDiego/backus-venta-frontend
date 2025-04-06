import { Component, OnInit, AfterViewInit,  } from '@angular/core';
import { AuthService } from '../main/auth.service';
import { Router } from '@angular/router';
import { NzFormModule } from 'ng-zorro-antd/form';
import { FormControl, FormGroup, ReactiveFormsModule, NonNullableFormBuilder, Validators } from '@angular/forms';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalModule, NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { jwtDecode } from 'jwt-decode';


@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.component.html',
  imports: [ NzFormModule, NzInputModule, ReactiveFormsModule, NzButtonModule, NzModalModule ],
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  code = new FormControl('', [Validators.required]);
  password = new FormControl('', [Validators.required]);
  errorMessage = '';
  hide = true;
  loading = false;
  isVisible = false;
  modalRef!: NzModalRef;
  deviceInfo = {
    userAgent: navigator.userAgent,
    platform: navigator.platform,
    forceSession: false
  };
  validateForm: FormGroup<{
    userName: FormControl<string>;
    password: FormControl<string>;
  }> = this.fb.group({
    userName: ['', [Validators.required]],
    password: ['', [Validators.required]],
  });

  constructor(
    private router: Router,
    private authService: AuthService,
    private fb: NonNullableFormBuilder,
    private message: NzMessageService,
    private modalService: NzModalService
  ) {
  }

  
  async ngOnInit() {
    const token = localStorage.getItem('token');
    await this.isTokenValid(token) ? this.router.navigate(['/mt/portada']) : ''
  }
  isTokenValid(token: string | null): boolean {
    if (!token) return false;

    try {
      const decodedToken: any = jwtDecode(token);
      return decodedToken.exp * 1000 >= Date.now();
    } catch (error) {
      return false;
    }
  }
  async submitForm() {
    if (this.validateForm.valid) {
      this.loading = true;
      const result = await this.authService.login({
        user_id: this.validateForm.value.userName,
        password: this.validateForm.value.password,
        deviceInfo: this.deviceInfo,
      });

      if (result.success) {
        this.router.navigate(['mt/portada']);
      } else {
        if(result.error.includes('sesión iniciada en otro dispositivo')){
          this.showConfirm()
        }
        if(result.error == 'Incorrect password'){
          this.message.error('Contraseña incorrecta')
        }else{
          this.message.error('Usuario incorrecto')
        }
      }

      this.loading = false;
    } else {
      Object.values(this.validateForm.controls).forEach(control => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
    }
  }

  showModal(): void {
    this.isVisible = true;
  }

  handleOk(): void {
    this.isVisible = false;
  }

  handleCancel(): void {
    this.isVisible = false;
  }

  showConfirm(): void {
    this.modalRef = this.modalService.confirm({
      nzTitle: 'Inicio de sesión',
      nzContent: 'Tiene una sesión ya iniciada en otro dispositivo con este usuario, ¿desea cerrar sesión en los otros dispositivos?',
      nzOkText: 'OK',
      nzCancelText: 'Cancel',
      nzOnOk: () => {
        this.deviceInfo.forceSession = true
        this.submitForm()
      },
      nzOnCancel: () => console.log('Cancel pulsado')
    });
  }

  redirectToLastVisitedUrl() {
    const url = this.authService.getLastVisitedUrl() ?? 'promocion';
    this.router.navigate(url.split('/').filter(f => f));
  }
}
