import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from '@angular/core';
import { Task, TaskStatus } from '../../interfaces/task.interface';
import { CommonModule, DatePipe } from '@angular/common';

@Component({
  selector: 'app-card-kanban-item',
  imports: [CommonModule, DatePipe],
  templateUrl: './card-kanban-item.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CardKanbanItemComponent {
  task = input.required<Task>();
  editTask = output<Task>();
  deleteTask = output<Task>();
  isOverdue(): boolean {
    if (this.task().status === TaskStatus.COMPLETED) return false;
    const today = new Date();
    return this.task().dueDate < today;
  }

  onEdit() {
    this.editTask.emit(this.task());
  }
  onDelete() {
    this.deleteTask.emit(this.task());
  }
}
