import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CollectBasicDataComponent } from './collect-basic-data.component';

describe('CollectBasicDataComponent', () => {
  let component: CollectBasicDataComponent;
  let fixture: ComponentFixture<CollectBasicDataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CollectBasicDataComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CollectBasicDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
