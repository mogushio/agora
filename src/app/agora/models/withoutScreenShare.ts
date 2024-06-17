import { Pipe, PipeTransform } from "@angular/core";
import { RemoteStream } from "./remoteStream";

@Pipe({
  name: 'withoutScreenShare',
  pure: false,
})
export class WithoutScreenSharePipe implements PipeTransform {

  transform(remoteStreams: { [name: number]: RemoteStream }): { [name: number]: RemoteStream } {
    const streams: { [name: number]: RemoteStream } = {};
    for (const key in remoteStreams) {
      if (!remoteStreams[key].isPresenting) {
        streams[key] = remoteStreams[key];
      }
    }
    return streams;
  }
}
