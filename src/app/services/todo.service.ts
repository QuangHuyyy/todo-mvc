import { LocalStorageService } from './local-storage.service';
import { Filter } from './../models/filtering.model';
import { Todo } from './../models/todo.model';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TodoService {
  private static readonly TodoStorageKey = 'todos';

  private todos: Todo[] = []; // Tổng tất cả các todo
  private filteredTodos: Todo[] = []; // Những todo hiển thị trên web
  private lengthSubject: BehaviorSubject<number> = new BehaviorSubject<number>(
    0
  ); // theo dõi length của todos
  private displayTodosSubject: BehaviorSubject<Todo[]> = new BehaviorSubject<
    Todo[]
  >([]); // Theo dõi filteredTodos
  private currentFiltered: Filter = Filter.ALL;

  public todos$: Observable<Todo[]> = this.displayTodosSubject.asObservable();
  public length$: Observable<number> = this.lengthSubject.asObservable();

  constructor(private storageService: LocalStorageService) {}

  fetchFromLocalStorage() {
    this.todos =
      this.storageService.getValue<Todo[]>(TodoService.TodoStorageKey) || [];
    this.filteredTodos = [...this.todos];
    this.updateTodosData();
  }

  updateToLocalStorage() {
    this.storageService.setObject(TodoService.TodoStorageKey, this.todos);
    this.filterTodos(this.currentFiltered, false);
    this.updateTodosData();
  }

  filterTodos(filter: Filter, isFiltering: boolean = true) {
    this.currentFiltered = filter;
    switch (filter) {
      case Filter.ACTIVE:
        this.filteredTodos = this.todos.filter((todo) => !todo.isCompleted);
        break;
      case Filter.COMPLETED:
        this.filteredTodos = this.todos.filter((todo) => todo.isCompleted);
        break;
      case Filter.ALL:
        this.filteredTodos = [...this.todos];
        break;
    }

    if (isFiltering) {
      this.updateToLocalStorage();
    }
  }

  addTodo(content: string) {
    const date: number = new Date(Date.now()).getTime();
    const newTodo: Todo = new Todo(date, content);
    this.todos.unshift(newTodo);
    this.updateToLocalStorage();
  }

  changeTodoStatus(id: number, isCompleted: boolean) {
    const index = this.todos.findIndex((t) => t.id === id);
    const todo = this.todos[index];
    todo.isCompleted = isCompleted;
    this.todos.splice(index, 1, todo);
    this.updateToLocalStorage();
  }

  editTodo(id: number, content: string) {
    const index = this.todos.findIndex((t) => t.id === id);
    const todo = this.todos[index];
    todo.content = content;
    this.todos.splice(index, 1, todo);
    this.updateToLocalStorage();
  }
  deleteTodo(id: number) {
    const index = this.todos.findIndex((t) => t.id === id);
    this.todos.splice(index, 1);
    this.updateToLocalStorage();
  }

  toggleAll() {
    this.todos = this.todos.map((todo) => {
      return {
        ...todo,
        isCompleted: !this.todos.every((t) => t.isCompleted),
      };
    });
    this.updateToLocalStorage();
  }

  private updateTodosData() {
    this.displayTodosSubject.next(this.filteredTodos);
    this.lengthSubject.next(this.todos.length);
  }
}
