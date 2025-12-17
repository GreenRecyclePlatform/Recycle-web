import { TestBed } from '@angular/core/testing';

import { Inventory } from './inventory.service';

describe('Inventory', () => {
  let service: Inventory;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Inventory);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
