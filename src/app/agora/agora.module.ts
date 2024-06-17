import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { StreamsComponent } from './streams/streams.component';
import { ControlsComponent } from './controls/controls.component';
import { PeopleListComponent } from './people-list/people-list.component';
import { LeaveComponent } from './leave/leave.component';
import { ToasterComponent } from './toaster/toaster.component';
import { CheckMediaDeviceComponent } from './check-media-device/check-media-device.component';
import { GroupChatComponent } from './group-chat/group-chat.component';
import { RecordingComponent } from './recording/recording.component';
import { AgoraRoutingModule } from './agora-routing.module';
import { WithoutScreenSharePipe } from './models/withoutScreenShare';
import { WithScreenSharePipe } from './models/withScreenShare.pipe';
import { AgoraCredentialComponent } from './agora-credential/agora-credential.component';
import { MainComponent } from './main/main.component';


@NgModule({
  declarations: [
    MainComponent,
    StreamsComponent,
    ControlsComponent,
    AgoraCredentialComponent,
    WithScreenSharePipe,
    WithoutScreenSharePipe,
    CheckMediaDeviceComponent,
    LeaveComponent,
    PeopleListComponent,
    ToasterComponent,
    GroupChatComponent,
    RecordingComponent
  ],
  imports: [
    CommonModule,
    AgoraRoutingModule,
    ReactiveFormsModule
  ]
})
export class AgoraModule { }
