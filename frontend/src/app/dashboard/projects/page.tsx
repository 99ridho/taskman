/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/utils";
import { useEffect, useState } from "react";
import ProjectDetailDialog from "./detail";
import { PaginationInfo, Project } from "./types";
import ProjectUpdateDialog from "./update";
import ProjectDeleteDialog from "./delete";
import ProjectCreateDialog from "./create";
import { getProjects } from "./api";
import { useAuth } from "../context";
import Loading from "@/components/ui/loading";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import { DataTable } from "@/components/ui/data-table";

export default function ProjectsPage() {
  const auth = useAuth();
  const [currentPage, setCurrentPage] = useState(1);
  const [projects, setProjects] = useState<Project[]>([]);
  const [paging, setPaging] = useState<PaginationInfo>({
    page: 0,
    page_size: 0,
    total_page: 0,
    total_records: 0,
  });
  const [loading, setLoading] = useState(true);

  const fetchData = async (page: number) => {
    setLoading(true);
    try {
      const resp = await getProjects(page, 10, auth.token);
      if (resp.data) {
        setProjects(resp.data);
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

  useEffect(() => {
    fetchData(currentPage);
  }, [currentPage]);

  const projectColumns: ColumnDef<Project>[] = [
    {
      accessorKey: "project_id",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Project ID
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
            <ProjectDetailDialog project={row.original} />
            <ProjectUpdateDialog
              project={row.original}
              onSuccess={() => fetchData(currentPage)}
            />
            <ProjectDeleteDialog
              project={row.original}
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
        <h1 className="text-3xl font-bold mb-6">Projects</h1>
        <ProjectCreateDialog onSuccess={() => fetchData(currentPage)} />
      </div>

      <div className="rounded-md border">
        {loading ? (
          <Loading />
        ) : (
          <DataTable columns={projectColumns} data={projects} />
        )}
      </div>

      <div className="flex items-center justify-end space-x-2 py-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
          disabled={currentPage === 1 || projects.length == 0}
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
          disabled={currentPage === paging.total_page || projects.length == 0}
        >
          Next
        </Button>
      </div>
    </div>
  );
}
