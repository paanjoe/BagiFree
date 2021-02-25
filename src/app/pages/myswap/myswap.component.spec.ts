import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MyswapComponent } from './myswap.component';

describe('MyswapComponent', () => {
  let component: MyswapComponent;
  let fixture: ComponentFixture<MyswapComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MyswapComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyswapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
