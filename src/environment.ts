export const environment = {
  production: false,
  agoraUrl: 'https://api.agora.io/v1/apps/',
  username: '<Your username>',
  password: '<Your Password>',
  mode: 'mix',
  token: "",
  resourceExpiredHour: 24,
  scene: 0,
  storageConfig: {
    vendor: 1, //S3
    region: 14,//ap_south_1
    bucket: '<Your Bucket Name>',
    accessKey: '<Your access Key>',
    secretKey: '<Your Secret Key>',
    fileNamePrefix: ["directory1"]
  },
  maxIdleTime: 30,
  streamTypes: 2,
  audioProfile: 1,
  channelType: 0,
  videoStreamType: 0,
  transcodingConfig: {
    height: 640,
    width: 360,
    bitrate: 500,
    fps: 15,
    mixedVideoLayout: 1,
    backgroundColor: "#FF0000",
  },
  subscribeUidGroup: 0,
  recordingFileConfig: { avFileType: ["hls", "mp4"] }
}
