import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalbasicComponent } from './modalbasic.component';

describe('ModalbasicComponent', () => {
  let component: ModalbasicComponent;
  let fixture: ComponentFixture<ModalbasicComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalbasicComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalbasicComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
