import { TestBed } from '@angular/core/testing';
import { Alldriverservice } from './alldriverservice';

describe('Alldriverservice', () => {
  let service: Alldriverservice;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Alldriverservice);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
