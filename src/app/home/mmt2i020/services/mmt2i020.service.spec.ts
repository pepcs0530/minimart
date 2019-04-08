import { TestBed } from '@angular/core/testing';

import { Mmt2i020Service } from './mmt2i020.service';

describe('Mmt2i020Service', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: Mmt2i020Service = TestBed.get(Mmt2i020Service);
    expect(service).toBeTruthy();
  });
});
