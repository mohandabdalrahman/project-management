import {Component, inject, Inject, input, output, signal} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogClose, MatDialogContent, MatDialogRef, MatDialogTitle } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import {Task, TaskCategory, TaskDialogData, TaskStatus} from '../../core/models/task';


@Component({
  selector: 'app-task-dialog',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatDialogTitle, MatDialogContent, MatDialogActions, MatDialogClose,
    MatFormFieldModule, MatInputModule, MatSelectModule, MatDatepickerModule, MatButtonModule
  ],
  templateUrl: './task-dialog.component.html',
  styleUrl: './task-dialog.component.scss',
})
export class TaskDialogComponent {
  private fb = inject(FormBuilder)
  categories = Object.values(TaskCategory);
  statuses = Object.values(TaskStatus);

  form = this.fb.group({
    title: ['', [Validators.required, Validators.maxLength(100)]],
    description: [''],
    assignedTo: ['', Validators.required],
    dueDate: [new Date(), Validators.required],
    estimatedHours: [0, [Validators.required, Validators.min(0)]],
    category: [TaskCategory.Dev, Validators.required],
    status: [TaskStatus.New, Validators.required],
  });

  constructor(private dialogRef: MatDialogRef<TaskDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: TaskDialogData) {
    if (data?.task) {
      const task = data?.task;
      this.form.patchValue({
        title: task?.title,
        description: task?.description,
        assignedTo: task?.assignedTo,
        dueDate: new Date(task?.dueDate),
        estimatedHours: task?.estimatedHours,
        category: task?.category,
        status: task?.status,
      });
    }
  }

  onSubmit() {
    if (this.form.invalid) return;
    const taskData = this.form.value;
    const dto = {
      title: taskData.title!,
      description: taskData.description ?? '',
      assignedTo: taskData.assignedTo!,
      dueDate: (taskData.dueDate as Date).toISOString(),
      estimatedHours: Number(taskData.estimatedHours ?? 0),
      category: taskData.category!,
      status: taskData.status!
    } satisfies Omit<Task, 'id'>;
    this.dialogRef.close(dto);
  }
}
