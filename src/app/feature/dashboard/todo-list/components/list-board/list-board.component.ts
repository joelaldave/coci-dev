import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  inject,
  signal,
} from '@angular/core';
import { TaskModalComponent } from '../task-modal/task-modal.component';
import { DeleteTaskModalComponent } from '../delete-task-modal/delete-task-modal.component';
import { TaskService } from '../../services/task.service';
import {
  Task,
  TaskPriority,
  TaskStatus,
} from '../../interfaces/task.interface';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-list-board',
  imports: [TaskModalComponent, DeleteTaskModalComponent, CommonModule],
  templateUrl: './list-board.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ListBoardComponent {
  private readonly taskService = inject(TaskService);
  private readonly destroyRef = inject(DestroyRef);

  task = this.taskService.task;

  // Estados del modal
  isModalOpen = signal(false);
  editingTask = signal<Task | null>(null);

  // Estados del modal de eliminación
  isDeleteModalOpen = signal(false);
  taskToDelete = signal<Task | null>(null);

  // Computed para estadísticas
  totalTasks = computed(() => this.task().length);

  // Enums para el template
  TaskStatus = TaskStatus;
  TaskPriority = TaskPriority;

  // Métodos para crear/editar tareas
  onAddTask() {
    this.editingTask.set(null);
    this.isModalOpen.set(true);
  }

  onEditTask(task: Task) {
    this.editingTask.set(task);
    this.isModalOpen.set(true);
  }

  onModalClose() {
    this.isModalOpen.set(false);
    this.editingTask.set(null);
  }

  onTaskSaved(task: Task) {
    if (this.editingTask()) {
      // Actualizar tarea existente
      this.taskService.updateTask({ ...task, id: task.id });
    } else {
      // Crear nueva tarea
      this.taskService.addTask({
        title: task.title,
        description: task.description,
        priority: task.priority,
        category: task.category,
        dueDate: task.dueDate,
        assignee: task.assignee,
        assigneeInitials: task.assigneeInitials,
        assigneeColor: task.assigneeColor,
        status: task.status,
      });
    }
    this.onModalClose();
  }

  // Métodos para eliminar tareas
  onDeleteTask(task: Task) {
    this.taskToDelete.set(task);
    this.isDeleteModalOpen.set(true);
  }

  onDeleteConfirm() {
    const task = this.taskToDelete();
    if (task) {
      this.taskService.deleteTask(task.id);
    }
    this.onDeleteCancel();
  }

  onDeleteCancel() {
    this.isDeleteModalOpen.set(false);
    this.taskToDelete.set(null);
  }

  // Toggle completado
  onToggleComplete(task: Task, completed: boolean) {
    const newStatus = completed ? TaskStatus.COMPLETED : TaskStatus.TODO;
    this.taskService.updateTask({ ...task, status: newStatus });
  }

  // Utilidades para badges y textos
  getPriorityText(priority: TaskPriority): string {
    switch (priority) {
      case TaskPriority.HIGH:
        return 'Alta';
      case TaskPriority.MEDIUM:
        return 'Media';
      case TaskPriority.LOW:
        return 'Baja';
      default:
        return priority;
    }
  }

  getPriorityBadgeClass(priority: TaskPriority): string {
    switch (priority) {
      case TaskPriority.HIGH:
        return 'badge-error';
      case TaskPriority.MEDIUM:
        return 'badge-warning';
      case TaskPriority.LOW:
        return 'badge-success';
      default:
        return 'badge-neutral';
    }
  }

  getStatusText(status: TaskStatus): string {
    switch (status) {
      case TaskStatus.TODO:
        return 'Pendiente';
      case TaskStatus.IN_PROGRESS:
        return 'En progreso';
      case TaskStatus.IN_REVIEW:
        return 'En revisión';
      case TaskStatus.COMPLETED:
        return 'Completada';
      default:
        return status;
    }
  }

  getStatusBadgeClass(status: TaskStatus): string {
    switch (status) {
      case TaskStatus.TODO:
        return 'badge-neutral';
      case TaskStatus.IN_PROGRESS:
        return 'badge-warning';
      case TaskStatus.IN_REVIEW:
        return 'badge-info';
      case TaskStatus.COMPLETED:
        return 'badge-success';
      default:
        return 'badge-neutral';
    }
  }

  isOverdue(task: Task): boolean {
    if (task.status === TaskStatus.COMPLETED) return false;
    return new Date(task.dueDate) < new Date();
  }

  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString('es-ES', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  }
}
