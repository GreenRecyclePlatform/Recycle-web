import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PayoutRequest } from './payout-request';

describe('PayoutRequest', () => {
  let component: PayoutRequest;
  let fixture: ComponentFixture<PayoutRequest>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PayoutRequest]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PayoutRequest);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
