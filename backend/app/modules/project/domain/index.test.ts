import Project from '.';
import { Task, TaskPriority } from '../../task/domain';
import { expect, it, describe, beforeEach } from 'vitest';

describe('Project', () => {
  let project: Project;
  let task1: Task;
  let task2: Task;

  beforeEach(() => {
    project = new Project(
      1,
      'proj1',
      'Test Project',
      'A test project',
      new Date(),
      undefined,
      undefined,
      1,
    );
  });

  it('should initialize with correct properties', () => {
    expect(project.id).toBe(1);
    expect(project.projectID).toBe('proj1');
    expect(project.title).toBe('Test Project');
    expect(project.description).toBe('A test project');
    expect(project.createdAt).toBeInstanceOf(Date);
  });

  it('should edit project details', () => {
    project.editProject({
      title: 'Updated Title',
      description: 'Updated Description',
    });
    expect(project.title).toBe('Updated Title');
    expect(project.description).toBe('Updated Description');
    expect(project.updatedAt).toBeInstanceOf(Date);
  });

  it('should not update updatedAt if no changes are made', () => {
    const initialUpdatedAt = project.updatedAt;
    project.editProject({} as { title: string; description: string });
    expect(project.updatedAt).toBe(initialUpdatedAt);
  });
});
