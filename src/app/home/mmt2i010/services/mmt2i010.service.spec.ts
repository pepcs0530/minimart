import { TestBed } from '@angular/core/testing';

import { Mmt2i010Service } from './mmt2i010.service';

describe('Mmt2i010Service', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: Mmt2i010Service = TestBed.get(Mmt2i010Service);
    expect(service).toBeTruthy();
  });
});
