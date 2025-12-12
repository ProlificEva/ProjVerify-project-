import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProposalResult } from './proposal-result';

describe('ProposalResult', () => {
  let component: ProposalResult;
  let fixture: ComponentFixture<ProposalResult>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProposalResult]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProposalResult);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
