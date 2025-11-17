import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, RouterLinkActive, MatToolbarModule, MatButtonModule, MatIconModule],
  template: `
    <mat-toolbar color="primary" role="navigation" class="app-toolbar">
      <button mat-icon-button aria-label="Home" routerLink="/tasks">
        <mat-icon>task</mat-icon>
      </button>
      <span class="brand">Project Management</span>
      <span class="spacer"></span>
      <a mat-button routerLink="/tasks" routerLinkActive="active" aria-label="Tasks">Tasks</a>
      <a mat-button routerLink="/dashboard" routerLinkActive="active" aria-label="Dashboard">Dashboard</a>
    </mat-toolbar>

    <div class="container">
      <router-outlet />
    </div>
  `,
  styleUrl: './app.scss'
})
export class App {
}
