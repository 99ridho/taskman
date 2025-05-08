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
import { AlertDialogHeader } from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { createTaskAction } from "./action";
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

interface DialogProps {
  onSuccess?: () => void;
  projects?: Project[];
}

const TaskCreateDialog = (props: DialogProps) => {
  const [selectedPriority, setSelectedPriority] = useState<string>("");
  const [selectedProjectID, setSelectedProjectID] = useState<string>("");
  const [detailOpened, setDetailOpened] = useState(false);
  const [formState, formAction, pending] = useActionState(createTaskAction, {
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
      toast.success("Create new task success");
      doFormStateReset();
      props.onSuccess?.();
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
            Add Task
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <AlertDialogHeader>
            <DialogTitle>Create Task</DialogTitle>
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
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input id="title" name="title" placeholder="Enter task title" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                name="description"
                placeholder="Enter task description"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="priority">Priority</Label>
              <Select onValueChange={(val) => setSelectedPriority(val)}>
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
              <Select onValueChange={(val) => setSelectedProjectID(val)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select project to assign" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Project Name</SelectLabel>
                    {props.projects?.map((p) => (
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
              <Label htmlFor="due_date">Due Date</Label>
              <Input id="due_date" name="due_date" type="datetime-local" />
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

export default TaskCreateDialog;
