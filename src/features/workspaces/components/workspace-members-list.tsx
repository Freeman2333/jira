"use client";

import Link from "next/link";
import { SettingsIcon } from "lucide-react";

import { DottedSeparator } from "@/components/dotted-separator";
import { PageError } from "@/components/page-error";
import { PageLoader } from "@/components/page-loader";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useGetMembers } from "@/features/members/api/use-get-members";
import { MemberAvatar } from "@/features/members/components/member-avatar";

export const WorkspaceMembersList = ({
  workspaceId,
}: {
  workspaceId: string;
}) => {
  const { data: members, isLoading: isLoadingTasks } = useGetMembers({
    workspaceId,
  });

  if (isLoadingTasks) {
    return <PageLoader />;
  }

  if (!members) {
    return <PageError message="Failed to load workspace members." />;
  }

  return (
    <div className="flex flex-col gap-y-4 col-span-1">
      <div className="bg-white border rounded-lg p-4">
        <div className="flex items-center justify-between">
          <p className="text-lg font-semibold">Members ({members.total})</p>
          <Button variant="secondary" size="icon" asChild>
            <Link href={`/workspaces/${workspaceId}/members`}>
              <SettingsIcon className="size-4 text-neutral-400" />
            </Link>
          </Button>
        </div>
        <DottedSeparator className="my-4" />
        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {members.documents.map((member) => (
            <li key={member.$id}>
              <Card className="shadow-none rounded-lg">
                <CardContent className="p-3 flex flex-col items-center gap-x-2">
                  <MemberAvatar name={member.name} className="size-12" />
                  <p className="text-lg font-medium line-clamp-1">
                    {member.name}
                  </p>
                  <p className="text-sm text-muted-foreground line-clamp-1">
                    {member.email}
                  </p>
                </CardContent>
              </Card>
            </li>
          ))}
          <li className="text-sm text-muted-foreground text-center hidden first-of-type:block">
            No members found
          </li>
        </ul>
      </div>
    </div>
  );
};
