import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProposalSubmission } from './proposal-submission';

describe('ProposalSubmission', () => {
  let component: ProposalSubmission;
  let fixture: ComponentFixture<ProposalSubmission>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProposalSubmission]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProposalSubmission);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
