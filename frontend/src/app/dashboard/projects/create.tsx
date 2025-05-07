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
import { createProjectAction } from "./action";
import { toast } from "sonner";

interface DialogProps {
  onSuccess?: () => void;
}

const ProjectCreateDialog = (props: DialogProps) => {
  const [detailOpened, setDetailOpened] = useState(false);
  const [formState, formAction, pending] = useActionState(createProjectAction, {
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
      toast.success("Create new project success");
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
            Add Project
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <AlertDialogHeader>
            <DialogTitle>Create Project</DialogTitle>
          </AlertDialogHeader>
          <form className="space-y-4" action={formAction}>
            {!formState.success && formState.error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
                {formState.error.message}
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                name="title"
                placeholder="Enter project title"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                name="description"
                placeholder="Enter project description"
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

export default ProjectCreateDialog;
