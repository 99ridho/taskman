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
import { Project } from "./types";
import { AlertDialogHeader } from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { deleteProjectAction } from "./action";
import { toast } from "sonner";

const ProjectDeleteDialog = ({
  project,
  onSuccess,
}: {
  project: Project;
  onSuccess?: () => void;
}) => {
  const [detailOpened, setDetailOpened] = useState(false);
  const [formState, formAction, pending] = useActionState(deleteProjectAction, {
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
      toast.success("Delete project success");
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
              Are you sure you want to delete this project? This action cannot
              be undone.
            </div>

            <Input
              id="project_id"
              name="project_id"
              type="hidden"
              value={project.project_id}
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
              <Button variant="destructive" type="submit">
                Yes
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ProjectDeleteDialog;
