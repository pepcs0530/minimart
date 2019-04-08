import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FwBreadcrumbComponent } from './fw-breadcrumb.component';

describe('FwBreadcrumbComponent', () => {
  let component: FwBreadcrumbComponent;
  let fixture: ComponentFixture<FwBreadcrumbComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FwBreadcrumbComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FwBreadcrumbComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
