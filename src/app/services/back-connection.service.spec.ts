import { TestBed } from '@angular/core/testing';

import { BackConnectionService } from './back-connection.service';

describe('BackConnectionService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: BackConnectionService = TestBed.get(BackConnectionService);
    expect(service).toBeTruthy();
  });
});
