import { TestBed } from '@angular/core/testing';

import { DashpickupDriverservice } from './DashpickupDriverservice';

describe('Pickup', () => {
  let service: DashpickupDriverservice;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DashpickupDriverservice);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
