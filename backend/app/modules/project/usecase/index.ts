import { GeneralError } from '../../../error';
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
      throw err;
    }
  }

  async editProject(
    projectID: string,
    params: { title: string; description: string },
  ): Promise<ProjectDTO> {
    try {
      const projectDto =
        await this.repository.findProjectByProjectID(projectID);
      const project = toProjectDomain(projectDto);

      project.editProject({ ...params });

      const updatedProject = await this.repository.updateProjectByProjectID(
        projectID,
        fromProjectDomain(project),
      );

      return updatedProject;
    } catch (err) {
      throw err;
    }
  }

  async deleteProject(projectID: string): Promise<boolean> {
    try {
      return await this.repository.deleteProjectByProjectID(projectID);
    } catch (err) {
      throw err;
    }
  }

  async getProjects(
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
      throw err;
    }
  }
}
