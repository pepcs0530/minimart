import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Inv1r010ReportComponent } from './inv1r010-report.component';

describe('Inv1r010ReportComponent', () => {
  let component: Inv1r010ReportComponent;
  let fixture: ComponentFixture<Inv1r010ReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Inv1r010ReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Inv1r010ReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
