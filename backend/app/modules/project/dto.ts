import Project from './domain';

export type ProjectDTO = {
  id: number;
  project_id: string;
  title: string;
  description: string;
  owner_id?: number;
  created_at?: Date;
  updated_at?: Date;
  deleted_at?: Date;
};

export function fromProjectDomain(project: Project): ProjectDTO {
  return {
    id: project.id,
    project_id: project.projectID,
    title: project.title,
    description: project.description,
    owner_id: project.ownerID,
    created_at: project.createdAt,
    updated_at: project.updatedAt,
    deleted_at: project.deletedAt,
  };
}

export function toProjectDomain(dto: ProjectDTO): Project {
  return new Project(
    dto.id,
    dto.project_id,
    dto.title,
    dto.description,
    dto.created_at ?? new Date(),
    dto.updated_at,
    dto.deleted_at,
    dto.owner_id,
  );
}
