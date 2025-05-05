import Project from './project';
import { Task, TaskPriority } from './task';
import { expect, it, describe, beforeEach } from 'vitest';

describe('Project', () => {
  let project: Project;
  let task1: Task;
  let task2: Task;

  beforeEach(() => {
    task1 = new Task(
      1,
      'task1',
      'Task 1',
      'First Task',
      TaskPriority.MEDIUM,
      0,
    );
    task2 = new Task(
      2,
      'task2',
      'Task 2',
      'Second Task',
      TaskPriority.MEDIUM,
      0,
    );

    project = new Project(1, 'proj1', 'Test Project', 'A test project', [
      task1,
    ]);
  });

  it('should initialize with correct properties', () => {
    expect(project.primaryKey).toBe(1);
    expect(project.projectID).toBe('proj1');
    expect(project.title).toBe('Test Project');
    expect(project.description).toBe('A test project');
    expect(project.tasks.size).toBe(1);
    expect(project.tasks.get('task1')).toEqual(task1);
    expect(project.createdAt).toBeInstanceOf(Date);
  });

  it('should assign a new task', () => {
    project.assignTask(task2);
    expect(project.tasks.size).toBe(2);
    expect(project.tasks.get('task2')).toEqual(task2);
    expect(task2.projectID).toBe(1);
  });

  it('should throw an error when assigning a duplicate task', () => {
    expect(() => project.assignTask(task1)).toThrow(
      'cannot assign task task1, already exists',
    );
  });

  it('should unassign a task', () => {
    project.unassignTask(task1);
    expect(project.tasks.size).toBe(0);
    expect(project.tasks.has('task1')).toBe(false);
  });

  it('should return all tasks', () => {
    const tasks = project.getAllTasks();
    expect(tasks).toEqual([task1]);
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
