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
import { startTransition, useActionState, useEffect, useState } from "react";
import { AlertDialogHeader } from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { deleteTaskAction } from "./action";
import { toast } from "sonner";
import { Task } from "./types";

const TaskDeleteDialog = ({
  task,
  onSuccess,
}: {
  task: Task;
  onSuccess?: () => void;
}) => {
  const [detailOpened, setDetailOpened] = useState(false);
  const [formState, formAction, pending] = useActionState(deleteTaskAction, {
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
      toast.success("Delete task success");
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
          <Button variant="destructive" size="sm">
            Delete
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <AlertDialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
          </AlertDialogHeader>
          <form action={formAction}>
            <div className="space-y-4">
              Are you sure you want to delete this task? This action cannot be
              undone.
            </div>

            <Input
              id="task_id"
              name="task_id"
              type="hidden"
              value={task.task_id}
            />

            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => {
                  setDetailOpened(false);
                }}
              >
                No
              </Button>
              <Button variant="destructive" type="submit" disabled={pending}>
                {pending ? "Processing" : "Yes"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default TaskDeleteDialog;
