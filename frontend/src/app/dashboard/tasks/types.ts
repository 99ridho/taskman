export interface PaginationInfo {
  page: number;
  page_size: number;
  total_records: number;
  total_page: number;
}

export interface Task {
  id: string;
  task_id: string;
  title: string;
  description: string;
  is_completed: boolean;
  priority: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  due_date: string;
  owner_id: string;
  project_id: string;
}

export interface TaskSummary {
  total_tasks: number;
  completed_tasks: number;
  incomplete_tasks: number;
  overdue_tasks: number;
  due_today_tasks: number;
}
