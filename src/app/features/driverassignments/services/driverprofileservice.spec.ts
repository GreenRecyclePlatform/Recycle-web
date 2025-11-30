import { TestBed } from '@angular/core/testing';
import { DriverProfileService } from './driverprofileservice';
describe('Driverprofileservice', () => {
  let service: DriverProfileService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DriverProfileService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
