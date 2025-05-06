import { TaskDTO } from '../dto';

export default interface TaskRepository {
  findTaskByTaskID(taskID: string): Promise<TaskDTO>;
  findAllTasks(limit: number, offset: number): Promise<[TaskDTO[], number]>;
  updateTaskByTaskID(taskID: string, arg: TaskDTO): Promise<TaskDTO>;
  deleteTaskByTaskID(taskID: string): Promise<boolean>;
  createTask(arg: TaskDTO): Promise<string>;
}
