import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GiveawayRequestComponent } from './giveaway-request.component';

describe('GiveawayRequestComponent', () => {
  let component: GiveawayRequestComponent;
  let fixture: ComponentFixture<GiveawayRequestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GiveawayRequestComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GiveawayRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
