import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserNavBar } from './user-nav-bar';

describe('UserNavBar', () => {
  let component: UserNavBar;
  let fixture: ComponentFixture<UserNavBar>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UserNavBar],
    }).compileComponents();

    fixture = TestBed.createComponent(UserNavBar);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
