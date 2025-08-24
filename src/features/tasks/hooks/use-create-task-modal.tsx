import { useQueryState, parseAsBoolean, parseAsStringEnum } from "nuqs";
import { TaskStatus } from "../types";

export const useCreateTaskModal = () => {
  const [isOpen, setIsOpen] = useQueryState(
    "create-task",
    parseAsBoolean.withDefault(false).withOptions({ clearOnDefault: true })
  );

  const [taskStatus, setTaskStatus] = useQueryState(
    "task-status",
    parseAsStringEnum(Object.values(TaskStatus)).withOptions({
      clearOnDefault: true,
    })
  );

  const open = (status?: TaskStatus) => {
    setIsOpen(true);
    if (status) setTaskStatus(status);
  };
  const close = () => {
    setIsOpen(false);
    setTaskStatus(null);
  };

  return {
    isOpen,
    taskStatus,
    open,
    close,
    setIsOpen,
  };
};
