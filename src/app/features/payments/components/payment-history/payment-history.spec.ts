import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentHistory } from './payment-history';

describe('PaymentHistory', () => {
  let component: PaymentHistory;
  let fixture: ComponentFixture<PaymentHistory>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PaymentHistory]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PaymentHistory);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
