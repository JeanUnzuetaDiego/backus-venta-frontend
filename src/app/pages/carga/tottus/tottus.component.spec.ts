import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TottusComponent } from './tottus.component';

describe('TottusComponent', () => {
  let component: TottusComponent;
  let fixture: ComponentFixture<TottusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TottusComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TottusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
