import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  inject,
  input,
  output,
  ViewChild,
} from '@angular/core';
import {
  Task,
  TaskPriority,
  TaskStatus,
} from '../../interfaces/task.interface';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
@Component({
  selector: 'app-task-modal',
  imports: [ReactiveFormsModule],
  templateUrl: './task-modal.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TaskModalComponent {
  isOpen = input<boolean>(false);
  editingTask = input<Task | null>(null);

  save = output<Task>();
  close = output<void>();

  form!: FormGroup;

  priorities = [
    { value: TaskPriority.LOW, label: 'Baja' },
    { value: TaskPriority.MEDIUM, label: 'Media' },
    { value: TaskPriority.HIGH, label: 'Alta' },
  ];
  statuses = [
    { value: TaskStatus.TODO, label: 'Por hacer' },
    { value: TaskStatus.IN_PROGRESS, label: 'En progreso' },
    { value: TaskStatus.IN_REVIEW, label: 'En revisión' },
    { value: TaskStatus.COMPLETED, label: 'Completada' },
  ];

  fb = inject(FormBuilder);

  @ViewChild('dialogRef') dialogRef!: ElementRef<HTMLDialogElement>;

  ngOnInit() {
    this.initForm();
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

  initForm() {
    this.form = this.fb.group({
      title: [
        this.editingTask()?.title ?? '',
        [Validators.required, Validators.maxLength(100)],
      ],
      description: [
        this.editingTask()?.description ?? '',
        [Validators.required, Validators.maxLength(500)],
      ],
      priority: [
        this.editingTask()?.priority ?? TaskPriority.LOW,
        Validators.required,
      ],
      status: [
        this.editingTask()?.status ?? TaskStatus.TODO,
        Validators.required,
      ],
      category: [
        this.editingTask()?.category ?? '',
        [Validators.required, Validators.maxLength(50)],
      ],
      assignee: [
        this.editingTask()?.assignee ?? '',
        [Validators.required, Validators.maxLength(50)],
      ],
      assigneeInitials: [
        this.editingTask()?.assigneeInitials ?? '',
        [Validators.required, Validators.maxLength(4)],
      ],
      assigneeColor: [this.editingTask()?.assigneeColor ?? '#4A90E2'],
      dueDate: [
        this.editingTask()?.dueDate
          ? this.formatDate(this.editingTask()!.dueDate)
          : '',
        Validators.required,
      ],
    });
  }

  formatDate(date: Date | string): string {
    const d = typeof date === 'string' ? new Date(date) : date;
    return d.toISOString().substring(0, 10);
  }

  onSave() {
    if (this.form.valid) {
      this.save.emit(this.form.value);
    }
  }

  onClose() {
    this.close.emit();
  }
}
