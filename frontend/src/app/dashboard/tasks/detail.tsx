"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { formatDate } from "@/lib/utils";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@/components/ui/table";
import { useState } from "react";
import { Task } from "./types";
import { Project } from "../projects/types";

const TaskDetailDialog = ({
  task,
  getProjectDetail,
}: {
  task: Task;
  getProjectDetail: (id: string) => Project | undefined;
}) => {
  const [detailOpened, setDetailOpened] = useState(false);
  const priorityMapping: Record<string, string> = {
    "1": "Low",
    "2": "Medium",
    "3": "High",
    "4": "Critical",
  };

  return (
    <>
      <Dialog open={detailOpened} onOpenChange={setDetailOpened}>
        <DialogTrigger asChild>
          <Button variant="default" size="sm">
            Details
          </Button>
        </DialogTrigger>
        <DialogContent>
          <div className="flex flex-col">
            <div className="flex justify-between items-center border-b p-4">
              <DialogTitle>Task Details</DialogTitle>
            </div>
            <div className="p-4 overflow-y-auto flex-grow">
              <div className="rounded-md border">
                <Table>
                  <TableBody>
                    <TableRow>
                      <TableHead>Task ID</TableHead>
                      <TableCell>{task.task_id}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableHead>Title</TableHead>
                      <TableCell>{task.title}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableHead>Description</TableHead>
                      <TableCell>{task.description}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableHead>Associated Project</TableHead>
                      <TableCell>
                        {getProjectDetail(task.project_id)?.title}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableHead>Status</TableHead>
                      <TableCell>{task.is_completed ? "✅" : "❌"}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableHead>Priority</TableHead>
                      <TableCell>{priorityMapping[task.priority]}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableHead>Due Date</TableHead>
                      <TableCell>{formatDate(task.due_date)}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableHead>Created At</TableHead>
                      <TableCell>{formatDate(task.created_at)}</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default TaskDetailDialog;
