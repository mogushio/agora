import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../../services/api/api.service';

@Component({
  selector: 'app-leave',
  standalone: false,
  templateUrl: './leave.component.html',
  styleUrl: './leave.component.scss'
})
export class LeaveComponent {

  constructor(
    private apiService: ApiService,
    private router: Router
  ) {
    if (!this.apiService.appId) {
      this.router.navigate(['/']);
    }
  }

  rejoin() {
    this.router.navigate(['agora/' + this.apiService.appId],
      { queryParams: { cname: this.apiService.cname } });
  }
}
