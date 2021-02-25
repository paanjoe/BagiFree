import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AboutBagifreeComponent } from './about-bagifree.component';

describe('AboutBagifreeComponent', () => {
  let component: AboutBagifreeComponent;
  let fixture: ComponentFixture<AboutBagifreeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AboutBagifreeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AboutBagifreeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
