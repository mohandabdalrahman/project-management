import { MatCardModule } from '@angular/material/card';
import {Component, inject} from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { TaskStore } from '../../core/state/task.store';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  templateUrl:'dashboard.component.html',
  styleUrl: 'dashboard.component.scss',
  imports: [CommonModule, MatCardModule, MatIconModule, NgxChartsModule],
})
export class DashboardComponent {
  private store = inject(TaskStore)
  totalCount = this.store.totalCount;
  totalHours = this.store.totalEstimatedHours;
  byCategory = this.store.tasksByCategory;
  byStatus = this.store.tasksByStatus;
}
