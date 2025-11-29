import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateRequest } from './create-request';

describe('CreateRequest', () => {
  let component: CreateRequest;
  let fixture: ComponentFixture<CreateRequest>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateRequest]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateRequest);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
