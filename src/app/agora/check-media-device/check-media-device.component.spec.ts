import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckMediaDeviceComponent } from './check-media-device.component';

describe('CheckMediaDeviceComponent', () => {
  let component: CheckMediaDeviceComponent;
  let fixture: ComponentFixture<CheckMediaDeviceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CheckMediaDeviceComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CheckMediaDeviceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
