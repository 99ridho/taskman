import Project from '../project/domain';
import { Task } from './domain';

export type TaskDTO = {
  id: number;
  task_id: string;
  title: string;
  description: string;
  priority: number;
  is_completed: boolean;
  project_id?: number;
  due_date?: Date;
  owner_id?: number;
  created_at?: Date;
  updated_at?: Date;
  deleted_at?: Date;
};

export type TaskSummary = {
  total_tasks: number;
  completed_tasks: number;
  incomplete_tasks: number;
  overdue_tasks: number;
  due_today_tasks: number;
};

export const fromTaskDomain = (task: Task): TaskDTO => ({
  id: task.id,
  task_id: task.taskID,
  title: task.title,
  description: task.description,
  priority: task.priority,
  is_completed: task.isCompleted,
  project_id: task.assignedProject?.id || task.projectID,
  due_date: task.dueDate,
  owner_id: task.ownerID,
  created_at: task.createdAt,
  updated_at: task.updatedAt,
  deleted_at: task.deletedAt,
});

export const toTaskDomain = (dto: TaskDTO): Task => {
  return new Task(
    dto.id,
    dto.task_id,
    dto.title,
    dto.description,
    dto.priority,
    dto.is_completed,
    dto.due_date,
    dto.owner_id,
    dto.project_id,
  );
};
