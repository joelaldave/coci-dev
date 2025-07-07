import { TASK_STORAGE } from './feature/dashboard/todo-list/interfaces/task-storage.interface';
import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZonelessChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { TaskLocalStorageService } from './feature/dashboard/todo-list/services/task-local-storage.service';

export const appConfig: ApplicationConfig = {
  providers: [
    { provide: TASK_STORAGE, useClass: TaskLocalStorageService },
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideRouter(routes)
  ]
};
