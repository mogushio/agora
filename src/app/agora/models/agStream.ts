import AgoraRTM, { RtmChannel, RtmClient } from 'agora-rtm-sdk'
/**
 * Agora rtc sdk imports.
 */
import AgoraRTC, { ConnectionDisconnectedReason, ConnectionState, IAgoraRTCClient, IAgoraRTCRemoteUser, ICameraVideoTrack, IMicrophoneAudioTrack, NetworkQuality, UID } from "agora-rtc-sdk-ng";

/**
 * Rxjs imports.
 */
import { ReplaySubject } from "rxjs";

/**
 * Modal imports.
 */
import { ChatMessages } from "./localStream";

/**
 * Create the instance of the agora stream.
 */
export class AgStream {
  /**
   * Private appId, channel, token of agora to join the channel
   * localAudioTrack and localVideoTrack object of
   * Uid of local streamer.
   * screenShareUid of the streamer which is 10000 always.
   * localScreenTrack for the screen share tracking.
   */
  private appId: string;
  private channel: string;
  private token: string;
  private localAudioTrack!: IMicrophoneAudioTrack;
  private localVideoTrack!: ICameraVideoTrack;
  private uid!: UID;
  private localScreenTrack!: any;
  private rtmClient: RtmClient;
  private rtmChannel!: RtmChannel;

  /**
   * Public rtc client object.
   * Loading user joined flag.
   * DisableVideo is to show the loading time of video ON.
   */
  public rtcClient!: IAgoraRTCClient;
  public loading: boolean = false;
  public isJoined: boolean = false;
  public disableVideo: boolean = false;

  /**
   * Setter and Getter for screen sharing.
   */
  private _isScreenPresenting: boolean = false;
  get isScreenPresenting(): boolean {
    return this._isScreenPresenting;
  }
  set isScreenPresenting(val: boolean) {
    this._isScreenPresenting = val;
  }

  /**
   * Setter and Getter for volume level.
   */
  private _localVolumeLevel = 0;
  get localVolumeLevel(): number {
    return this._localVolumeLevel;
  }
  set localVolumeLevel(val: number) {
    this._localVolumeLevel = val;
  }

  /**
   * Setter and Getter for camera.
   */
  private _camera: boolean = true;
  get camera(): boolean {
    return this._camera;
  }
  set camera(val: boolean) {
    if (!val) {
      this.disableVideo = true;
      this.publishLocalVideoTracks();
    } else {
      if (this.localVideoTrack) {
        this.rtcClient.unpublish(this.localVideoTrack)
        this.localVideoTrack.close();
        this._camera = val;
      }
    }
  }

  /**
   * Setter and Getter for mic.
   */
  private _audio: boolean = true;
  get audio(): boolean {
    return this._audio;
  }
  set audio(val: boolean) {
    if (!val) {
      this.publishLocalAudioTracks();
    } else {
      if (this.localAudioTrack) {
        this.rtcClient.unpublish(this.localAudioTrack);
        this.localAudioTrack.close();
        this._audio = val;
      }
    }
  }

  /**
   * Replay subject to emit the events like
   * userJoined, userInfoUpdated, networkQuality, volumeIndicator
   * userLeft, trackEnded, errors.
   */
  public userJoined = new ReplaySubject<IAgoraRTCRemoteUser>();
  public userInfoUpdated = new ReplaySubject<{ uid: UID, msg: string }>();
  public networkQuality = new ReplaySubject<NetworkQuality>();
  public volumeIndicator = new ReplaySubject<{ level: number; uid: UID; }[]>();
  public userLeft = new ReplaySubject<{ user: IAgoraRTCRemoteUser, reason: string }>();
  public trackEnded = new ReplaySubject<string>();
  public errors = new ReplaySubject<{ code: number | string; msg: string }>();
  public peerToPeerMsg = new ReplaySubject<{ text: string, messageType: string; sendPeerId: string }>();
  public chatMessages: ChatMessages[] = [];


  /**
   * Initiate the Local streamer client.
   */
  constructor(appId: string, channel: string, token: string, isScreenPresenting: boolean) {
    this.appId = appId;
    this.channel = channel;
    this.token = token;
    this.isScreenPresenting = isScreenPresenting;
    this.rtcClient = this.createLocalClient();
    this.rtmClient = AgoraRTM.createInstance(appId);
    if (!isScreenPresenting) {
      this.userPublish();
    }
    this.connectionState();
  }

  /**
   * Create the Local streamer client.
   */
  private createLocalClient(): IAgoraRTCClient {
    return AgoraRTC.createClient({ mode: "rtc", codec: "h264" });
  }

