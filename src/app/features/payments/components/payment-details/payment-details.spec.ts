import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentDetails } from './payment-details';

describe('PaymentDetails', () => {
  let component: PaymentDetails;
  let fixture: ComponentFixture<PaymentDetails>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PaymentDetails]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PaymentDetails);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
