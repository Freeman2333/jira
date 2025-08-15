import { z } from "zod";

export const createProjectSchema = z.object({
  name: z.string().trim().min(1, "Project name is required."),
  image: z.any().optional(),
  workspaceId: z.string(),
});

export const updateProjectSchema = z.object({
  name: z.string().trim().min(1, "Must be 1 or more characters.").optional(),
  image: z.any().optional(),
  workspaceId: z.string(),
});
