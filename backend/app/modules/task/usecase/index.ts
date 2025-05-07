import { GeneralError } from '../../../error';
import { toProjectDomain } from '../../project/dto';
import ProjectRepository from '../../project/repository';
import { Task, TaskPriority } from '../domain';
import { fromTaskDomain, TaskDTO, toTaskDomain } from '../dto';
import TaskRepository from '../repository';

export default class TaskUseCase {
  private repository: TaskRepository;
  private projectRepository: ProjectRepository;
  constructor(
    repository: TaskRepository,
    projectRepository: ProjectRepository,
  ) {
    this.repository = repository;
    this.projectRepository = projectRepository;
  }

  async assignTaskToProject(
    taskID: string,
    ownerID: number,
    projectID: string,
  ): Promise<boolean> {
    try {
      const taskDto = await this.repository.findTaskByTaskID(taskID, ownerID);
      const taskDomain = toTaskDomain(taskDto);

      const project = await this.projectRepository.findProjectByProjectID(
        projectID,
        ownerID,
      );

      taskDomain.assignToProject(toProjectDomain(project));

      await this.repository.updateTaskByTaskID(
        taskID,
        ownerID,
        fromTaskDomain(taskDomain),
      );

      return true;
    } catch (err) {
      throw {
        errorType: (err as GeneralError).errorType,
        details: (err as GeneralError).details,
        message: (err as Error).message,
        name: 'task use case error',
        payload: {
          task_id: taskID,
          project_id: projectID,
        },
      } as GeneralError;
    }
  }

  async changeTaskCompletionStatus(
    taskID: string,
    ownerID: number,
    isCompleted: boolean,
  ): Promise<boolean> {
    try {
      const taskDto = await this.repository.findTaskByTaskID(taskID, ownerID);
      const taskDomain = toTaskDomain(taskDto);

      if (isCompleted) {
        taskDomain.markAsCompleted();
      } else {
        taskDomain.markAsIncomplete();
      }

      await this.repository.updateTaskByTaskID(
        taskID,
        ownerID,
        fromTaskDomain(taskDomain),
      );

      return true;
    } catch (err) {
      throw {
        errorType: (err as GeneralError).errorType,
        details: (err as GeneralError).details,
        message: (err as Error).message,
        name: 'task use case error',
        payload: {
          task_id: taskID,
          is_completed: isCompleted,
        },
      } as GeneralError;
    }
  }

  async editTask(
    taskID: string,
    ownerID: number,
    arg: {
      title: string;
      description: string;
      priority: TaskPriority;
      due_date: string;
    },
  ): Promise<TaskDTO> {
    try {
      const taskDto = await this.repository.findTaskByTaskID(taskID, ownerID);
      const taskDomain = toTaskDomain(taskDto);

      taskDomain.editTask({ ...arg });

      return await this.repository.updateTaskByTaskID(
        taskID,
        ownerID,
        fromTaskDomain(taskDomain),
      );
    } catch (err) {
      throw {
        errorType: (err as GeneralError).errorType,
        details: (err as GeneralError).details,
        message: (err as Error).message,
        name: 'task use case error',
        payload: {
          task_id: taskID,
          arg: arg,
        },
      } as GeneralError;
    }
  }

  async createTask(arg: {
    title: string;
    description: string;
    priority: TaskPriority;
    due_date: string;
    owner_id: number;
  }): Promise<string> {
    try {
      const task = Task.createTask({ ...arg });
      const id = await this.repository.createTask(fromTaskDomain(task));

      return id;
    } catch (err) {
      throw {
        errorType: (err as GeneralError).errorType,
        details: (err as GeneralError).details,
        message: (err as Error).message,
        name: 'task use case error',
        payload: {
          arg: arg,
        },
      } as GeneralError;
    }
  }

  async getTasks(
    ownerID: number,
    page: number,
    pageSize: number,
    sortBy: 'DUE_DATE' | 'PRIORITY' | '',
    sortType: 'ASC' | 'DESC' | '',
    statusFilter: 'COMPLETED' | 'INCOMPLETE' | '',
  ): Promise<{
    data: TaskDTO[];
    paging: {
      page: number;
      page_size: number;
      total_records: number;
      total_page: number;
    };
  }> {
    try {
      const [tasks, totalRecords] = await this.repository.findAllTasks(
        ownerID,
        pageSize,
        (page - 1) * pageSize,
      );

      let filteredTasks = tasks;

      if (statusFilter === 'COMPLETED') {
        filteredTasks = tasks.filter((task) => task.is_completed);
      } else if (statusFilter === 'INCOMPLETE') {
        filteredTasks = tasks.filter((task) => !task.is_completed);
      }

      if (sortBy && sortType) {
        filteredTasks.sort((a, b) => {
          if (sortBy === 'DUE_DATE') {
            // Handle cases where due_date might be undefined
            if (!a.due_date && !b.due_date) return 0;
            if (!a.due_date) return sortType === 'ASC' ? 1 : -1;
            if (!b.due_date) return sortType === 'ASC' ? -1 : 1;

            return sortType === 'ASC'
              ? new Date(a.due_date).getTime() - new Date(b.due_date).getTime()
              : new Date(b.due_date).getTime() - new Date(a.due_date).getTime();
          }
          if (sortBy === 'PRIORITY') {
            return sortType === 'ASC'
              ? a.priority - b.priority
              : b.priority - a.priority;
          }
          return 0;
        });
      }

      return {
        data: filteredTasks,
        paging: {
          page: page,
          page_size: pageSize,
          total_records: totalRecords as number,
          total_page: Math.ceil(totalRecords / pageSize),
        },
      };
    } catch (err) {
      throw {
        errorType: (err as GeneralError).errorType,
        details: (err as GeneralError).details,
        message: (err as Error).message,
        name: 'task use case error',
        payload: {
          page,
          page_size: pageSize,
        },
      } as GeneralError;
    }
  }

  async deleteTask(taskID: string, ownerID: number): Promise<boolean> {
    try {
      return await this.repository.deleteTaskByTaskID(taskID, ownerID);
    } catch (err) {
      throw {
        errorType: (err as GeneralError).errorType,
        details: (err as GeneralError).details,
        message: (err as Error).message,
        name: 'task use case error',
        payload: {
          task_id: taskID,
        },
      } as GeneralError;
    }
  }
}
