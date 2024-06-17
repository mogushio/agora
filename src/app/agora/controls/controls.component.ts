import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Subscription, map, timer } from 'rxjs';
import { LocalStream } from '../models/localStream';

@Component({
  selector: 'app-controls',
  standalone: false,
  templateUrl: './controls.component.html',
  styleUrl: './controls.component.scss'
})
export class ControlsComponent {

  @Input() isScreenPresenting = false;
  @Input() disableVideo = false;
  @Input() peopleList = true;
  @Input() chatList = true;
  @Input() localStream!: LocalStream;

  @Output() emitLeaveChannel = new EventEmitter<boolean>();
  @Output() emitVideoChannel = new EventEmitter<boolean>();
  @Output() emitScreenShare = new EventEmitter<boolean>();
  @Output() emitStopScreenShare = new EventEmitter<boolean>();
  @Output() emitMuteVolume = new EventEmitter<boolean>();
  @Output() emitPeopleList = new EventEmitter<boolean>();
  @Output() emitChatList = new EventEmitter<boolean>();

  public clock = new Date();
  private timeSub!: Subscription;

  ngOnInit(): void {
    this.timeSub = timer(0, 1000)
      .pipe(
        map(() => new Date())
      )
      .subscribe(time => {
        this.clock = time;
      });
  }

  ngOnDestroy() {
    if (this.timeSub) {
      this.timeSub.unsubscribe();
    }
  }

  leaveChannel() {
    this.emitLeaveChannel.emit(true);
  }

  videoChannel() {
    this.emitVideoChannel.emit(true);
  }

  screenShare() {
    this.emitScreenShare.emit(true);
  }

  stopScreenShare() {
    this.emitStopScreenShare.emit(true);
  }

  muteVolume() {
    this.emitMuteVolume.emit(true);
  }

  userList() {
    this.peopleList = !this.peopleList;
    this.chatList = false;
    this.emitChatList.emit(false);
    this.emitPeopleList.emit(this.peopleList);
  }

  groupChatList() {
    this.chatList = !this.chatList;
    this.peopleList = false;
    this.emitPeopleList.emit(false);
    this.emitChatList.emit(this.chatList);
  }
}
