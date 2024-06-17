export class RemoteStream {
  private uid!: number;
  private _number!: number;
  get number(): number {
    return this._number;
  }

  private _name!: string;
  get name(): string {
    return this._name;
  }

  private _initial = '';
  set initial(val) {
    if (val) {
      this._initial = val.charAt(0).toLocaleUpperCase();
    } else {
      this._initial = '';
    }
  }
  get initial(): string {
    return this._initial;
  }

  private _pin!: boolean;
  set pin(val) {
    this._pin = val;
  }
  get pin(): boolean {
    return this._pin;
  }

  private _isAudio!: boolean;
  get isAudio(): boolean {
    return this._isAudio
  }
  set isAudio(val) {
    this._isAudio = val;
  }

  private _isVideo!: boolean;
  get isVideo(): boolean {
    return this._isVideo;
  }
  set isVideo(val) {
    this._isVideo = val;
  }

  private _isPresenting!: boolean;
  get isPresenting(): boolean {
    return this._isPresenting;
  }

  private _volume!: number;
  set volume(val) {
    val = Math.round(val);
    this._volume = val;
  }
  get volume(): number {
    return this._volume;
  }

  private _stream: any;
  set stream(val) {
    if (val) {
      if (val.hasVideo) {
        const remoteVideoTrack = val?.videoTrack;
        setTimeout(() => {
          remoteVideoTrack?.play("remote_stream_" + val.uid);
        });
      }
      if (val.hasAudio) {
        const remoteAudioTrack = val?.audioTrack;
        remoteAudioTrack?.play();
      }
      this._stream = val;
    }
  }
  get stream(): any {
    return this._stream;
  }

  constructor(uid: number, name: string, isPresenting: boolean, audio: boolean, video: boolean, volume: number, stream: any, pin: boolean, number: number = 0) {
    this.uid = uid;
    this._isPresenting = isPresenting;
    this._isAudio = audio;
    this._isVideo = video;
    this._volume = volume
    this._name = name;
    this.initial = name;
    this.stream = stream;
    this._pin = pin;
    this._number = number;
  };
}
