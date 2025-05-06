enum TaskPriority {
  LOW = 1,
  MEDIUM,
  HIGH,
  CRITICAL,
}

class Task {
  primaryKey: number;
  taskID: string;
  title: string;
  description: string;
  priority: TaskPriority;
  isCompleted: boolean;
  dueDate?: Date;
  createdAt: Date;
  updatedAt?: Date;
  deletedAt?: Date;
  projectID?: number;

  constructor(
    primaryKey: number,
    taskID: string,
    title: string,
    description: string,
    priority: TaskPriority,
    projectID: number,
    isCompleted: boolean = false,
    dueDate: Date = new Date(),
  ) {
    this.primaryKey = primaryKey;
    this.taskID = taskID;
    this.title = title;
    this.description = description;
    this.priority = priority;
    this.isCompleted = isCompleted;
    this.dueDate = dueDate;
    this.createdAt = new Date();
    this.projectID = projectID;
  }

  markAsCompleted() {
    this.isCompleted = true;
    this.updatedAt = new Date();
  }

  markAsIncomplete() {
    this.isCompleted = false;
    this.updatedAt = new Date();
  }

  editTask(params: {
    title: string;
    description: string;
    priority: TaskPriority;
    dueDate: Date;
  }) {
    if (Object.keys(params).length === 0) {
      return;
    }

    if (params.title) {
      this.title = params.title;
    }

    if (params.description) {
      this.description = params.description;
    }

    if (params.priority) {
      this.priority = params.priority;
    }

    if (params.dueDate) {
      this.dueDate = params.dueDate;
    }

    this.updatedAt = new Date();
  }
}

export { TaskPriority, Task };
