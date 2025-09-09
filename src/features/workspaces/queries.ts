import { Query } from "node-appwrite";

import { DATABASE_ID, MEMBERS_ID, TASKS_ID, WORKSPACES_ID } from "@/config";
import { getMember } from "@/features/members/utils";
import { Workspace } from "@/features/workspaces/types";
import { createSessionClient } from "@/lib/appwrite";
import { endOfMonth, startOfMonth, subMonths } from "date-fns";
import { TaskStatus } from "../tasks/types";

export const getWorkspaces = async () => {
  try {
    const { account, databases } = await createSessionClient();

    const user = await account.get();

    const members = await databases.listDocuments(DATABASE_ID, MEMBERS_ID, [
      Query.equal("userId", user.$id),
    ]);

    if (members.total === 0) {
      return { documents: [], total: 0 };
    }

    const workspaceIds = members.documents.map((member) => member.workspaceId);

    const workspaces = await databases.listDocuments(
      DATABASE_ID,
      WORKSPACES_ID,
      [Query.orderDesc("$createdAt"), Query.contains("$id", workspaceIds)]
    );

    return workspaces;
  } catch {
    return { documents: [], total: 0 };
  }
};

interface GetWorkspaceProps {
  workspaceId: string;
}

export const getWorkspace = async ({ workspaceId }: GetWorkspaceProps) => {
  try {
    const { account, databases } = await createSessionClient();

    const user = await account.get();

    const member = await getMember({
      databases,
      userId: user.$id,
      workspaceId,
    });

    if (!member) {
      return null;
    }

    const workspace = await databases.getDocument<Workspace>(
      DATABASE_ID,
      WORKSPACES_ID,
      workspaceId
    );

    return workspace;
  } catch {
    return null;
  }
};

interface GetWorkspaceInfoProps {
  workspaceId: string;
}

interface getWorkspaceAnalyticsProps {
  workspaceId: string;
}

export const getWorkspaceInfo = async ({
  workspaceId,
}: GetWorkspaceInfoProps) => {
  try {
    const { databases } = await createSessionClient();

    const workspace = await databases.getDocument<Workspace>(
      DATABASE_ID,
      WORKSPACES_ID,
      workspaceId
    );

    return { name: workspace.name };
  } catch {
    return null;
  }
};

