import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SupesaComponent } from './supesa.component';

describe('SupesaComponent', () => {
  let component: SupesaComponent;
  let fixture: ComponentFixture<SupesaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SupesaComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SupesaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
