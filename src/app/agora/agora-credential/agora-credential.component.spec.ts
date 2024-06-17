import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgoraCredentialComponent } from './agora-credential.component';

describe('AgoraCredentialComponent', () => {
  let component: AgoraCredentialComponent;
  let fixture: ComponentFixture<AgoraCredentialComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AgoraCredentialComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AgoraCredentialComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
