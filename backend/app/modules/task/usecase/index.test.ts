import { describe, it, expect, vi, beforeEach } from 'vitest';
import TaskUseCase from './index';
import { TaskDTO } from '../dto';
import { ProjectDTO } from '../../project/dto';
import { TaskPriority } from '../domain';
import TaskRepository from '../repository';
import ProjectRepository from '../../project/repository';

describe('TaskUseCase', () => {
  let taskUseCase: TaskUseCase;
  let mockTaskRepository: TaskRepository;
  let mockProjectRepository: ProjectRepository;

  beforeEach(() => {
    mockTaskRepository = {
      findTaskByTaskID: vi.fn(),
      updateTaskByTaskID: vi.fn(),
      createTask: vi.fn(),
      deleteTaskByTaskID: vi.fn(),
      findAllTasks: vi.fn(),
    };

    mockProjectRepository = {
      findProjectByProjectID: vi.fn(),
      findAllProjects: vi.fn(),
      findProjectByID: vi.fn(),
      createProject: vi.fn(),
      deleteProjectByProjectID: vi.fn(),
      updateProjectByProjectID: vi.fn(),
    };

    taskUseCase = new TaskUseCase(mockTaskRepository, mockProjectRepository);
  });

  describe('assignTaskToProject', () => {
    it('should successfully assign task to project', async () => {
      const taskID = 'task-123';
      const projectID = 'project-123';
      const mockTaskDto: TaskDTO = {
        id: 1,
        task_id: taskID,
        title: 'Test Task',
        description: '',
        priority: TaskPriority.MEDIUM,
        is_completed: false,
      };
      const mockProjectDto: ProjectDTO = {
        id: 1,
        project_id: projectID,
        title: 'Test Project',
        description: '',
      };

      vi.spyOn(mockTaskRepository, 'findTaskByTaskID').mockResolvedValue(
        mockTaskDto,
      );

      vi.spyOn(
        mockProjectRepository,
        'findProjectByProjectID',
      ).mockResolvedValue(mockProjectDto);

      vi.spyOn(mockTaskRepository, 'updateTaskByTaskID').mockResolvedValue({
        ...mockTaskDto,
        project_id: 1,
      });

      const result = await taskUseCase.assignTaskToProject(
        taskID,
        1,
        projectID,
      );

      expect(result).toBe(true);
      expect(mockTaskRepository.findTaskByTaskID).toHaveBeenCalledWith(
        taskID,
        1,
      );
      expect(mockProjectRepository.findProjectByProjectID).toHaveBeenCalledWith(
        projectID,
        1,
      );
      expect(mockTaskRepository.updateTaskByTaskID).toHaveBeenCalled();
    });

    it('should throw error when task is not found', async () => {
      const taskID = 'task-123';
      const projectID = 'project-123';
      const error = new Error('Task not found');

      vi.spyOn(mockTaskRepository, 'findTaskByTaskID').mockRejectedValue(error);

      await expect(
        taskUseCase.assignTaskToProject(taskID, 1, projectID),
      ).rejects.toMatchObject({
        name: 'task use case error',
        message: 'Task not found',
        payload: {
          task_id: taskID,
          project_id: projectID,
        },
      });
    });

    it('should throw error when project is not found', async () => {
      const taskID = 'task-123';
      const projectID = 'project-123';
      const mockTaskDto: TaskDTO = {
        id: 1,
        task_id: taskID,
        title: 'Test Task',
        description: '',
        priority: TaskPriority.MEDIUM,
        is_completed: false,
      };
      const error = new Error('Project not found');

      vi.spyOn(mockTaskRepository, 'findTaskByTaskID').mockResolvedValue(
        mockTaskDto,
      );

      vi.spyOn(
        mockProjectRepository,
        'findProjectByProjectID',
      ).mockRejectedValue(error);

      await expect(
        taskUseCase.assignTaskToProject(taskID, 1, projectID),
      ).rejects.toMatchObject({
        name: 'task use case error',
        message: 'Project not found',
        payload: {
          task_id: taskID,
          project_id: projectID,
        },
      });
    });
  });

  describe('changeTaskCompletionStatus', () => {
    it('should successfully mark task as completed', async () => {
      const taskID = 'task-123';
      const mockTaskDto: TaskDTO = {
        id: 1,
        task_id: taskID,
        title: 'Test Task',
        description: '',
        priority: TaskPriority.MEDIUM,
        is_completed: false,
      };

      vi.spyOn(mockTaskRepository, 'findTaskByTaskID').mockResolvedValue(
        mockTaskDto,
      );
      vi.spyOn(mockTaskRepository, 'updateTaskByTaskID').mockResolvedValue({
        ...mockTaskDto,
        is_completed: true,
      });

      const result = await taskUseCase.changeTaskCompletionStatus(
        taskID,
        1,
        true,
      );

      expect(result).toBe(true);
      expect(mockTaskRepository.findTaskByTaskID).toHaveBeenCalledWith(
        taskID,
        1,
      );
      expect(mockTaskRepository.updateTaskByTaskID).toHaveBeenCalled();
    });

    it('should successfully mark task as incomplete', async () => {
      const taskID = 'task-123';
      const mockTaskDto: TaskDTO = {
        id: 1,
        task_id: taskID,
        title: 'Test Task',
        description: '',
        priority: TaskPriority.MEDIUM,
        is_completed: true,
      };

      vi.spyOn(mockTaskRepository, 'findTaskByTaskID').mockResolvedValue(
        mockTaskDto,
      );
      vi.spyOn(mockTaskRepository, 'updateTaskByTaskID').mockResolvedValue({
        ...mockTaskDto,
        is_completed: false,
      });

      const result = await taskUseCase.changeTaskCompletionStatus(
        taskID,
        1,
        false,
      );

      expect(result).toBe(true);
      expect(mockTaskRepository.findTaskByTaskID).toHaveBeenCalledWith(
        taskID,
        1,
      );
      expect(mockTaskRepository.updateTaskByTaskID).toHaveBeenCalled();
    });

    it('should throw error when task is not found', async () => {
      const taskID = 'task-123';
      const error = new Error('Task not found');

      vi.spyOn(mockTaskRepository, 'findTaskByTaskID').mockRejectedValue(error);

      await expect(
        taskUseCase.changeTaskCompletionStatus(taskID, 1, true),
      ).rejects.toMatchObject({
        name: 'task use case error',
        message: 'Task not found',
        payload: {
          task_id: taskID,
          is_completed: true,
        },
      });
    });
  });

  describe('editTask', () => {
    it('should successfully edit task', async () => {
      const taskID = 'task-123';
      const mockTaskDto: TaskDTO = {
        id: 1,
        task_id: taskID,
        title: 'Test Task',
        description: 'Old description',
        priority: TaskPriority.MEDIUM,
        is_completed: false,
        due_date: new Date(),
      };

      const updateData = {
        title: 'Updated Task',
        description: 'New description',
        priority: TaskPriority.HIGH,
        due_date: new Date().toISOString(),
      };

      vi.spyOn(mockTaskRepository, 'findTaskByTaskID').mockResolvedValue(
        mockTaskDto,
      );

      vi.spyOn(mockTaskRepository, 'updateTaskByTaskID').mockResolvedValue({
        ...mockTaskDto,
        title: updateData.title,
        description: updateData.description,
        priority: updateData.priority,
        due_date: new Date(updateData.due_date),
      });

      const result = await taskUseCase.editTask(taskID, 1, updateData);

      expect(result).toMatchObject({
        task_id: taskID,
        title: updateData.title,
        description: updateData.description,
        priority: updateData.priority,
      });
      expect(mockTaskRepository.findTaskByTaskID).toHaveBeenCalledWith(
        taskID,
        1,
      );
      expect(mockTaskRepository.updateTaskByTaskID).toHaveBeenCalled();
    });

    it('should throw error when task is not found', async () => {
      const taskID = 'task-123';
      const error = new Error('Task not found');
      const updateData = {
        title: 'Updated Task',
        description: 'New description',
        priority: TaskPriority.HIGH,
        due_date: new Date().toISOString(),
      };

      vi.spyOn(mockTaskRepository, 'findTaskByTaskID').mockRejectedValue(error);

      await expect(
        taskUseCase.editTask(taskID, 1, updateData),
      ).rejects.toMatchObject({
        name: 'task use case error',
        message: 'Task not found',
        payload: {
          task_id: taskID,
          arg: updateData,
        },
      });
    });
  });

  describe('createTask', () => {
    it('should successfully create a task', async () => {
      const taskData = {
        title: 'New Task',
        description: 'Task description',
        priority: TaskPriority.HIGH,
        due_date: new Date('2024-01-01').toISOString(),
        owner_id: 1,
      };

      const expectedTaskID = 'task-123';

      vi.spyOn(mockTaskRepository, 'createTask').mockResolvedValue(
        expectedTaskID,
      );

      const result = await taskUseCase.createTask(taskData);

      expect(result).toBe(expectedTaskID);
      expect(mockTaskRepository.createTask).toHaveBeenCalled();
    });

    it('should throw error when task creation fails', async () => {
      const taskData = {
        title: 'New Task',
        description: 'Task description',
        priority: TaskPriority.HIGH,
        due_date: new Date('2024-01-01').toISOString(),
        owner_id: 1,
      };

      const error = new Error('Failed to create task');

      vi.spyOn(mockTaskRepository, 'createTask').mockRejectedValue(error);

      await expect(taskUseCase.createTask(taskData)).rejects.toMatchObject({
        name: 'task use case error',
        message: 'Failed to create task',
        payload: {
          arg: taskData,
        },
      });
    });
  });
});
