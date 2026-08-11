export type TaskStatusState = {
  status: "idle" | "success" | "error";
  message: string;
};

export const initialTaskStatusState: TaskStatusState = {
  status: "idle",
  message: "",
};
