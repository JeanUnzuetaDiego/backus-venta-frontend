import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TiendaInformadaEditComponent } from './tienda-informada-edit.component';

describe('TiendaInformadaEditComponent', () => {
  let component: TiendaInformadaEditComponent;
  let fixture: ComponentFixture<TiendaInformadaEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TiendaInformadaEditComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TiendaInformadaEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
