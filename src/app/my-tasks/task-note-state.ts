export type TaskNoteState = {
  status: "idle" | "success" | "error";
  message: string;
};

export const initialTaskNoteState: TaskNoteState = {
  status: "idle",
  message: "",
};
