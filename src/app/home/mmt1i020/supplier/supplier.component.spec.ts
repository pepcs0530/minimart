import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Mmt1i020SupplierComponent } from './supplier.component';

describe('SupplierComponent', () => {
  let component: Mmt1i020SupplierComponent;
  let fixture: ComponentFixture<Mmt1i020SupplierComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Mmt1i020SupplierComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Mmt1i020SupplierComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
