import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: '',
        loadChildren: () => import('./feature/dashboard/dashboard.routes').then(m => m.dashboardRoutes)
    }
];
