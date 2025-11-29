import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MaterialPriceListComponent } from './material-price-list.component.js';

describe('MaterialPriceListComponentTs', () => {
  let component: MaterialPriceListComponent;
  let fixture: ComponentFixture<MaterialPriceListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MaterialPriceListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MaterialPriceListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
