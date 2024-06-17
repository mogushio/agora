import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-toaster',
  standalone: false,
  templateUrl: './toaster.component.html',
  styleUrl: './toaster.component.scss'
})
export class ToasterComponent {

  @Input() toasterMsg!: string;
  @Output() emitToasterMsg = new EventEmitter<string>();

  private toasterSub!: any;

  ngOnInit() {
    this.toasterSub = setInterval(() => {
      this.toasterMsg = '';
      this.emitToasterMsg.emit(this.toasterMsg);
      clearInterval(this.toasterSub);
    }, 5000);
  }

  ngOnDestroy() {
    clearInterval(this.toasterSub);
  }
}
