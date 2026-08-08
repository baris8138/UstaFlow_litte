export type TechnicianAssignmentState = {
  status: "idle" | "success" | "error";
  message: string;
};

export const initialTechnicianAssignmentState: TechnicianAssignmentState = {
  status: "idle",
  message: "",
};
