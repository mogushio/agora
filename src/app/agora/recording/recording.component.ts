import { Component } from '@angular/core';
import { Subscription } from 'rxjs';
import { ApiService } from '../../services/api/api.service';

@Component({
  selector: 'app-recording',
  standalone: false,
  templateUrl: './recording.component.html',
  styleUrl: './recording.component.scss'
})
export class RecordingComponent {

  private _recordingStart = false;
  private acquireRecordingSub!: Subscription;
  private startRecordingSub!: Subscription;
  private stopRecordingSub!: Subscription;

  get isRecordingStart(): boolean {
    return this._recordingStart;
  }
  set isRecordingStart(val) {
    this._recordingStart = val;
  }

  public loading = false;

  constructor(
    private apiService: ApiService,
  ) {}

  ngOnDestroy() {
    if (this.startRecordingSub) {
      this.startRecordingSub.unsubscribe();
    }
    if (this.acquireRecordingSub) {
      this.acquireRecordingSub.unsubscribe();
    }
    if (this.stopRecordingSub) {
      this.stopRecordingSub.unsubscribe();
    }
  }

  acquireRecording() {
    this.loading = true;
    this.acquireRecordingSub = this.apiService.acquireRecording().subscribe(
      (next: { resourceId: string }) => {
        if (next) {
          this.apiService.resourceId = next.resourceId;
          this.startRecording();
        }
      },
      (error: any) => {
        if (error) {
          this.loading = false;
        }
      }
    );
  }

  startRecording(): void {
    this.startRecordingSub = this.apiService.startRecording().subscribe(
      (next: any) => {
        if (next) {
          this.apiService.sid = next.sid;
          this.loading = false;
          this.isRecordingStart = true;
        }
      },
      (error: any) => {
        if (error) {
          this.loading = false;
        }
      }
    );
  }

  stopRecording() {
    this.loading = true;
    this.stopRecordingSub = this.apiService.stopRecording().subscribe(
      (next: any) => {
        if (next) {
          this.loading = false;
          this.isRecordingStart = false;
        }
      },
      (error: any) => {
        if (error) {
          this.loading = false;
        }
      }
    );
  }

  queryRecording() {
    this.apiService.queryRecording().subscribe(
      (next: any) => {
        if (next) {
          this.loading = false;
          this.isRecordingStart = false;
          this.stopRecording();
        }
      },
      (error: any) => {
        if (error) {
          this.loading = false;
        }
      }
    );
  }
}
