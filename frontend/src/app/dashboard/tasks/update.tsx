/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { startTransition, useActionState, useEffect, useState } from "react";
import { Task } from "./types";
import { AlertDialogHeader } from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { updateTaskAction } from "./action";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Project } from "../projects/types";
import { formatDateForDatePicker } from "@/lib/utils";

const TaskUpdateDialog = ({
  task,
  projects,
  onSuccess,
}: {
  task: Task;
  projects: Project[];
  onSuccess?: () => void;
}) => {
  const [isComplete, setIsComplete] = useState(task.is_completed);
  const [selectedPriority, setSelectedPriority] = useState<string>(
    task.priority
  );
  const [selectedProjectID, setSelectedProjectID] = useState<string>(
    task.project_id
  );
  const [detailOpened, setDetailOpened] = useState(false);
  const [formState, formAction, pending] = useActionState(updateTaskAction, {
    success: false,
  });

  const doFormStateReset = () => {
    startTransition(() => {
      const resetFormStateTrigger = new FormData();
      resetFormStateTrigger.append("reset", "true");

      formAction(resetFormStateTrigger);
    });
  };

  useEffect(() => {
    if (formState.success) {
      toast.success("Update task success");
      doFormStateReset();
      onSuccess?.();
      setDetailOpened(false);
    }
  }, [formState]);

  return (
    <>
      <Dialog
        open={detailOpened}
        onOpenChange={(opened) => {
          if (!opened) {
            doFormStateReset();
          }
          setDetailOpened(opened);
        }}
      >
        <DialogTrigger asChild>
          <Button variant="default" size="sm">
            Update
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <AlertDialogHeader>
            <DialogTitle>Update Task</DialogTitle>
          </AlertDialogHeader>
          <form className="space-y-4" action={formAction}>
            {!formState.success && formState.error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
                <p>{formState.error.message}</p>
                <ul>
                  {formState.error.details?.map((detail, idx) => (
                    <p key={idx}>{detail}</p>
                  ))}
                </ul>
              </div>
            )}
            <Input
              id="task_id"
              name="task_id"
              type="hidden"
              value={task.task_id}
              readOnly
            />
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                name="title"
                placeholder="Enter task title"
                defaultValue={task.title}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                name="description"
                placeholder="Enter task description"
                defaultValue={task.description}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="priority">Priority</Label>
              <Select
                onValueChange={(val) => setSelectedPriority(val)}
                defaultValue={task.priority}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select task priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Priority</SelectLabel>
                    <SelectItem value="1">Low</SelectItem>
                    <SelectItem value="2">Medium</SelectItem>
                    <SelectItem value="3">High</SelectItem>
                    <SelectItem value="4">Critical</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
              <Input
                id="priority"
                name="priority"
                type="hidden"
                value={selectedPriority}
                readOnly
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="project_id">Project</Label>
              <Select
                onValueChange={(val) => setSelectedProjectID(val)}
                defaultValue={task.project_id}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select project to assign" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Project Name</SelectLabel>
                    {projects?.map((p) => (
                      <SelectItem value={p.id} key={p.id}>
                        {p.title}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
              <Input
                id="project_id"
                name="project_id"
                type="hidden"
                value={selectedProjectID}
                readOnly
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="is_complete">Is complete?</Label>
              <Select
                onValueChange={(val) => setIsComplete(val === "true")}
                defaultValue={task.is_completed ? "true" : "false"}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Is complete?" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="true">Yes</SelectItem>
                    <SelectItem value="false">No</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
              <Input
                id="is_complete"
                name="is_complete"
                type="hidden"
                value={isComplete ? "true" : "false"}
                readOnly
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="due_date">Due Date</Label>
              <Input
                id="due_date"
                name="due_date"
                type="datetime-local"
                defaultValue={formatDateForDatePicker(task.created_at)}
                step={1}
              />
            </div>
            <DialogFooter>
              <Button type="submit" disabled={pending}>
                {pending ? "Processing" : "Submit"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default TaskUpdateDialog;
