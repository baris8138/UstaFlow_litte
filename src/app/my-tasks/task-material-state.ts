export type TaskMaterialState = {
  status: "idle" | "success" | "error";
  message: string;
};

export const initialTaskMaterialState: TaskMaterialState = {
  status: "idle",
  message: "",
};
