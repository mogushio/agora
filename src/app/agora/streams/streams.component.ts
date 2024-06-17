import { Component, HostListener, Input } from '@angular/core';
import { RemoteStream } from '../models/remoteStream';
import { LocalStream } from '../models/localStream';
import { Subscription, fromEvent } from 'rxjs';

@Component({
  selector: 'app-streams',
  standalone: false,
  templateUrl: './streams.component.html',
  styleUrl: './streams.component.scss'
})
export class StreamsComponent {

  @Input() remoteStreams: { [name: number]: RemoteStream } = {};
  @Input() pinUser!: { status: boolean, key: number };
  @Input() localStream!: LocalStream;

  private fullscreenMode = false;
  private fullscreenSub!: Subscription;

  ngOnInit() {
    this.doubleTabEvent();
  }

  ngOnDestroy() {
    if (this.fullscreenSub) {
      this.fullscreenSub.unsubscribe();
    }
  }

  @HostListener('window:dblclick', ['$event'])
  fullscreenchange() {
    if (!this.fullscreenMode) {
      this.fullscreen();
    } else {
      this.closeFullscreen();
    }
  }

  doubleTabEvent() {
    const msFullscreenchange$ = fromEvent(document, 'msfullscreenchange');
    this.fullscreenSub = msFullscreenchange$
      .pipe()
      .subscribe(() => (this.fullscreenMode = !this.fullscreenMode));
    const webkitfullscreenchange$ = fromEvent(
      document,
      'wibkitfullscreenchange',
    );
    this.fullscreenSub = webkitfullscreenchange$
      .pipe()
      .subscribe(() => (this.fullscreenMode = !this.fullscreenMode));
    const mozFullscreenchange$ = fromEvent(document, 'mozfullscreenchange');
    this.fullscreenSub = mozFullscreenchange$
      .pipe()
      .subscribe(() => (this.fullscreenMode = !this.fullscreenMode));
    const fullscreenchange$ = fromEvent(document, 'fullscreenchange');
    this.fullscreenSub = fullscreenchange$
      .pipe()
      .subscribe(() => (this.fullscreenMode = !this.fullscreenMode));
  }

  fullscreen() {
    const elem: HTMLElement | any = document.documentElement;
    if (elem.requestFullscreen) {
      elem.requestFullscreen();
    } else if (elem.webkitRequestFullscreen) {
      elem.webkitRequestFullscreen();
    } else if (elem.msRequestFullscreen) {
      elem.msRequestFullscreen();
    }
  }

  closeFullscreen() {
    const elem: Document | any = document;
    if (elem.exitFullscreen) {
      elem.exitFullscreen();
    } else if (elem.ewbkitExitFullscreen) {
      elem.webkitExitFullscreen();
    } else if (elem.msExitFullscreen) {
      elem.msExitFullscreen();
    }
  }

  trackMe(index: any, stream: any) {
    return stream ? stream.key : undefined;
  }
}
