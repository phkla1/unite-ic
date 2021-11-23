import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TeamInboxComponent } from './team-inbox.component';

describe('TeamInboxComponent', () => {
  let component: TeamInboxComponent;
  let fixture: ComponentFixture<TeamInboxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TeamInboxComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TeamInboxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
