import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MyratingComponent } from './myrating.component';

describe('MyratingComponent', () => {
  let component: MyratingComponent;
  let fixture: ComponentFixture<MyratingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MyratingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyratingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