export const getWorkspaceAnalytics = async ({
  workspaceId,
}: getWorkspaceAnalyticsProps) => {
  const { account, databases } = await createSessionClient();

  const user = await account.get();

  const member = await getMember({
    databases,
    userId: user.$id,
    workspaceId: workspaceId,
  });

  if (!member) {
    throw new Error("Unauthorized");
  }

  const now = new Date();
  const thisMonthStart = startOfMonth(now);
  const thisMonthEnd = endOfMonth(now);
  const lastMonthStart = startOfMonth(subMonths(now, 1));
  const lastMonthEnd = endOfMonth(subMonths(now, 1));

  const thisMonthTasks = await databases.listDocuments(DATABASE_ID, TASKS_ID, [
    Query.equal("workspaceId", workspaceId),
    Query.greaterThanEqual("$createdAt", thisMonthStart.toISOString()),
    Query.lessThanEqual("$createdAt", thisMonthEnd.toISOString()),
  ]);

  const lastMonthTasks = await databases.listDocuments(DATABASE_ID, TASKS_ID, [
    Query.equal("workspaceId", workspaceId),
    Query.greaterThanEqual("$createdAt", lastMonthStart.toISOString()),
    Query.lessThanEqual("$createdAt", lastMonthEnd.toISOString()),
  ]);

  const taskCount = thisMonthTasks.total;
  const taskDifference = taskCount - lastMonthTasks.total;

  const thisMonthAssignedTasks = await databases.listDocuments(
    DATABASE_ID,
    TASKS_ID,
    [
      Query.equal("workspaceId", workspaceId),
      Query.equal("assigneeId", member.$id),
      Query.greaterThanEqual("$createdAt", thisMonthStart.toISOString()),
      Query.lessThanEqual("$createdAt", thisMonthEnd.toISOString()),
    ]
  );

  const lastMonthAssignedTasks = await databases.listDocuments(
    DATABASE_ID,
    TASKS_ID,
    [
      Query.equal("workspaceId", workspaceId),
      Query.equal("assigneeId", member.$id),
      Query.greaterThanEqual("$createdAt", lastMonthStart.toISOString()),
      Query.lessThanEqual("$createdAt", lastMonthEnd.toISOString()),
    ]
  );

  const assignedTaskCount = thisMonthAssignedTasks.total;
  const assignedTaskDifference =
    assignedTaskCount - lastMonthAssignedTasks.total;

  const thisMonthIncompleteTasks = await databases.listDocuments(
    DATABASE_ID,
    TASKS_ID,
    [
      Query.equal("workspaceId", workspaceId),
      Query.notEqual("status", TaskStatus.DONE),
      Query.greaterThanEqual("$createdAt", thisMonthStart.toISOString()),
      Query.lessThanEqual("$createdAt", thisMonthEnd.toISOString()),
    ]
  );

  const lastMonthIncompleteTasks = await databases.listDocuments(
    DATABASE_ID,
    TASKS_ID,
    [
      Query.equal("workspaceId", workspaceId),
      Query.notEqual("status", TaskStatus.DONE),
      Query.greaterThanEqual("$createdAt", lastMonthStart.toISOString()),
      Query.lessThanEqual("$createdAt", lastMonthEnd.toISOString()),
    ]
  );

  const incompleteTaskCount = thisMonthIncompleteTasks.total;
  const incompleteTaskDifference =
    incompleteTaskCount - lastMonthIncompleteTasks.total;

  const thisMonthCompletedTasks = await databases.listDocuments(
    DATABASE_ID,
    TASKS_ID,
    [
      Query.equal("workspaceId", workspaceId),
      Query.equal("status", TaskStatus.DONE),
      Query.greaterThanEqual("$createdAt", thisMonthStart.toISOString()),
      Query.lessThanEqual("$createdAt", thisMonthEnd.toISOString()),
    ]
  );

  const lastMonthCompletedTasks = await databases.listDocuments(
    DATABASE_ID,
    TASKS_ID,
    [
      Query.equal("workspaceId", workspaceId),
      Query.equal("status", TaskStatus.DONE),
      Query.greaterThanEqual("$createdAt", lastMonthStart.toISOString()),
      Query.lessThanEqual("$createdAt", lastMonthEnd.toISOString()),
    ]
  );

  const completedTaskCount = thisMonthCompletedTasks.total;
  const completedTaskDifference =
    completedTaskCount - lastMonthCompletedTasks.total;

  const thisMonthOverdueTasks = await databases.listDocuments(
    DATABASE_ID,
    TASKS_ID,
    [
      Query.equal("workspaceId", workspaceId),
      Query.notEqual("status", TaskStatus.DONE),
      Query.lessThan("dueDate", now.toISOString()),
      Query.greaterThanEqual("$createdAt", thisMonthStart.toISOString()),
      Query.lessThanEqual("$createdAt", thisMonthEnd.toISOString()),
    ]
  );

  const lastMonthOverdueTasks = await databases.listDocuments(
    DATABASE_ID,
    TASKS_ID,
    [
      Query.equal("workspaceId", workspaceId),
      Query.notEqual("status", TaskStatus.DONE),
      Query.lessThan("dueDate", now.toISOString()),
      Query.greaterThanEqual("$createdAt", lastMonthStart.toISOString()),
      Query.lessThanEqual("$createdAt", lastMonthEnd.toISOString()),
    ]
  );

  const overdueTaskCount = thisMonthOverdueTasks.total;
  const overdueTaskDifference = overdueTaskCount - lastMonthOverdueTasks.total;

  return {
    taskCount,
    taskDifference,
    assignedTaskCount,
    assignedTaskDifference,
    completedTaskCount,
    completedTaskDifference,
    incompleteTaskCount,
    incompleteTaskDifference,
    overdueTaskCount,
    overdueTaskDifference,
  };
};

export type GetProjectAnalyticsResponse = Awaited<
  ReturnType<typeof getWorkspaceAnalytics>
>;
