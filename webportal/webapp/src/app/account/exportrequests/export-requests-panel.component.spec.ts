import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExportRequestsPanelComponent } from './export-requests-panel.component';

describe('ExportRequestsPanelComponent', () => {
  let component: ExportRequestsPanelComponent;
  let fixture: ComponentFixture<ExportRequestsPanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ ExportRequestsPanelComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExportRequestsPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
