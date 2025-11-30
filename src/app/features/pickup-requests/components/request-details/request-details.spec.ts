import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestDetails } from './request-details';

describe('RequestDetails', () => {
  let component: RequestDetails;
  let fixture: ComponentFixture<RequestDetails>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RequestDetails]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RequestDetails);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
