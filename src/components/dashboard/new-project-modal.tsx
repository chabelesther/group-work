"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { db } from "@/lib/firebase";
import {
  doc,
  setDoc,
  collection,
  serverTimestamp,
  updateDoc,
  arrayUnion,
} from "firebase/firestore";
import { useAuth } from "@/context/authContext/auth";
import { Button } from "../ui/button";
import { createInvitation, inviteCollaborator } from "@/lib/invitation";
import { useRouter } from "next/navigation";

const formSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string(),
  collaborators: z.string().optional(),
});

type ProjectFormValues = z.infer<typeof formSchema>;

export default function NewProjectModal({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const form = useForm<ProjectFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      collaborators: "",
    },
  });

  const onSubmit = async (data: ProjectFormValues) => {
    if (!user) return;
    // TODO: Submiting should be done server side
    try {
      setIsLoading(true);
      const projectRef = doc(collection(db, "projects"));
      const projectId = projectRef.id;

      const collaborators = data.collaborators
        ? data.collaborators.split(",").map((email) => email.trim())
        : [];
      // Enregistre le projet dans la collection users
      await updateDoc(doc(db, "users", user.uid), {
        projects: arrayUnion(projectId),
      });
      const projectData = {
        id: projectId,
        title: data.title,
        description: data.description,
        owner: { uid: user.uid, email: user.email },
        collaborators: [...collaborators, user.email],
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };

      await setDoc(projectRef, projectData);
      // TODO: Bad logic should be transaction
      // Envoi des mail invitations  aux collaborateurs
      const result = await inviteCollaborator(
        collaborators,
        projectData.title,
        user.displayName || user.email,
        projectId
      );

      if (result.success) {
        for (const email of collaborators) {
          await createInvitation(
            projectId,
            email,
            user.displayName || user.email,
            projectData.title
          );
        }

        toast({
          title: "Project created successfully",
          description: "Redirecting to editor...",
        });
        onOpenChange(false);
      } else {
        toast({
          title: "Error",
          description: "Failed to invite collaborators. Please try again.",
          variant: "destructive",
        });
      }

      router.push(`/project/${projectId}`);
    } catch (error) {
      console.error("Error creating project:", error);
      toast({
        title: "Error",
        description: "Failed to create project. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create New Project</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title du Projet</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter project title" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter project description"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="collaborators"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Collaborators</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter email addresses (comma-separated)"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Creating..." : "Create Project"}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
