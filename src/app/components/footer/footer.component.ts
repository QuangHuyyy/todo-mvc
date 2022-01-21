import { Observable, Subject, map, takeUntil } from 'rxjs';
import { TodoService } from './../../services/todo.service';
import { Filter, FilterButton } from './../../models/filtering.model';
import { Component, OnDestroy, OnInit } from '@angular/core';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
})
export class FooterComponent implements OnInit, OnDestroy {
  filterButtons: FilterButton[] = [
    { type: Filter.ALL, label: 'All', isActive: true },
    { type: Filter.ACTIVE, label: 'Active', isActive: false },
    { type: Filter.COMPLETED, label: 'Completed', isActive: false },
  ];

  length: number = 0;
  hasCompleted$: Observable<boolean> = new Observable<boolean>();
  destroy$: Subject<null> = new Subject<null>();

  constructor(private todoService: TodoService) {}

  ngOnInit(): void {
    this.hasCompleted$ = this.todoService.todos$.pipe(
      map((todos) => todos.some((t) => t.isCompleted)),
      takeUntil(this.destroy$)
    );
    this.todoService.length$
      .pipe(takeUntil(this.destroy$))
      .subscribe((length) => {
        this.length = length;
      });
  }

  filter(type: Filter) {
    this.setActiveFilterBtn(type);
    this.todoService.filterTodos(type);
  }

  setActiveFilterBtn(type: Filter) {
    this.filterButtons.forEach((btn) => {
      btn.isActive = btn.type === type;
    });
  }

  clearCompleted(){
    this.todoService.clearCompleted();
  }

  ngOnDestroy(): void {
    this.destroy$.next(null);
    this.destroy$.complete();
  }
}
