import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeareaComponent } from './homearea.component';

describe('HomeareaComponent', () => {
  let component: HomeareaComponent;
  let fixture: ComponentFixture<HomeareaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HomeareaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeareaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
