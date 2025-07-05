import {
  ChangeDetectionStrategy,
  Component,
  effect,
  ElementRef,
  inject,
  input,
  output,
  signal,
  ViewChild,
} from '@angular/core';
import {
  Task,
  TaskCreateRequest,
  TaskPriority,
  TaskStatus,
} from '../../interfaces/task.interface';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-task-modal',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './task-modal.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TaskModalComponent {
  private readonly fb = inject(FormBuilder);

  // Inputs
  isOpen = input.required<boolean>();
  editingTask = input<Task | null>(null);

  // Outputs
  onClose = output<void>();
  onSave = output<Task>();

  // Form
  taskForm: FormGroup;

  // Enums para templates
  TaskStatus = TaskStatus;
  TaskPriority = TaskPriority;

  // Estados
  isSubmitting = signal(false);
  selectedColor = signal('#3B82F6');

  // Colores disponibles para avatar
  avatarColors = [
    { name: 'Azul', value: '#3B82F6' },
    { name: 'Verde', value: '#10B981' },
    { name: 'Púrpura', value: '#8B5CF6' },
    { name: 'Rosa', value: '#EC4899' },
    { name: 'Amarillo', value: '#F59E0B' },
    { name: 'Rojo', value: '#EF4444' },
    { name: 'Índigo', value: '#6366F1' },
    { name: 'Esmeralda', value: '#059669' },
  ];

  @ViewChild('dialogRef') dialogRef?: ElementRef<HTMLDialogElement>;

  constructor() {
    this.taskForm = this.createForm();

    // Effect para resetear el formulario cuando cambia el editingTask
    effect((onCleanup) => {
      const task = this.editingTask();
      if (task) {
        this.loadTaskData(task);
      } else {
        this.resetForm();
      }
      onCleanup(() => {
        this.resetForm();
      });
    });
  }

  ngOnChanges() {
    if (this.isOpen() && !this.editingTask()) {
      this.resetForm();
    }
  }

  ngAfterViewChecked() {
    const dialog = this.dialogRef?.nativeElement;
    if (dialog) {
      if (this.isOpen() && !dialog.open) {
        dialog.showModal();
      } else if (!this.isOpen() && dialog.open) {
        dialog.close();
      }
    }
  }

  private createForm(): FormGroup {
    return this.fb.group({
      title: [
        '',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(100),
        ],
      ],
      description: [
        '',
        [
          Validators.required,
          Validators.minLength(10),
          Validators.maxLength(500),
        ],
      ],
      priority: [TaskPriority.MEDIUM, Validators.required],
      category: [
        '',
        [
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(50),
        ],
      ],
      dueDate: ['', Validators.required],
      assignee: [
        '',
        [
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(50),
        ],
      ],
      status: ['', Validators.required],
      progress: [0, [Validators.min(0), Validators.max(100)]],
    });
  }

  private loadTaskData(task: Task) {
    this.selectedColor.set(task.assigneeColor);
    this.taskForm.patchValue({
      title: task.title,
      description: task.description,
      priority: task.priority,
      category: task.category,
      dueDate: this.formatDateForInput(task.dueDate),
      assignee: task.assignee,
      status: task.status,
    });
  }

  private resetForm() {
    this.taskForm.reset();
    this.selectedColor.set('#3B82F6');
    this.isSubmitting.set(false);
  }

  private formatDateForInput(date: Date | string): string {
    const d = new Date(date);
    return d.toISOString().split('T')[0];
  }

  generateInitials(name: string): string {
    if (!name) return '?';
    return name
      .split(' ')
      .map((word) => word.charAt(0).toUpperCase())
      .slice(0, 2)
      .join('');
  }

  onColorSelect(color: string) {
    this.selectedColor.set(color);
  }

  onSubmit() {
    if (this.taskForm.invalid) {
      this.taskForm.markAllAsTouched();
      return;
    }

    this.isSubmitting.set(true);

    const formValue = this.taskForm.value;
    const assigneeInitials = this.generateInitials(formValue.assignee);

    const taskData: Task = {
      id: this.editingTask()?.id ?? '',
      title: formValue.title,
      description: formValue.description,
      status: formValue.status,
      priority: formValue.priority,
      category: formValue.category,
      dueDate: new Date(formValue.dueDate),
      assignee: formValue.assignee,
      assigneeInitials,
      assigneeColor: this.selectedColor(),
      createdAt: this.editingTask()?.createdAt ?? new Date(),
      updatedAt: new Date(),
      completedAt:
        formValue.status === TaskStatus.COMPLETED ? new Date() : undefined,
    };

    setTimeout(() => {
      this.onSave.emit(taskData);
      this.isSubmitting.set(false);
    }, 500);
  }

  onCancel() {
    this.onClose.emit();
  }

  // Getters para validación
  get titleError() {
    const control = this.taskForm.get('title');
    if (control?.touched && control?.errors) {
      if (control.errors['required']) return 'El título es requerido';
      if (control.errors['minlength']) return 'Mínimo 3 caracteres';
      if (control.errors['maxlength']) return 'Máximo 100 caracteres';
    }
    return null;
  }

  get descriptionError() {
    const control = this.taskForm.get('description');
    if (control?.touched && control?.errors) {
      if (control.errors['required']) return 'La descripción es requerida';
      if (control.errors['minlength']) return 'Mínimo 10 caracteres';
      if (control.errors['maxlength']) return 'Máximo 500 caracteres';
    }
    return null;
  }

  get categoryError() {
    const control = this.taskForm.get('category');
    if (control?.touched && control?.errors) {
      if (control.errors['required']) return 'La categoría es requerida';
      if (control.errors['minlength']) return 'Mínimo 2 caracteres';
      if (control.errors['maxlength']) return 'Máximo 50 caracteres';
    }
    return null;
  }

  get assigneeError() {
    const control = this.taskForm.get('assignee');
    if (control?.touched && control?.errors) {
      if (control.errors['required']) return 'El asignado es requerido';
      if (control.errors['minlength']) return 'Mínimo 2 caracteres';
      if (control.errors['maxlength']) return 'Máximo 50 caracteres';
    }
    return null;
  }

  get dueDateError() {
    const control = this.taskForm.get('dueDate');
    if (control?.touched && control?.errors) {
      if (control.errors['required']) return 'La fecha límite es requerida';
    }
    return null;
  }
}
