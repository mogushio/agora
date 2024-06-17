import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { API } from "../../constants/apiUrl.constant";
import { environment } from "../../../environment";

@Injectable({
  providedIn: 'root',
})
export class ApiService {

  public appId!: string;
  public cname!: string;
  public uid!: string | undefined;
  public resourceId!: string;
  public sid!: string;

  constructor(
    private httpClient: HttpClient,
  ) {}

  acquireRecording(): Observable<{ resourceId: string }> {
    return this.httpClient
      .post<{ resourceId: string }>(this.appId + '/' + API.CLOUD_RECORDING + '/' + API.ACQUIRE, {
        cname: this.cname,
        uid: this.uid,
        clientRequest: {
          resourceExpiredHour: environment.resourceExpiredHour,
          scene: environment.scene
        }
      })
  }

  startRecording(): Observable<any> {
    return this.httpClient
      .post<any>(
        this.appId + '/' + API.CLOUD_RECORDING + '/' +
        API.RESOURCE_ID + '/' + this.resourceId + '/' +
        API.MODE + '/' + environment.mode + '/' + API.START,
        {
          cname: this.cname,
          uid: this.uid,
          clientRequest: {
            token: environment.token,
            recordingConfig: {
              maxIdleTime: environment.maxIdleTime,
              streamTypes: environment.streamTypes,
              audioProfile: environment.audioProfile,
              channelType: environment.channelType,
              videoStreamType: environment.videoStreamType,
              transcodingConfig: environment.transcodingConfig,
              subscribeVideoUids: [this.uid],
              subscribeAudioUids: [this.uid],
              subscribeUidGroup: environment.subscribeUidGroup,
            },
            storageConfig: environment.storageConfig
          }
        })
  }

  stopRecording(): Observable<any> {
    return this.httpClient
      .post<any>(
        this.appId + '/' + API.CLOUD_RECORDING + '/' +
        API.RESOURCE_ID + '/' + this.resourceId + '/' + API.SID + '/' + this.sid + '/' +
        API.MODE + '/' + environment.mode + '/' + API.STOP,
        {
          cname: this.cname,
          uid: this.uid,
          clientRequest: {}
        })
  }

  queryRecording(): Observable<any> {
    return this.httpClient.get<any>(
      this.appId + '/' + API.CLOUD_RECORDING + '/' +
      API.RESOURCE_ID + '/' + this.resourceId + '/' + API.SID + '/' + this.sid + '/' +
      API.MODE + '/' + environment.mode + '/' + API.QUERY
    )
  }
}
