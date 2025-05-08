create table users (
	id bigserial not null,
	user_id varchar(255) not null,
	username varchar(255) not null,
	password varchar(255) not null,
	created_at timestamptz not null default now(),
	updated_at timestamptz null,
	deleted_at timestamptz null,
	
	constraint users_pkey primary key (id)
);

create table projects (
	id bigserial not null,
	project_id varchar(255) not null,
	title varchar(255) not null,
	description varchar(255) null,
	belongs_to int8 null,
	created_at timestamptz not null default now(),
	updated_at timestamptz null,
	deleted_at timestamptz null,
	
	constraint projects_pkey primary key (id),
	constraint projects_users_id_fk foreign key(belongs_to) references users(id) on delete set null
);

create table tasks (
	id bigserial not null,
	task_id varchar(255) not null,
	title varchar(255) not null,
	description varchar(255) null,
	priority numeric(2) not null,
	is_completed boolean not null default false,
	project_id int8 null,
	due_date timestamptz null,
	belongs_to int8 null,
	created_at timestamptz not null default now(),
	updated_at timestamptz null,
	deleted_at timestamptz null,
	
	constraint tasks_pkey primary key (id),
	constraint tasks_projects_id_fk foreign key(project_id) references projects(id) on delete set null,
	constraint tasks_users_id_fk foreign key(belongs_to) references users(id) on delete set null
);

create index project_id_idx on projects(project_id);
create index task_id_idx on tasks(task_id);
create index users_id_idx on users(user_id);
create index users_username_idx on users(username);

create or replace view user_task_summary as
with user_tasks as (
  select *
  from tasks
  where deleted_at is null
),
task_summary as (
  select
    belongs_to,
    count(*) as total_tasks,
    count(*) filter (where is_completed = true) as completed_tasks,
    count(*) filter (where is_completed = false) as incomplete_tasks,
    count(*) filter (
      where is_completed = false
        and due_date is not null
        and due_date < now()
    ) as overdue_tasks,
    count(*) filter (
      where due_date is not null
        and date_trunc('day', due_date) = current_date
    ) as due_today_tasks
  from user_tasks
  group by belongs_to
)
select * from task_summary;