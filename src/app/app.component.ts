import { map, Observable } from 'rxjs';
import { TodoService } from './services/todo.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  hasTodo$!: Observable<boolean>;
  constructor(private todoService: TodoService) {}

  ngOnInit(): void {
    this.todoService.fetchFromLocalStorage();
    this.hasTodo$ = this.todoService.length$.pipe(map((length) => length > 0));
  }
}
