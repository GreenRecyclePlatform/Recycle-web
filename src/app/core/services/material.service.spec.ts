import { TestBed } from '@angular/core/testing';

import { Material } from './material.service';

describe('Material', () => {
  let service: Material;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Material);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
