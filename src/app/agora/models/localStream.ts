import { UID } from "agora-rtc-sdk-ng";

export interface LocalStream {
  uid: UID | undefined;
  name: string;
  level: number;
  audio: boolean;
  camera: boolean;
  isPresenting: boolean;
  initials: string;
}

export interface ChatMessages {
  memberId: string;
  memberName: string;
  message: string;
  messageType: string;
  timestamp: number;
}
