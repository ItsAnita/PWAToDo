import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, MinLengthValidator, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { FormComponent } from '../form/form.component';


@Component({
  selector: 'app-todo',
  standalone: true,
  imports: [
    CommonModule,ReactiveFormsModule,RouterModule, FormComponent
  ],
  templateUrl: './todo.component.html',
  styleUrl: './todo.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TodoComponent {
  private fb = inject(FormBuilder);
  formPendientes!: FormGroup;

  constructor() {
    this.formPendientes = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(4)]],
    });
  }

  validaControl(control: string) {
    return this.formPendientes.get(control)?.errors && this.formPendientes.get(control)?.touched;
  }

  validaNameMin(control: string) {
    return this.formPendientes.get(control)?.errors?.['minlength'];
  }

  listaPendientes: any[] = [
    { title: "Comer" }
  ];

  public counterSignal = signal(this.listaPendientes);

  saveTask() {
    if (this.formPendientes.invalid) {
      this.formPendientes.markAllAsTouched();
    } else {
      let pendienteNuevo = {
        title: this.formPendientes.get('title')?.value,
      };
      this.counterSignal.set([...this.counterSignal(), pendienteNuevo]);
      this.formPendientes.reset();
    }
  }

  deleteTask(index: number) {
    this.counterSignal.update(val => val.filter((_, i) => i !== index));
  }

 }