  /**
   * Join the Local streamer client channel.
   * Check the pre flags for camera and audio.
   */
  async joinChannel(appId: string, channel: string, token: string, audio: boolean, camera: boolean, username: string) {
    this.loading = true;
    await this.rtcClient.join(appId, channel, null, null)
      .then(async (value: UID) => {
        this.uid = value;
        await this.loginRTM(username);
        this.isJoined = true;
        this.rtcClient.enableAudioVolumeIndicator();
        if (audio) {
          await this.publishLocalAudioTracks();
        }
        if (camera) {
          await this.publishLocalVideoTracks();
        }
      })
      .catch((res: any) => {
        alert(res.message);
        this.errors.next({ code: res.code, msg: res.message });
        return;
      });
    this.loading = false;
  }

  /**
   * Login into the RTM account.
   */
  async loginRTM(username: string): Promise<void> {
    await this.rtmClient.login({ uid: this.uid.toString() })
      .then(async () => {
        await this.rtmClient.setLocalUserAttributes({ name: username, isPresenting: '0' });
        await this.createChannel();
      })
      .catch((res: any) => {
        this.errors.next({ code: res.code, msg: res.message });
      });
  }

  /**
   * Login into the client rtm for screen share.
   */
  async screenShareLoginRTM(username: string, uid: string, presentingLength: string): Promise<void> {
    await this.rtmClient.login({ uid: uid })
      .then(async () => {
        await this.rtmClient.setLocalUserAttributes({ name: username, isPresenting: '1', number: presentingLength});
      })
      .catch((res: any) => {
        this.errors.next({ code: res.code, msg: res.message });
      });
  }

  /**
   * Get user name from the rtm.
   */
  async getUserAttribute(id: string): Promise<any> {
    return await this.rtmClient.getUserAttributes(id);
  }

  /**
   * Create the RTM Channel.
   */
  async createChannel(): Promise<void> {
    this.rtmChannel = await this.rtmClient.createChannel(this.channel);
    await this.joinRTM();
  }

  /**
   * Join the RTM Channel.
   */
  async joinRTM(): Promise<void> {
    await this.rtmChannel.join()
      .then(() => {
        this.rtmEventListener();
      })
      .catch((res: any) => {
        alert(res.message);
        this.errors.next({ code: res.code, msg: res.message });
        return;
      });
  }

  /**
   * EventListener of the rtm client.
   */
  rtmEventListener(): void {
    this.rtmChannel.on('ChannelMessage', async (message: any, memberId: string) => {
      let name = '';
      await this.getUserAttribute(memberId)
        .then((value) => {
          name = value.name;
        })
        .catch((reason: any) => console.log("getUserAttribute error", reason));
      this.chatMessages.push({
        memberId,
        memberName: name,
        message: message.text,
        messageType: message.messageType,
        timestamp: Date.now()
      })
    })
    this.rtmChannel.on('MemberJoined', (memberId: string) => {
      console.log("MemberJoined", memberId);
    })
    this.rtmChannel.on('MemberLeft', (memberId: string) => {
      console.log("MemberLeft", memberId);
    })
    this.rtmClient.on('MessageFromPeer', (message: any, peerId: string) => {
      console.log("MessageFromPeer", message, peerId);
      this.peerToPeerMsg.next({ text: message.text, messageType: message.messageType, sendPeerId: peerId });
    })
  }

  /**
   * Join the Local screen share client channel.
   */
  async joinScreenShareChannel(appId: string, channel: string, token: string, username: string, presentingLength: number) {
    await this.rtcClient.join(appId, channel, null)
      .then(async (value: UID) => {
        this.screenShareLoginRTM(username, value.toString(), presentingLength.toString());
        this.isScreenPresenting = true;
      })
      .catch((res: any) => {
        this.errors.next({ code: res.code, msg: res.message });
      });;
  }

  /**
   * Create the screen video track for the screen share.
   */
  async publishScreenTracks(): Promise<void> {
    AgoraRTC.createScreenVideoTrack({
      /**
       * Set the encoder configurations. For details, see the API description.
       */
      encoderConfig: "1080p_1",
    }).then(async localScreenTrack => {
      this.localScreenTrack = localScreenTrack;
      await this.rtcClient.publish(this.localScreenTrack);
      await this.localScreenTrack.on('track-ended', async () => {
        this.trackEnded.next('track-ended');
        await this.stopScreenSharing();
      })
    }).catch((res: any) => {
      this.errors.next({ code: res.code, msg: res.message });
      this.stopScreenSharing();
    });
  }

  /**
   * Stop the screen share and unpublish and close the screen track
   * Leave the channel for screen share.
   */
  async stopScreenSharing(): Promise<void> {
    await this.rtcClient.unpublish();
    await this.rtcClient.leave();
    await this.localScreenTrack?.close();
    this.isScreenPresenting = false;
  }

