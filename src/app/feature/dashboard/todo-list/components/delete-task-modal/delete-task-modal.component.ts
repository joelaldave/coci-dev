import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  input,
  output,
  ViewChild,
} from '@angular/core';
import { Task } from '../../interfaces/task.interface';

@Component({
  selector: 'app-delete-task-modal',
  imports: [CommonModule],
  templateUrl: './delete-task-modal.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DeleteTaskModalComponent {
  // Inputs
  isOpen = input.required<boolean>();
  task = input<Task | null>(null);

  // Outputs
  onConfirm = output<void>();
  onCancel = output<void>();

  @ViewChild('dialogRef') dialogRef?: ElementRef<HTMLDialogElement>;

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

  confirmDelete() {
    this.onConfirm.emit();
  }

  cancelDelete() {
    this.onCancel.emit();
  }

  getPriorityText(priority: string): string {
    switch (priority) {
      case 'high':
        return 'Alta';
      case 'medium':
        return 'Media';
      case 'low':
        return 'Baja';
      default:
        return priority;
    }
  }

  getPriorityBadgeClass(priority: string): string {
    switch (priority) {
      case 'high':
        return 'badge-error';
      case 'medium':
        return 'badge-warning';
      case 'low':
        return 'badge-success';
      default:
        return 'badge-neutral';
    }
  }
}
