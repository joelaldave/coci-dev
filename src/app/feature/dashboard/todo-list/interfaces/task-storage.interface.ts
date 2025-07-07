import { InjectionToken } from '@angular/core';
import { Task } from './task.interface';

export interface ITaskStorage {
  load(): Task[];
  save(tasks: Task[]): void;
}

export const TASK_STORAGE = new InjectionToken<ITaskStorage>('TaskStorage');