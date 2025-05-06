import { Task, TaskPriority } from '.';
import { expect, it, describe, beforeEach } from 'vitest';
import Project from '../../project/domain';

describe('Task Class', () => {
  let task: Task;
  let project: Project;

  beforeEach(() => {
    project = new Project(
      1,
      'proj-1',
      'First Project',
      'This is first project',
      1,
    );
    task = new Task(
      1,
      'task-001',
      'Test Task',
      'This is a test task',
      TaskPriority.MEDIUM,
      false,
      new Date('2023-12-31'),
    );
  });

  it('should create a task with the correct properties', () => {
    expect(task.id).toBe(1);
    expect(task.taskID).toBe('task-001');
    expect(task.title).toBe('Test Task');
    expect(task.description).toBe('This is a test task');
    expect(task.priority).toBe(TaskPriority.MEDIUM);
    expect(task.isCompleted).toBe(false);
    expect(task.dueDate).toEqual(new Date('2023-12-31'));
    expect(task.createdAt).toBeInstanceOf(Date);
  });

  it('should mark a task as completed', () => {
    task.markAsCompleted();
    expect(task.isCompleted).toBe(true);
    expect(task.updatedAt).toBeInstanceOf(Date);
  });

  it('should mark a task as incomplete', () => {
    task.markAsCompleted();
    task.markAsIncomplete();
    expect(task.isCompleted).toBe(false);
    expect(task.updatedAt).toBeInstanceOf(Date);
  });

  it('should have an assigned project', () => {
    task.assignToProject(project);
    expect(task.assignedProject).toBe(project);
    expect(task.updatedAt).toBeInstanceOf(Date);
  });

  it('should edit task properties correctly', () => {
    const newParams = {
      title: 'Updated Task',
      description: 'Updated description',
      priority: TaskPriority.HIGH,
      due_date: new Date('2024-01-15'),
    };

    task.editTask(newParams);

    expect(task.title).toBe('Updated Task');
    expect(task.description).toBe('Updated description');
    expect(task.priority).toBe(TaskPriority.HIGH);
    expect(task.dueDate).toEqual(new Date('2024-01-15'));
    expect(task.updatedAt).toBeInstanceOf(Date);
  });

  it('should not update properties if params are empty', () => {
    const initialUpdatedAt = task.updatedAt;

    task.editTask(
      {} as {
        title: string;
        description: string;
        priority: TaskPriority;
        due_date: Date;
      },
    );

    expect(task.title).toBe('Test Task');
    expect(task.description).toBe('This is a test task');
    expect(task.priority).toBe(TaskPriority.MEDIUM);
    expect(task.dueDate).toEqual(new Date('2023-12-31'));
    expect(task.updatedAt).toBe(initialUpdatedAt);
  });
});