  /**
   * Publish the local audio tracks for local streamer.
   */
  private async publishLocalAudioTracks(): Promise<void> {
    this.localAudioTrack = await AgoraRTC.createMicrophoneAudioTrack();
    await this.rtcClient.publish(this.localAudioTrack)
      .then(() => {
        this._audio = false;
      })
      .catch((reason: any) => {
        this.rtcClient.unpublish(this.localAudioTrack);
      });
  }

  /**
   * Publish the local video tracks for local streamer.
   * Play the remote video track.
   * Pass the DIV container and the SDK dynamically creates.
   * a player in the container for playing the remote video track.
   */
  private async publishLocalVideoTracks(): Promise<void> {
    this.localVideoTrack = await AgoraRTC.createCameraVideoTrack();
    await this.rtcClient.publish(this.localVideoTrack)
      .then(() => {
        this.localVideoTrack.play("local_stream_" + this.uid);
        this._camera = false;
      })
      .catch((reason: any) => {
        this.rtcClient.unpublish(this.localVideoTrack);
      })
      .finally(() => this.disableVideo = false);
  }

  /**
   * ConnectionState of the local streamer.
   */
  private connectionState(): void {
    this.rtcClient.on('connection-state-change', (curState: ConnectionState, revState: ConnectionState, reason?: ConnectionDisconnectedReason) => {
      console.log("connection-state-change!", curState, revState, reason);
    })
  }

  /**
   * Publishing of the local streamer events.
   * user-joined, user-info-updated, network-quality,
   * user-published, user-unpublished, user-left,
   * volume-indicator, token-privilege-will-expire,
   * token-privilege-did-expire, exception.
   */
  private userPublish(): void {
    this.rtcClient.on("user-joined", async (user: IAgoraRTCRemoteUser) => {
      this.userJoined.next(user);
    });
    this.rtcClient.on("user-info-updated", async (uid: UID, msg: string) => {
      this.userInfoUpdated.next({ uid: uid, msg: msg });
    });
    this.rtcClient.on("network-quality", async (stats: NetworkQuality) => {
      this.networkQuality.next(stats);
    });
    this.rtcClient.on("user-published", async (user, mediaType) => {
      await this.rtcClient.subscribe(user, mediaType);
      const id = user.uid;
      if (mediaType === "video") {
        const remoteVideoTrack = user?.videoTrack;
        remoteVideoTrack?.play("remote_stream_" + id);
      }
      if (mediaType === "audio") {
        const remoteAudioTrack = user.audioTrack;
        remoteAudioTrack?.play();
      }
    });
    this.rtcClient.on("user-unpublished", (user, mediaType) => {
      if (mediaType === "video") {
        const playerContainer = document.getElementById(user.uid.toString());
        playerContainer?.remove();
      }
    });
    this.rtcClient.on('user-left', (user: IAgoraRTCRemoteUser, reason: string) => {
      this.userLeft.next({ user, reason });
    })
    this.rtcClient.on('volume-indicator', (result: { level: number; uid: UID; }[]) => {
      this.volumeIndicator.next(result);
    });
    this.rtcClient.on('token-privilege-will-expire', () => {
      this.rtcClient.renewToken(this.token);
      console.log('token-privilege-will-expire');
    });
    this.rtcClient.on('token-privilege-did-expire', async () => {
      alert('token-privilege-did-expire');
      await this.leaveCall();
    });
    this.rtcClient.on('exception', (event: { code: number; msg: string; uid: UID; }) => {
      console.log('exception', event);
    });
  }

  /**
   * Send message in group for all users.
   */
  async sendMessageToGroup(event: { message: string; memberName: string; timestamp: number }): Promise<void> {
    await this.rtmChannel.sendMessage({ text: event.message })
      .then(() => {
        this.chatMessages.push({
          memberId: this.uid.toString(),
          memberName: event.memberName,
          message: event.message,
          messageType: 'TEXT',
          timestamp: event.timestamp
        })
      })
      .catch((reason: any) => {
        alert(reason.message)
      });
  }

  /**
   * Send message to the particular user.
   */
  async sendMessageToPeer(message: string, peerId: string): Promise<void> {
    await this.rtmClient.sendMessageToPeer(
      { text: message },
      peerId,
    ).then(sendResult => {
      console.log('sendResult', sendResult);
    })
  }

  /**
   * Leave call.
   * stop the localAudioTrack and localVideoTrack.
   */
  async leaveCall(): Promise<void> {
    this.loading = true;
    if (!this.audio) {
      await this.localAudioTrack.close();
    }
    if (!this.camera) {
      await this.localVideoTrack.close();
    }
    await this.rtcClient.remoteUsers.forEach(user => {
      user.audioTrack?.stop()
      user.videoTrack?.stop()
    });
    this.rtmClient.logout();
    await this.rtcClient.leave();
    this.isJoined = false;
    this.loading = false;
  }
}
