import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FilterSearchTableComponent } from './filter-search-table.component';

describe('FilterSearchTableComponent', () => {
  let component: FilterSearchTableComponent;
  let fixture: ComponentFixture<FilterSearchTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FilterSearchTableComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FilterSearchTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
