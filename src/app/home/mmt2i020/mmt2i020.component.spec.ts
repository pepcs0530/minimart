import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Mmt2i020Component } from './mmt2i020.component';

describe('Mmt2i020Component', () => {
  let component: Mmt2i020Component;
  let fixture: ComponentFixture<Mmt2i020Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Mmt2i020Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Mmt2i020Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
