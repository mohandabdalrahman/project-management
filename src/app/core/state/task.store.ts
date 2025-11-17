import { Injectable, computed, effect, signal } from '@angular/core';
import { SEED_TASKS, Task, TaskCategory, TaskStatus } from '../models/task';

const STORAGE_KEY = 'pm_tasks_v1';

@Injectable({ providedIn: 'root' })
export class TaskStore {
  private readonly _tasks = signal<Task[]>(this.loadFromStorage() ?? SEED_TASKS);
  readonly tasks = this._tasks.asReadonly();
  readonly totalCount = computed(() => this._tasks().length);
  readonly totalEstimatedHours = computed(() => this._tasks().reduce((sum, t) => sum + (t.estimatedHours || 0), 0));
  readonly tasksByCategory = computed(() => this.groupCount(Object.values(TaskCategory), (t) => t.category));
  readonly tasksByStatus = computed(() => this.groupCount(Object.values(TaskStatus), (t) => t.status));

  constructor() {
    effect(() => {
      const data = this._tasks();
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      } catch {
      }
    });
  }

  add(task: Omit<Task, 'id'>) {
    const id = Math.random().toString(36).slice(2);
    const newTask: Task = { id, ...task };
    this._tasks.update(list => [newTask, ...list]);
  }

  update(id: string, changes: Partial<Omit<Task, 'id'>>) {
    this._tasks.update(list => list.map(t => t.id === id ? { ...t, ...changes, id: t.id } : t));
  }

  remove(id: string) {
    this._tasks.update(list => list.filter(t => t.id !== id));
  }

  getById(id: string) {
    return this._tasks().find(t => t.id === id) || null;
  }

  private loadFromStorage(): Task[] | null {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return null;
      const parsed = JSON.parse(raw) as Task[];
      return Array.isArray(parsed) ? parsed : null;
    } catch {
      return null;
    }
  }

  private groupCount<K extends string | number>(keys: readonly K[], selector: (t: Task) => any) {
    const counts = new Map<string, number>();
    for (const key of keys as any as string[]) counts.set(key, 0);
    for (const t of this._tasks()) {
      const k = String(selector(t));
      counts.set(k, (counts.get(k) || 0) + 1);
    }
    return Array.from(counts.entries()).map(([name, value]) => ({ name, value }));
  }
}
