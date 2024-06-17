import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UID } from 'agora-rtc-sdk-ng';

@Component({
  selector: 'app-group-chat',
  standalone: false,
  templateUrl: './group-chat.component.html',
  styleUrl: './group-chat.component.scss'
})
export class GroupChatComponent {

  @Input() chatMessages!: { memberId: string; memberName: string; message: string; timestamp: number }[];
  @Input() memberId!: UID | undefined;
  @Input() memberName!: string;

  @Output() emitCloseChat = new EventEmitter<boolean>();
  @Output() emitSendMessage = new EventEmitter<{ message: string; memberName: string; timestamp: number }>();

  public chatForm!: FormGroup;

  constructor(
    private formBuilder: FormBuilder
  ) {}

  ngOnInit() {
    this.chatForm = this.formBuilder.group({
      message: ['', Validators.required]
    });
  }

  closeChat() {
    this.emitCloseChat.emit(false);
  }

  sendMessage() {
    this.chatForm.setValue({ message: this.chatForm.value.message.trim() })
    if (this.chatForm.invalid) {
      return;
    }
    this.emitSendMessage.emit({ message: this.chatForm.value.message, memberName: this.memberName, timestamp: Date.now() });
    this.chatForm.reset({ message: '' });
  }
}
