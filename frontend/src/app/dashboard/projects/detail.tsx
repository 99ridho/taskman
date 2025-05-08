/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { formatDate } from "@/lib/utils";
import { useEffect, useState } from "react";
import { PaginationInfo, Project, Task } from "./types";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@/components/ui/table";
import { useAuth } from "../context";
import { getProjectTasks } from "./api";
import Loading from "@/components/ui/loading";
import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/ui/data-table";
import { ArrowUpDown } from "lucide-react";
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

const ProjectDetailDialog = ({ project }: { project: Project }) => {
  const [detailOpened, setDetailOpened] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [paging, setPaging] = useState<PaginationInfo>({
    page: 0,
    page_size: 0,
    total_page: 0,
    total_records: 0,
  });
  const [loading, setLoading] = useState(true);
  const auth = useAuth();

  const fetchTasks = async (page: number, projectID: string) => {
    setLoading(true);
    try {
      const resp = await getProjectTasks(projectID, page, 10, auth.token);
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
  ];

  useEffect(() => {
    if (detailOpened) {
      fetchTasks(currentPage, project.project_id);
    }
  }, [currentPage, detailOpened]);

  return (
    <>
      <Dialog open={detailOpened} onOpenChange={setDetailOpened}>
        <DialogTrigger asChild>
          <Button variant="default" size="sm">
            Details
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-full h-screen [&>button]:hidden">
          <div className="flex flex-col h-full">
            <div className="flex justify-between items-center border-b p-4">
              <DialogTitle>Project Details</DialogTitle>
              <Button
                variant="outline"
                onClick={() => {
                  setDetailOpened(false);
                }}
              >
                Close
              </Button>
            </div>
            <div className="p-4 overflow-y-auto flex-grow">
              <div className="rounded-md border">
                <Table>
                  <TableBody>
                    <TableRow>
                      <TableHead>Project ID</TableHead>
                      <TableCell>{project.project_id}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableHead>Title</TableHead>
                      <TableCell>{project.title}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableHead>Description</TableHead>
                      <TableCell>{project.description}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableHead>Created At</TableHead>
                      <TableCell>{formatDate(project.created_at)}</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>

              <h1 className="text-xl font-bold mt-6">Tasks List</h1>
              <div className="rounded-md border mt-6">
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
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(1, prev - 1))
                  }
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
                    setCurrentPage((prev) =>
                      Math.min(paging.total_page, prev + 1)
                    )
                  }
                  disabled={
                    currentPage === paging.total_page || tasks.length == 0
                  }
                >
                  Next
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ProjectDetailDialog;
