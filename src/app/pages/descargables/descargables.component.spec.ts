import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DescargablesComponent } from './descargables.component';

describe('DescargablesComponent', () => {
  let component: DescargablesComponent;
  let fixture: ComponentFixture<DescargablesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DescargablesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DescargablesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
