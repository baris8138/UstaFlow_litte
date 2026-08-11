export type ServiceRequestFormState = {
  status: "idle" | "success" | "error";
  message: string;
};

export const initialServiceRequestFormState: ServiceRequestFormState = {
  status: "idle",
  message: "",
};
