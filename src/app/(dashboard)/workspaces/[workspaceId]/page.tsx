import { Analytics } from "@/components/analytics";
import { getCurrent } from "@/features/auth/queries";
import { ProjectsList } from "@/features/workspaces/components/projects-list";
import { TaskList } from "@/features/workspaces/components/task-list";
import { WorkspaceMembersList } from "@/features/workspaces/components/workspace-members-list";
import { getWorkspaceAnalytics } from "@/features/workspaces/queries";
import { redirect } from "next/navigation";

interface WorkspaceIdPagProps {
  params: { workspaceId: string };
}

const WorkspaceIdPage = async ({
  params: { workspaceId },
}: WorkspaceIdPagProps) => {
  const user = await getCurrent();

  if (!user) redirect("/sign-in");

  const workspaceAnalytics = await getWorkspaceAnalytics({ workspaceId });

  return (
    <div className="h-full flex flex-col space-y-4">
      {workspaceAnalytics && <Analytics data={workspaceAnalytics} />}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        <TaskList workspaceId={workspaceId} />
        <ProjectsList workspaceId={workspaceId} />
        <WorkspaceMembersList workspaceId={workspaceId} />
      </div>
    </div>
  );
};

export default WorkspaceIdPage;
