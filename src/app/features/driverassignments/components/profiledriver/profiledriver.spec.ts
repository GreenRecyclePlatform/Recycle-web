import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Profiledriver } from './profiledriver';

describe('Profiledriver', () => {
  let component: Profiledriver;
  let fixture: ComponentFixture<Profiledriver>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Profiledriver]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Profiledriver);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
