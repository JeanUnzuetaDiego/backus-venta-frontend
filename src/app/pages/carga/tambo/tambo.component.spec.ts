import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TamboComponent } from './tambo.component';

describe('TamboComponent', () => {
  let component: TamboComponent;
  let fixture: ComponentFixture<TamboComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TamboComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TamboComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
