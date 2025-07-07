import { Injectable } from '@angular/core';
import { ITaskStorage } from '../interfaces/task-storage.interface';
import { Task } from '../interfaces/task.interface';

@Injectable({
  providedIn: 'root'
})
export class TaskLocalStorageService implements ITaskStorage {

  private readonly STORAGE_KEY = 'tasks';

  load(): Task[] {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as Task[];
        return parsed.map((task) => ({
          ...task,
          createdAt: new Date(task.createdAt),
          updatedAt: new Date(task.updatedAt),
          dueDate: new Date(task.dueDate),
          completedAt: task.completedAt ? new Date(task.completedAt) : undefined,
        }));
      }
    } catch {}
    return [];
  }
  save(tasks: Task[]): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(tasks));
    } catch (error) {
      console.error('Error saving tasks to localStorage', error);
    }
  }

}
