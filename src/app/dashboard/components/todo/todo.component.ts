import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, signal,  PLATFORM_ID, Inject, HostListener, } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, MinLengthValidator, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { FormComponent } from '../form/form.component';
import { isPlatformBrowser } from '@angular/common';

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

  // Variables para la PWA
  deferredPrompt: any = null;
  showInstallPrompt = false;
  hasInstalled = false;

  constructor(@Inject(PLATFORM_ID) private platformId: any) {
    this.formPendientes = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(4)]],
    });
  }


  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.checkInstallStatus();
    }
  }

  checkInstallStatus() {
    this.hasInstalled = window.matchMedia('(display-mode: standalone)').matches;

    if (!this.hasInstalled) {
      const installStatus = localStorage.getItem('installStatus');
      if (installStatus === 'installed') {
        localStorage.removeItem('installStatus');
      } else if (installStatus === 'dismissed') {
        this.showInstallPrompt = false;
      } else {
        this.showInstallPrompt = true;
      }
    }
  }

  @HostListener('window:beforeinstallprompt', ['$event'])
  onBeforeInstallPrompt(event: Event) {
    if (isPlatformBrowser(this.platformId)) {
      event.preventDefault();
      this.deferredPrompt = event;
      if (!this.hasInstalled) {
        this.showInstallPrompt = true;
      }
    }
  }

  async installApp() {
    if (isPlatformBrowser(this.platformId) && this.deferredPrompt) {
      this.showInstallPrompt = false;
      this.deferredPrompt.prompt();
      const { outcome } = await this.deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        console.log('Usuario aceptó la instalación');
        localStorage.setItem('installStatus', 'installed');
      } else {
        console.log('Usuario rechazó la instalación');
        localStorage.setItem('installStatus', 'dismissed');
      }
      this.deferredPrompt = null;
      this.hasInstalled = true;
    }
  }

  dismissInstall() {
    this.showInstallPrompt = false;
    localStorage.setItem('installStatus', 'dismissed');
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
