import { GeneralError } from '../../../error';
import { TaskDTO } from '../../task/dto';
import Project from '../domain';
import { fromProjectDomain, ProjectDTO, toProjectDomain } from '../dto';
import ProjectRepository from '../repository';

export default class ProjectUseCase {
  private repository: ProjectRepository;
  constructor(repository: ProjectRepository) {
    this.repository = repository;
  }

  async createProject(params: {
    title: string;
    description: string;
    owner_id: number;
  }): Promise<string> {
    try {
      const newProject = Project.createProject({ ...params });
      const id = await this.repository.createProject(
        fromProjectDomain(newProject),
      );

      return id;
    } catch (err) {
      throw {
        errorType: (err as GeneralError).errorType,
        details: (err as GeneralError).details,
        message: (err as Error).message,
        name: 'project use case error',
        payload: params,
      } as GeneralError;
    }
  }

  async editProject(
    projectID: string,
    ownerID: number,
    params: { title: string; description: string },
  ): Promise<ProjectDTO> {
    try {
      const projectDto = await this.repository.findProjectByProjectID(
        projectID,
        ownerID,
      );
      const project = toProjectDomain(projectDto);

      project.editProject({ ...params });

      const updatedProject = await this.repository.updateProjectByProjectID(
        projectID,
        ownerID,
        fromProjectDomain(project),
      );

      return updatedProject;
    } catch (err) {
      throw {
        errorType: (err as GeneralError).errorType,
        details: (err as GeneralError).details,
        message: (err as Error).message,
        name: 'project use case error',
        payload: {
          project_id: projectID,
          params: params,
        },
      } as GeneralError;
    }
  }

  async deleteProject(projectID: string, ownerID: number): Promise<boolean> {
    try {
      return await this.repository.deleteProjectByProjectID(projectID, ownerID);
    } catch (err) {
      throw {
        errorType: (err as GeneralError).errorType,
        details: (err as GeneralError).details,
        message: (err as Error).message,
        name: 'project use case error',
        payload: {
          project_id: projectID,
        },
      } as GeneralError;
    }
  }

  async getProjects(
    ownerID: number,
    page: number,
    pageSize: number,
  ): Promise<{
    data: ProjectDTO[];
    paging: {
      page: number;
      page_size: number;
      total_records: number;
      total_page: number;
    };
  }> {
    try {
      const [tasks, totalRecords] = await this.repository.findAllProjects(
        ownerID,
        pageSize,
        (page - 1) * pageSize,
      );

      return {
        data: tasks,
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
        name: 'project use case error',
        payload: {
          page: page,
          page_size: pageSize,
        },
      } as GeneralError;
    }
  }

  async getTasks(
    projectID: string,
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
      const project = await this.repository.findProjectByProjectID(
        projectID,
        ownerID,
      );

      const [tasks, totalRecords] =
        await this.repository.findAllTasksForProjectID(
          project.id,
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
}
