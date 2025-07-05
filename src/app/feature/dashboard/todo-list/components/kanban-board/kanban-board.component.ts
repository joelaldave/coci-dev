import {  Task, TaskStatus } from './../../interfaces/task.interface';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { CardKanbanItemComponent } from "../card-kanban-item/card-kanban-item.component";
import { TaskService } from '../../services/task.service';
import { CommonModule } from '@angular/common';
import { TaskModalComponent } from "../task-modal/task-modal.component";

@Component({
  selector: 'app-kanban-board',
  imports: [CardKanbanItemComponent, CommonModule, TaskModalComponent],
  templateUrl: './kanban-board.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class KanbanBoardComponent { 

  columns = inject(TaskService).columns;
  TaskStatus = TaskStatus;
  isTaskModalOpen = signal<boolean>(false);
  editingTask = signal<Task | null >(null);

  onTaskSave(task: Task) {
    
  }
  closeTaskModal() {
    this.isTaskModalOpen.set(false);
    this.editingTask.set(null);
  }

  openTaskModal() {
    console.log("Opening task modal");
    this.isTaskModalOpen.set(true);
    this.editingTask.set(null);
  }


}
