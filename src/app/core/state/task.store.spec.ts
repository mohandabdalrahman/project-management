import { TaskCategory, TaskStatus } from '../../core/models/task';
import { TaskStore } from './task.store';

describe('TaskStore', () => {
  let store: TaskStore;

  beforeEach(() => {
    // Isolate storage between tests
    localStorage.clear();
    store = new TaskStore();
  });

  it('should initialize with seed tasks-list', () => {
    expect(store.totalCount()).toBeGreaterThan(0);
  });

  it('should add a task', () => {
    const prev = store.totalCount();
    store.add({
      title: 'New Task',
      description: 'desc',
      assignedTo: 'Tester',
      dueDate: new Date().toISOString(),
      estimatedHours: 2,
      category: TaskCategory.Dev,
      status: TaskStatus.New
    });
    expect(store.totalCount()).toBe(prev + 1);
  });

  it('should update a task', () => {
    const first = store.tasks()[0];
    store.update(first.id, { status: TaskStatus.Closed, estimatedHours: 10 });
    const updated = store.getById(first.id)!;
    expect(updated.status).toBe(TaskStatus.Closed);
    expect(updated.estimatedHours).toBe(10);
  });

  it('should remove a task', () => {
    const id = store.tasks()[0].id;
    const prev = store.totalCount();
    store.remove(id);
    expect(store.totalCount()).toBe(prev - 1);
    expect(store.getById(id)).toBeNull();
  });

  it('should compute stats by category and status', () => {
    const cats = store.tasksByCategory();
    const statuses = store.tasksByStatus();
    // Should include all categories/statuses even if zero
    const catNames = cats.map(c => c.name);
    expect(catNames).toContain(TaskCategory.Dev);
    expect(catNames).toContain(TaskCategory.UI);

    const statusNames = statuses.map(s => s.name);
    expect(statusNames).toContain(TaskStatus.New);
    expect(statusNames).toContain(TaskStatus.Active);
    expect(statusNames).toContain(TaskStatus.Closed);
  });
});
