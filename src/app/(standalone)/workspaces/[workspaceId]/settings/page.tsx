import { getWorkspace } from "@/app/(dashboard)/queries";
import { getCurrent } from "@/features/auth/queries";
import EditWorkspaceForm from "@/features/workspaces/components/edit-workspace-form";
import { redirect } from "next/navigation";

interface WorkspaceIdSettingsPageProps {
  params: { workspaceId: string };
}

const WorkspaceIdSettingPage = async ({
  params,
}: WorkspaceIdSettingsPageProps) => {
  const user = await getCurrent();

  if (!user) redirect("/sign-in");

  const initialValues = await getWorkspace({ workspaceId: params.workspaceId });
  console.log("initialValues", initialValues);

  if (!initialValues) redirect("/workspaces");

  return (
    <div className="w-full lg:max-w-xl">
      <EditWorkspaceForm initialValues={initialValues} />
    </div>
  );
};

export default WorkspaceIdSettingPage;
