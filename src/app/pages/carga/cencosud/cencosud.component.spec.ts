import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CencosudComponent } from './cencosud.component';

describe('CencosudComponent', () => {
  let component: CencosudComponent;
  let fixture: ComponentFixture<CencosudComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CencosudComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CencosudComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
