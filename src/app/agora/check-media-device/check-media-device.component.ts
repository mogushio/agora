import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import AgoraRTC, { ICameraVideoTrack, IMicrophoneAudioTrack } from 'agora-rtc-sdk-ng';

@Component({
  selector: 'app-check-media-device',
  standalone: false,
  templateUrl: './check-media-device.component.html',
  styleUrl: './check-media-device.component.scss'
})
export class CheckMediaDeviceComponent {

  @Output() emitJoinChannel = new EventEmitter<{ camera: boolean; audio: boolean; userName: string }>();

  private selectedMicrophoneId!: string;
  private videoTrack!: ICameraVideoTrack;
  private audioTrack!: IMicrophoneAudioTrack;
  private interval!: any;
  private _audio = false;

  get audio(): boolean {
    return this._audio;
  }

  set audio(val: boolean) {
    this.audioTrack.setEnabled(val);
    this._audio = val;
  }

  private _camera = false;
  public selectedCameraId!: string;
  public checkVolumeLevel = 0;
  public mediaChecking = true;
  public loading = false;
  public joinForm!: FormGroup;

  get camera(): boolean {
    return this._camera;
  }

  set camera(val: boolean) {
    if (val) {
      this.videoTrack.play("check_" + this.selectedCameraId);
    } else {
      this.videoTrack.stop();
    }
    this.enableVideo(val);
    this._camera = val;
  }

  constructor(
    public formBuilder: FormBuilder
  ) {}

  ngOnInit(): void {
    this.joinForm = this.formBuilder.group({
      userName: ['', Validators.required]
    });
    this.getDeviceInfo();
  }

  ngOnDestroy() {
    this.camera = false;
    this.audio = false;
    clearInterval(this.interval);
  }

  private getDeviceInfo(): void {
    AgoraRTC.getDevices()
      .then(devices => {
        const audioDevices = devices.filter(function (device) {
          return device.kind === "audioinput";
        });
        const videoDevices = devices.filter(function (device) {
          return device.kind === "videoinput";
        });

        this.selectedMicrophoneId = audioDevices[0].deviceId;
        this.selectedCameraId = videoDevices[0].deviceId;
        return Promise.all([
          AgoraRTC.createCameraVideoTrack({ cameraId: this.selectedCameraId }),
          AgoraRTC.createMicrophoneAudioTrack({ microphoneId: this.selectedMicrophoneId }),
        ]);
      })
      .then(([videoTrack, audioTrack]) => {
        this.videoTrack = videoTrack;
        this.audioTrack = audioTrack;
        videoTrack.play("check_" + this.selectedCameraId);
        this.mediaChecking = false
        this._camera = true;
        this._audio = true;
        this.interval = setInterval(() => {
          this.checkVolumeLevel = audioTrack.getVolumeLevel();
        }, 1000);
      })
      .catch((reason: any) => { alert(reason) });
  }

  toggleAudio() {
    this.audio = !this.audio;
  }

  toggleCamera() {
    this.camera = !this.camera;
  }

  private async enableVideo(val: boolean): Promise<void> {
    await this.videoTrack.setEnabled(val);
  }

  joinChannel() {
    this.loading = true;
    this.joinForm.setValue({ userName: this.joinForm.value.userName.trim() });
    if (this.joinForm.invalid) {
      return;
    }
    this.emitJoinChannel.emit({
      camera: this._camera,
      audio: this._audio,
      userName: this.joinForm.value.userName,
    });
  }
}
