import { ProjectDTO } from '../dto';

export default interface ProjectRepository {
  findProjectByProjectID(projectID: string): Promise<ProjectDTO>;
  findProjectByID(id: number): Promise<ProjectDTO>;
  findAllProjects(
    limit: number,
    offset: number,
  ): Promise<[ProjectDTO[], number]>;
  updateProjectByProjectID(
    projectID: string,
    arg: ProjectDTO,
  ): Promise<ProjectDTO>;
  deleteProjectByProjectID(projectID: string): Promise<boolean>;
  createProject(arg: ProjectDTO): Promise<string>;
}
