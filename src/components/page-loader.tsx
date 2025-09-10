import { LoaderIcon } from "lucide-react";

export const PageLoader = () => {
  return (
    <div className="flex items-center justify-center h-full min-h-[350px]">
      <LoaderIcon className="size-6 animate-spin text-muted-foreground" />
    </div>
  );
};
