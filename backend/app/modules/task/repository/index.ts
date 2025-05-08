import { TaskDTO, TaskSummary } from '../dto';

export default interface TaskRepository {
  findTaskByTaskID(taskID: string, ownerID: number): Promise<TaskDTO>;
  findAllTasks(
    ownerID: number,
    limit: number,
    offset: number,
  ): Promise<[TaskDTO[], number]>;
  updateTaskByTaskID(
    taskID: string,
    ownerID: number,
    arg: TaskDTO,
  ): Promise<TaskDTO>;
  deleteTaskByTaskID(taskID: string, ownerID: number): Promise<boolean>;
  createTask(arg: TaskDTO): Promise<string>;
  findTaskSummary(ownerID: number): Promise<TaskSummary>;
}
