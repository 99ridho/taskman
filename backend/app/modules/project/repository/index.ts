import { ProjectDTO } from '../dto';

export default interface ProjectRepository {
  findProjectByProjectID(
    projectID: string,
    ownerID: number,
  ): Promise<ProjectDTO>;
  findProjectByID(id: number, ownerID: number): Promise<ProjectDTO>;
  findAllProjects(
    ownerID: number,
    limit: number,
    offset: number,
  ): Promise<[ProjectDTO[], number]>;
  updateProjectByProjectID(
    projectID: string,
    ownerID: number,
    arg: ProjectDTO,
  ): Promise<ProjectDTO>;
  deleteProjectByProjectID(
    projectID: string,
    ownerID: number,
  ): Promise<boolean>;
  createProject(arg: ProjectDTO): Promise<string>;
}
