import { z } from "zod";

import { TaskStatus } from "./types";

const TaskStatusSchema = z.enum(
  Object.values(TaskStatus) as [string, ...string[]]
);

export const createTaskSchema = z.object({
  name: z.string().trim().min(1, "Required"),
  status: TaskStatusSchema,
  workspaceId: z.string().trim().min(1, "Required"),
  projectId: z.string().trim().min(1, "Required"),
  dueDate: z.coerce.date(),
  assigneeId: z.string().trim().min(1, "Required"),
  description: z.string().optional(),
});
