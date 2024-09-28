import { Routes } from '@angular/router';

export const routes: Routes = [

        {
            path: 'todolist',
            title: 'To Do List',
            loadComponent: () => import('./dashboard/components/todo/todo.component')
            .then(m => m.TodoComponent),
        },
        {
          path: '**',
          pathMatch:'full',
          redirectTo:'todolist'
      }

];
