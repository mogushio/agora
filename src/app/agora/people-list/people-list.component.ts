import { Component, EventEmitter, Input, Output } from '@angular/core';
import { RemoteStream } from '../models/remoteStream';
import { LocalStream } from '../models/localStream';

@Component({
  selector: 'app-people-list',
  standalone: false,
  templateUrl: './people-list.component.html',
  styleUrl: './people-list.component.scss'
})
export class PeopleListComponent {

  @Input() peopleList: { [name: number]: RemoteStream } = {};
  @Input() localStream!: LocalStream;

  @Output() emitCloseList = new EventEmitter<boolean>();
  @Output() emitSendMessageToPeer = new EventEmitter<{ message: string; peerId: string; }>();
  @Output() emitPinkey = new EventEmitter<string>();

  closeList() {
    this.emitCloseList.emit(false);
  }

  muteRemoteUser(peerId: string) {
    this.emitSendMessageToPeer.emit({ message: 'mute-audio', peerId: peerId });
  }

  removeRemoteUser(peerId: string) {
    this.emitSendMessageToPeer.emit({ message: 'leave-channel', peerId: peerId });
  }

  trackMe(index: any, stream: any) {
    return index;
  }

  pinUser(pin: string) {
    this.emitPinkey.emit(pin);
  }
}
