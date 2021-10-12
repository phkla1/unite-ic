import { TestBed } from '@angular/core/testing';

import { UniteHttpService } from './unite-http.service';

describe('UniteHttpService', () => {
  let service: UniteHttpService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UniteHttpService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
