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
import { Project } from "./types";
import { AlertDialogHeader } from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { updateProjectAction } from "./action";
import { toast } from "sonner";

const ProjectUpdateDialog = ({
  project,
  onSuccess,
}: {
  project: Project;
  onSuccess?: () => void;
}) => {
  const [detailOpened, setDetailOpened] = useState(false);
  const [formState, formAction, pending] = useActionState(updateProjectAction, {
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
      toast.success("Update project success");
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
            <DialogTitle>Update Project</DialogTitle>
          </AlertDialogHeader>
          <form className="space-y-4" action={formAction}>
            {!formState.success && formState.error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
                {formState.error.message}
              </div>
            )}
            <Input
              id="project_id"
              name="project_id"
              type="hidden"
              value={project.project_id}
            />
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                name="title"
                placeholder="Enter project title"
                defaultValue={project.title}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                name="description"
                placeholder="Enter project description"
                defaultValue={project.description}
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

export default ProjectUpdateDialog;
