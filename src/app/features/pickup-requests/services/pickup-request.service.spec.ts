import { TestBed } from '@angular/core/testing';

import { PickupRequestService } from './pickup-request.service';

describe('PickupRequestService', () => {
  let service: PickupRequestService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PickupRequestService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
