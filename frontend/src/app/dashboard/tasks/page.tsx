"use client";

import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/utils";
import { useEffect, useState } from "react";
import TaskDetailDialog from "./detail";
import { PaginationInfo, Task } from "./types";
import TaskUpdateDialog from "./update";
import TaskDeleteDialog from "./delete";
import TaskCreateDialog from "./create";
import { getTasks } from "./api";
import { useAuth } from "../context";
import Loading from "@/components/ui/loading";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import { DataTable } from "@/components/ui/data-table";
import { getProjects } from "../projects/api";
import { Project } from "../projects/types";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import PriorityChips from "../priority-chip";

export default function TasksPage() {
  const auth = useAuth();
  const [currentPage, setCurrentPage] = useState(1);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [paging, setPaging] = useState<PaginationInfo>({
    page: 0,
    page_size: 0,
    total_page: 0,
    total_records: 0,
  });
  const [loading, setLoading] = useState(true);

  const projectMapping: Record<string, Project> = projects.reduce(
    (acc, val) => {
      acc[val.id] = val;
      return acc;
    },
    {} as Record<string, Project>
  );

  const fetchData = async (page: number) => {
    setLoading(true);
    try {
      const resp = await getTasks(page, 10, auth.token);
      if (resp.data) {
        setTasks(resp.data);
      }

      if (resp.paging) {
        setPaging(resp.paging);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchProjects = async () => {
    try {
      const resp = await getProjects(1, 1000, auth.token);
      if (resp.data) {
        setProjects(resp.data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchData(currentPage);
  }, [currentPage]);

  useEffect(() => {
    fetchProjects();
  }, []);

  const taskColumns: ColumnDef<Task>[] = [
    {
      accessorKey: "task_id",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Task ID
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
    },
    {
      accessorKey: "title",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Title
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
    },
    {
      accessorKey: "priority",
      header: ({ column }) => {
        return (
          <div className="flex flex-col items-center justify-items-stretch mb-2">
            <Button
              variant="ghost"
              onClick={() =>
                column.toggleSorting(column.getIsSorted() === "asc")
              }
            >
              Priority
              <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
            <Select
              onValueChange={(val) => {
                if (val === "0") {
                  column.setFilterValue(undefined);
                  return;
                }

                column.setFilterValue(val);
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Filter" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Priority</SelectLabel>
                  <SelectItem value="0">All</SelectItem>
                  <SelectItem value="1">Low</SelectItem>
                  <SelectItem value="2">Medium</SelectItem>
                  <SelectItem value="3">High</SelectItem>
                  <SelectItem value="4">Critical</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        );
      },
      cell: ({ row }) => {
        return <PriorityChips priority={row.getValue("priority") as string} />;
      },
    },
    {
      accessorKey: "is_completed",
      header: ({ column }) => {
        return (
          <div className="flex flex-col items-center justify-items-stretch mb-2">
            <Button
              variant="ghost"
              onClick={() =>
                column.toggleSorting(column.getIsSorted() === "asc")
              }
            >
              Is Completed?
              <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
            <Select
              onValueChange={(val) => {
                if (val === "all") {
                  column.setFilterValue(undefined);
                  return;
                }

                column.setFilterValue(val === "true");
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Filter" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Is Completed</SelectLabel>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="true">✅</SelectItem>
                  <SelectItem value="false">❌</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        );
      },
      cell: ({ row }) => {
        return row.getValue("is_completed") === true ? "✅" : "❌";
      },
    },
    {
      accessorKey: "due_date",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Due Date
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => {
        return formatDate(row.getValue("due_date"));
      },
    },
    {
      accessorKey: "created_at",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Created At
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => {
        return formatDate(row.getValue("created_at"));
      },
    },
    {
      accessorKey: "action",
      header: "Action",
      cell: ({ row }) => {
        return (
          <div className="space-x-4">
            <TaskDetailDialog
              task={row.original}
              getProjectDetail={(id) => projectMapping[id]}
            />
            <TaskUpdateDialog
              task={row.original}
              projects={projects}
              onSuccess={() => fetchData(currentPage)}
            />
            <TaskDeleteDialog
              task={row.original}
              onSuccess={() => fetchData(currentPage)}
            />
          </div>
        );
      },
    },
  ];

  return (
    <div className="p-8">
      <div className="flex flex-row justify-between">
        <h1 className="text-3xl font-bold mb-6">Tasks</h1>
        <TaskCreateDialog
          onSuccess={() => fetchData(currentPage)}
          projects={projects}
        />
      </div>

      <div className="rounded-md border">
        {loading ? (
          <Loading />
        ) : (
          <DataTable columns={taskColumns} data={tasks} />
        )}
      </div>

      <div className="flex items-center justify-end space-x-2 py-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
          disabled={currentPage === 1 || tasks.length == 0}
        >
          Previous
        </Button>
        <div className="text-sm font-medium">
          Page {currentPage} of {paging.total_page}
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() =>
            setCurrentPage((prev) => Math.min(paging.total_page, prev + 1))
          }
          disabled={currentPage === paging.total_page || tasks.length == 0}
        >
          Next
        </Button>
      </div>
    </div>
  );
}
