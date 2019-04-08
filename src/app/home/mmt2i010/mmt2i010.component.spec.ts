import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Mmt2i010Component } from './mmt2i010.component';

describe('Mmt2i010Component', () => {
  let component: Mmt2i010Component;
  let fixture: ComponentFixture<Mmt2i010Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Mmt2i010Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Mmt2i010Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
