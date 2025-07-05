import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
import { KanbanBoardComponent } from '../../components/kanban-board/kanban-board.component';
import { TaskService } from '../../services/task.service';
import { ListBoardComponent } from "../../components/list-board/list-board.component";

@Component({
  selector: 'app-general-page',
  imports: [KanbanBoardComponent, ListBoardComponent],
  templateUrl: './general-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GeneralPageComponent {
  stats = inject(TaskService).stats;

  currentView = signal<'list' | 'kanban'>('kanban');

  switchView(view: 'list' | 'kanban') {
    this.currentView.set(view);
  }
}
