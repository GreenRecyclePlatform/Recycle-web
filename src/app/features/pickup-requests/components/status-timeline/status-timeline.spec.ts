import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StatusTimeline } from './status-timeline';

describe('StatusTimeline', () => {
  let component: StatusTimeline;
  let fixture: ComponentFixture<StatusTimeline>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StatusTimeline]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StatusTimeline);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
