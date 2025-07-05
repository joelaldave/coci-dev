import { Routes } from "@angular/router";
import { PrincipalLayoutComponent } from "../../layouts/principal-layout/principal-layout.component";

export const dashboardRoutes: Routes = [
    {
        path: '',
        component: PrincipalLayoutComponent,
        children: [
            {
                path: 'todo-list',
                loadComponent: () => import('./todo-list/pages/general-page/general-page.component').then(m => m.GeneralPageComponent)
            },
        ]
    }
]