import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BuyingOptionsComponent } from './buying-options.component';

describe('BuyingOptionsComponent', () => {
  let component: BuyingOptionsComponent;
  let fixture: ComponentFixture<BuyingOptionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BuyingOptionsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BuyingOptionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
