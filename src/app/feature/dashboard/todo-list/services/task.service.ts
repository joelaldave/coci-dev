import { computed, inject, Injectable, signal } from '@angular/core';
import {
  Task,
  TaskColumn,
  TaskCreateRequest,
  TaskPriority,
  TaskStats,
  TaskStatus,
} from '../interfaces/task.interface';
import { ITaskStorage } from '../interfaces/task-storage.interface';
import { TaskLocalStorageService } from './task-local-storage.service';

const BASE_COLUMNS: TaskColumn[] = [
  {
    id: TaskStatus.TODO,
    title: 'Por hacer',
    color: 'bg-warning',
    badgeColor: 'badge-warning',
    hoverColor: 'hover:border-warning hover:text-warning',
    tasks: [],
  },
  {
    id: TaskStatus.IN_PROGRESS,
    title: 'En progreso',
    color: 'bg-info',
    badgeColor: 'badge-info',
    hoverColor: 'hover:border-info hover:text-info',
    tasks: [],
  },
  {
    id: TaskStatus.IN_REVIEW,
    title: 'En revisión',
    color: 'bg-accent',
    badgeColor: 'badge-accent',
    hoverColor: 'hover:border-accent hover:text-accent',
    tasks: [],
  },
  {
    id: TaskStatus.COMPLETED,
    title: 'Completadas',
    color: 'bg-success',
    badgeColor: 'badge-success',
    hoverColor: 'hover:border-success hover:text-success',
    tasks: [],
  },
];

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  private storage: ITaskStorage = inject(TaskLocalStorageService);

  task = signal<Task[]>(this.storage.load());
  columns = computed(() => this.organizeTaskInColumns(this.task()));
  stats = computed(() => this.calculateStats(this.task()));

  private organizeTaskInColumns(tasks: Task[]): TaskColumn[] {
    const columns = BASE_COLUMNS.map((col) => ({
      ...col,
      tasks: [] as Task[],
    }));

    tasks.forEach((task) => {
      const column = columns.find((col) => col.id === task.status);
      if (column) {
        column.tasks.push(task);
      }
    });

    return columns;
  }

  private calculateStats(tasks: Task[]): TaskStats {
    const now = new Date();

    const todoTasks = tasks.filter(
      (task) => task.status === TaskStatus.TODO
    ).length;
    const inProgressTasks = tasks.filter(
      (task) => task.status === TaskStatus.IN_PROGRESS
    ).length;
    const inReviewTasks = tasks.filter(
      (task) => task.status === TaskStatus.IN_REVIEW
    ).length;
    const completedTasks = tasks.filter(
      (task) => task.status === TaskStatus.COMPLETED
    ).length;
    const overdueTasks = tasks.filter(
      (task) =>
        task.dueDate &&
        task.dueDate < now &&
        task.status !== TaskStatus.COMPLETED
    ).length;

    const stats = {
      total: tasks.length,
      todo: todoTasks,
      inProgress: inProgressTasks,
      inReview: inReviewTasks,
      completed: completedTasks,
      overdue: overdueTasks,
    };
    return stats;
  }

  addTask(task: TaskCreateRequest): void {
    const newTask: Task = {
      ...task,
      id: crypto.randomUUID(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.task.update((currentTasks) => {
      const newTasks = [...currentTasks, newTask];
      this.storage.save(newTasks);
      return newTasks;
    });
  }

  updateTask(updatedTask: Task): void {
    this.task.update((currentTasks) => {
      const newTasks = currentTasks.map((task) =>
        task.id === updatedTask.id
          ? {
              ...updatedTask,
              updatedAt: new Date(),
              completedAt:
                updatedTask.status === TaskStatus.COMPLETED
                  ? new Date()
                  : undefined,
            }
          : task
      );
      this.storage.save(newTasks);
      return newTasks;
    });
  }

  deleteTask(taskId: string): void {
    this.task.update((currentTasks) => {
      const newTasks = currentTasks.filter((task) => task.id !== taskId);
      this.storage.save(newTasks);
      return newTasks;
    });
  }

  reorderTasks(columnId: TaskStatus, taskIds: string[]): void {
    this.task.update((currentTasks) => {
      // Tareas de la columna a reordenar
      const columnTasks = currentTasks.filter((t) => t.status === columnId);
      // Tareas de otras columnas
      const otherTasks = currentTasks.filter((t) => t.status !== columnId);

      // Reordenar las tareas de la columna según el nuevo orden de IDs
      const reorderedColumnTasks = taskIds
        .map((id) => columnTasks.find((t) => t.id === id))
        .filter((t): t is Task => t !== undefined);

      // Unir las tareas reordenadas con las demás
      const updatedTasks = [...otherTasks, ...reorderedColumnTasks];
      this.storage.save(updatedTasks);
      return updatedTasks;
    });
  }

  reorderTaskOtherColumn(
    taskId: string,
    sourceStatus: TaskStatus,
    targetStatus: TaskStatus,
    newIndex: number
  ): void {
    this.task.update((currentTasks) => {
      const task = currentTasks.find((t) => t.id === taskId);

      if (!task) {
        console.error('Task not found:', taskId);
        return currentTasks;
      }

      let updatedTasks = [...currentTasks];

      // Si la tarea cambió de columna, actualizar su estado
      if (sourceStatus !== targetStatus) {
        updatedTasks = updatedTasks.map((t) =>
          t.id === taskId
            ? { ...t, status: targetStatus, updatedAt: new Date() }
            : t
        );
      }

      // Obtener IDs de las tareas de la columna destino
      const columnTasks = updatedTasks
        .filter((t) => t.status === targetStatus)
        .map((t) => t.id);

      // Remover la tarea de su posición actual
      const currentIndex = columnTasks.indexOf(taskId);
      if (currentIndex !== -1) {
        columnTasks.splice(currentIndex, 1);
      }

      // Insertar en la nueva posición
      columnTasks.splice(newIndex, 0, taskId);

      // Reordenar usando el método existente
      const reorderedColumnTasks = columnTasks
        .map((id) => updatedTasks.find((t) => t.id === id))
        .filter((t): t is Task => t !== undefined);

      // Tareas de otras columnas
      const otherTasks = updatedTasks.filter((t) => t.status !== targetStatus);

      const finalTasks = [...otherTasks, ...reorderedColumnTasks];
      this.storage.save(finalTasks);
      return finalTasks;
    });
  }
}
