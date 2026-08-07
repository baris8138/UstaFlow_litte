export type CustomerUpdateFormState = {
  status: "idle" | "success" | "error";
  message: string;
};

export const initialCustomerUpdateFormState: CustomerUpdateFormState = {
  status: "idle",
  message: "",
};

export type CustomerStatusActionState = {
  status: "idle" | "success" | "error";
  message: string;
};

export const initialCustomerStatusActionState: CustomerStatusActionState = {
  status: "idle",
  message: "",
};
