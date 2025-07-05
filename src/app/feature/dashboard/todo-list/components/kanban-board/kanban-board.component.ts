import {
  Task,
  TaskColumn,
  TaskStatus,
} from './../../interfaces/task.interface';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
import { CardKanbanItemComponent } from '../card-kanban-item/card-kanban-item.component';
import { TaskService } from '../../services/task.service';
import { CommonModule } from '@angular/common';
import { TaskModalComponent } from '../task-modal/task-modal.component';
import { DeleteTaskModalComponent } from '../delete-task-modal/delete-task-modal.component';
import {
  CdkDrag,
  CdkDragDrop,
  CdkDropList,
  CdkDropListGroup,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-kanban-board',
  imports: [
    CardKanbanItemComponent,
    CommonModule,
    TaskModalComponent,
    DeleteTaskModalComponent,
    CdkDrag,
    CdkDropList,
    CdkDropListGroup,
  ],
  templateUrl: './kanban-board.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class KanbanBoardComponent {
  taskService = inject(TaskService);
  columns = this.taskService.columns;
  TaskStatus = TaskStatus;

  // Signals para la edicion de tarea
  isTaskModalOpen = signal<boolean>(false);
  editingTask = signal<Task | null>(null);

  // Signal para la eliminacion de tarea
  isDeleteTaskModalOpen = signal<boolean>(false);
  taskToDelete = signal<Task | null>(null);

  //Metodos para manejar la edicion y creacion de tareas
  onTaskSave(task: Task) {
    if (this.editingTask()) {
      console.log('Updating task', task);
      this.taskService.updateTask(task);
    } else {
      console.log('Creating new task', task);
      this.taskService.addTask(task);
    }
    this.closeTaskModalEdition();
  }

  // Metodo para cerrar el modal de edicion de tarea
  // y resetear el estado de edicion
  closeTaskModalEdition() {
    this.isTaskModalOpen.set(false);
    this.editingTask.set(null);
  }

  // Metodos para manejar la apertura y creacion de tareas
  openTaskModal() {
    console.log('Opening task modal');
    this.isTaskModalOpen.set(true);
    this.editingTask.set(null);
  }

  // Metodo para editar una tarea
  editTask(task: Task) {
    this.editingTask.set(task);
    console.log('Editing task', this.editingTask());

    this.isTaskModalOpen.set(true);
  }

  // Metodo para abrir el modal de eliminacion de tarea
  openDeleteTask(task: Task) {
    this.taskToDelete.set(task);
    this.isDeleteTaskModalOpen.set(true);
  }

  // Metodo para cerrar el modal de eliminacion de tarea
  closeDeleteTaskModal() {
    this.isDeleteTaskModalOpen.set(false);
    this.taskToDelete.set(null);
  }

  // Metodo para eliminar una tarea
  deleteTask() {
    if (this.taskToDelete()) {
      console.log('Deleting task', this.taskToDelete());
      this.taskService.deleteTask(this.taskToDelete()?.id!);
    }
    this.closeDeleteTaskModal();
  }

  drop(event: CdkDragDrop<Task[]>, column: TaskColumn) {
    console.log(column);
    const { previousIndex, currentIndex, container, previousContainer, item } =
      event;

    const draggedTask = item.data as Task;
    if (!draggedTask) return;

    const sourceColumnData = previousContainer.data as Task[];
    const sourceStatus = sourceColumnData[previousIndex].status;

    if (previousContainer.id === container.id) {
      //Esto significa que la tarea se ha movido dentro de la misma columna
      //esto mueve de manera visual las tarjetas
      moveItemInArray(container.data, previousIndex, currentIndex);

      //Actualiza el orden de las tareas en la columna
      this.taskService.reorderTasks(
        column.id,
        container.data.map((task) => task.id)
      );
    } else {
      //Esto significa que la tarea se ha movido a otra columna
      // esto transfiere la tarea de una columna a otra
      transferArrayItem(
        previousContainer.data,
        container.data,
        previousIndex,
        currentIndex
      );

      //Actualiza donde va la tarea y modifica el estado de la tarea

      this.taskService.reorderTaskOtherColumn(
        draggedTask.id,
        sourceStatus,
        column.id,
        currentIndex
      );
    }
  }
}
