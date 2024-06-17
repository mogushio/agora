
import { RouterModule, Routes } from "@angular/router";
import { MainComponent } from './main/main.component';
import { AgoraCredentialComponent } from "./agora-credential/agora-credential.component";
import { LeaveComponent } from "./leave/leave.component";
import { NgModule } from "@angular/core";

const routes: Routes = [
  {
    path: '',
    component: AgoraCredentialComponent,
  },
  {
    path: 'agora/:id',
    component: MainComponent,
  },
  {
    path: 'leave',
    component: LeaveComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AgoraRoutingModule {}
