import { Task } from './task';

class Project {
  primaryKey: number;
  projectID: string;
  title: string;
  description: string;
  tasks: Map<string, Task>;
  createdAt: Date;
  updatedAt?: Date;
  deletedAt?: Date;

  constructor(
    primaryKey: number,
    projectID: string,
    title: string,
    description: string,
    tasks: Task[] = [],
  ) {
    this.primaryKey = primaryKey;
    this.projectID = projectID;
    this.title = title;
    this.description = description;

    this.tasks = new Map();
    for (const task of tasks) {
      this.tasks.set(task.taskID, task);
    }

    this.createdAt = new Date();
  }

  assignTask(task: Task) {
    if (this.tasks.has(task.taskID)) {
      throw new Error(`cannot assign task ${task.taskID}, already exists`);
    }

    task.projectID = this.primaryKey;
    this.tasks.set(task.taskID, task);
  }

  unassignTask(task: Task) {
    this.tasks.delete(task.taskID);
  }

  getAllTasks(): Task[] {
    return Array.from(this.tasks.values());
  }

  editProject(params: { title: string; description: string }) {
    if (Object.keys(params).length === 0) {
      return;
    }

    if (params.title) {
      this.title = params.title;
    }

    if (params.description) {
      this.description = params.description;
    }

    this.updatedAt = new Date();
  }
}

export default Project;
