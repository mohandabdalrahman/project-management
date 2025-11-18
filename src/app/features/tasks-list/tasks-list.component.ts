import { CommonModule } from '@angular/common';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Task, TaskCategory, TaskStatus } from '../../core/models/task';
import { TaskStore } from '../../core/state/task.store';
import { TaskDialogComponent } from '../task-dialog/task-dialog.component';
import { RouterLink } from '@angular/router';
import { MatChipsModule } from '@angular/material/chips';
import {ConfirmDialogComponent} from '../../shared/confirm-dialog/confirm-dialog.component';
import {Component, ViewChild, computed, effect, signal, AfterViewInit} from '@angular/core';

@Component({
  selector: 'app-tasks-list-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    MatTableModule, MatPaginatorModule, MatSortModule,
    MatIconModule, MatButtonModule, MatTooltipModule,
    MatFormFieldModule, MatInputModule, MatDialogModule, MatChipsModule, MatSnackBarModule
  ],
  templateUrl: './tasks-list.component.html',
  styleUrl: './tasks-list.component.scss',
})
export class TasksListComponent implements  AfterViewInit{
  displayedColumns = ['title', 'description', 'assignedTo', 'dueDate', 'estimatedHours', 'category', 'status', 'actions'];
  dataSource = new MatTableDataSource<Task>([]);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private store: TaskStore, private dialog: MatDialog, private snack: MatSnackBar) {
    effect(() => {
      const list = this.store.tasks();
      this.dataSource.data = list;
      if (this.paginator) this.dataSource.paginator = this.paginator;
      if (this.sort) this.dataSource.sort = this.sort;
    });
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value?.trim().toLowerCase();
    this.dataSource.filter = filterValue;
  }

  createTask() {
    const ref = this.dialog.open(TaskDialogComponent, { data: { mode: 'create' } ,  width: '600px' });
    ref.afterClosed().subscribe((dto: Omit<Task, 'id'> | undefined) => {
      if (dto) {
        this.store.add(dto);
        this.snack.open('Task created', 'OK', { duration: 2000 });
      }
    });
  }

  editTask(task: Task) {
    const ref = this.dialog.open(TaskDialogComponent, { data: { mode: 'edit', task } ,  width: '600px' });
    ref.afterClosed().subscribe((dto: Omit<Task, 'id'> | undefined) => {
      if (dto) {
        this.store.update(task.id, dto);
        this.snack.open('Task updated', 'OK', { duration: 2000 });
      }
    });
  }

  deleteTask(task: Task) {
    const ref = this.dialog.open(ConfirmDialogComponent, { data: { title: 'Delete Task', message: `Delete "${task.title}"?`, confirmText: 'Delete' } });
    ref.afterClosed().subscribe((confirm: boolean) => {
      if (confirm) {
        this.store.remove(task.id);
        this.snack.open('Task deleted', 'OK', { duration: 2000 });
      }
    });
  }
}

