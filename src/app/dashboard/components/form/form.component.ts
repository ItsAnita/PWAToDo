import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input,Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-form',
  standalone: true,
  imports: [
    CommonModule,
  ],
  templateUrl: './form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormComponent {
  @Input({required: true}) mySignal!: any;
  @Output() delete = new EventEmitter<number>();

  deleteTask(index: number) {
    this.delete.emit(index);
  }


 }
