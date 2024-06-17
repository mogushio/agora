import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../../services/api/api.service';

@Component({
  selector: 'app-agora-credential',
  standalone: false,
  templateUrl: './agora-credential.component.html',
  styleUrl: './agora-credential.component.scss'
})
export class AgoraCredentialComponent {

  get appId(): AbstractControl | null {
    return this.agoraForm.get('appId');
  }

  get channelName(): AbstractControl | null {
    return this.agoraForm.get('channelName');
  }

  get token(): AbstractControl | null {
    return this.agoraForm.get('token');
  }

  public agoraForm!: FormGroup;
  public submitted = false;
  public login = false;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private apiService: ApiService,
  ) {}

  ngOnInit(): void {
    this.agoraForm = this.formBuilder.group({
      appId: ['ed516ca4d8114bb6abf461e1025c42ae', Validators.required],
      channelName: ['test', Validators.required],
      token: ['6b84b84f23024eafb18f8641eeed4061'],
    });
  }

  onSubmit() {
    this.submitted = true;
    if (this.agoraForm.invalid) {
      return;
    }
    this.login = true;
    this.apiService.appId = this.appId?.value;
    this.apiService.cname = this.channelName?.value;
    this.router.navigate(['agora/' + this.apiService.appId], {
      queryParams: { cname: this.apiService.cname },
    });
  }

  onReset() {
    this.submitted = false;
    this.agoraForm.reset({ appId: '', channelName: '', token: ''});
  }
}
