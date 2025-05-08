import { beforeEach, describe, expect, it, vi } from 'vitest';
import ProjectUseCase from '.';
import ProjectRepository from '../repository';
import { ProjectDTO } from '../dto';

describe('ProjectUseCase', () => {
  let useCase: ProjectUseCase;
  let mockProjectRepository: ProjectRepository;

  beforeEach(() => {
    mockProjectRepository = {
      findProjectByProjectID: vi.fn(),
      findAllProjects: vi.fn(),
      findProjectByID: vi.fn(),
      createProject: vi.fn(),
      deleteProjectByProjectID: vi.fn(),
      updateProjectByProjectID: vi.fn(),
      findAllTasksForProjectID: vi.fn(),
    };

    useCase = new ProjectUseCase(mockProjectRepository);
  });

  describe('createProject', () => {
    it('should create a new project successfully', async () => {
      const projectData = {
        title: 'Test Project',
        description: 'Test Description',
        owner_id: 1,
        project_id: 'proj-1',
      };

      const expectedProject: ProjectDTO = {
        id: 0,
        project_id: projectData.project_id,
        title: projectData.title,
        description: projectData.description,
        created_at: expect.any(Date),
        owner_id: projectData.owner_id,
      };

      vi.spyOn(mockProjectRepository, 'createProject').mockResolvedValue(
        projectData.project_id,
      );

      const result = await useCase.createProject(projectData);

      expect(mockProjectRepository.createProject).toHaveBeenCalledWith(
        expect.objectContaining({
          title: projectData.title,
          description: projectData.description,
        }),
      );
      expect(result).toEqual('proj-1');
    });

    it('should throw error when creating project with empty title', async () => {
      const projectData = {
        title: '',
        description: 'Test Description',
        owner_id: 1,
      };

      await expect(useCase.createProject(projectData)).rejects.toThrowError(
        'cannot create new task due to validation error',
      );
    });
  });

  describe('editProject', () => {
    it('should edit project successfully', async () => {
      const projectId = 'proj-1';
      const updates = {
        title: 'Updated Title',
        description: 'Updated Description',
      };

      vi.spyOn(
        mockProjectRepository,
        'findProjectByProjectID',
      ).mockResolvedValue({
        id: 1,
        project_id: projectId,
        title: 'Old Title',
        description: 'Old Description',
        created_at: new Date(),
        owner_id: 1,
      });

      vi.spyOn(
        mockProjectRepository,
        'updateProjectByProjectID',
      ).mockResolvedValue({
        id: 1,
        project_id: projectId,
        title: updates.title,
        description: updates.description,
        created_at: new Date(),
        owner_id: 1,
      });

      await useCase.editProject(projectId, 1, updates);

      expect(
        mockProjectRepository.updateProjectByProjectID,
      ).toHaveBeenCalledWith(
        projectId,
        1,
        expect.objectContaining({
          title: updates.title,
          description: updates.description,
        }),
      );
    });

    it('should throw error when project not found', async () => {
      vi.spyOn(
        mockProjectRepository,
        'findProjectByProjectID',
      ).mockRejectedValue(new Error('not found'));

      await expect(
        useCase.editProject('invalid-id', 1, {
          title: 'New Title',
          description: 'New Description',
        }),
      ).rejects.toThrowError('not found');
    });
  });

  describe('deleteProject', () => {
    it('should delete project successfully', async () => {
      const projectId = 'proj-1';

      vi.spyOn(
        mockProjectRepository,
        'findProjectByProjectID',
      ).mockResolvedValue({
        id: 1,
        project_id: projectId,
        title: 'Test Project',
        description: 'Test Description',
        created_at: new Date(),
        owner_id: 1,
      });

      vi.spyOn(
        mockProjectRepository,
        'deleteProjectByProjectID',
      ).mockResolvedValue(true);

      await useCase.deleteProject(projectId, 1);

      expect(
        mockProjectRepository.deleteProjectByProjectID,
      ).toHaveBeenCalledWith(projectId, 1);
    });

    it('should throw error when trying to delete non-existent project', async () => {
      vi.spyOn(
        mockProjectRepository,
        'deleteProjectByProjectID',
      ).mockRejectedValue(new Error('not found'));

      await expect(useCase.deleteProject('invalid-id', 1)).rejects.toThrowError(
        'not found',
      );
    });
  });
});
