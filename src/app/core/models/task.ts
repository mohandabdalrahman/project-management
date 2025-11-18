export enum TaskCategory {
  Dev = 'Dev',
  Test = 'Test',
  UI = 'UI',
  Db = 'Db'
}

export enum TaskStatus {
  New = 'New',
  Active = 'Active',
  Closed = 'Closed'
}

export interface Task {
  id: string;
  title: string;
  description: string;
  assignedTo: string;
  dueDate: string;
  estimatedHours: number;
  category: TaskCategory;
  status: TaskStatus;
}

export type TaskDialogData = {
  mode: 'create' | 'edit';
  task?: Task;
};

export const SEED_TASKS: Task[] = [
  {
    id:  Math.random().toString(36).slice(2),
    title: 'Task 1',
    description: 'Initialize Task 1',
    assignedTo: 'Mohand',
    dueDate: new Date().toISOString(),
    estimatedHours: 8,
    category: TaskCategory.Dev,
    status: TaskStatus.Active
  },
  {
    id: Math.random().toString(36).slice(2),
    title: 'Task 2',
    description: 'Create Task 2',
    assignedTo: 'Mohamed',
    dueDate: new Date().toISOString(),
    estimatedHours: 4,
    category: TaskCategory.UI,
    status: TaskStatus.New
  },
  {
    id:  Math.random().toString(36).slice(2),
    title: 'Task 3',
    description: 'Cover Task 3',
    assignedTo: 'Ali',
    dueDate: new Date().toISOString(),
    estimatedHours: 5,
    category: TaskCategory.Test,
    status: TaskStatus.New
  }
];
