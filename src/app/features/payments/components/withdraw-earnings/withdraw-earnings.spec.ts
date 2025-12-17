import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WithdrawEarnings } from './withdraw-earnings';

describe('WithdrawEarnings', () => {
  let component: WithdrawEarnings;
  let fixture: ComponentFixture<WithdrawEarnings>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WithdrawEarnings]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WithdrawEarnings);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
