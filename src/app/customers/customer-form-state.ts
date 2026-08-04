export type CustomerFormState = {
  status: "idle" | "success" | "error";
  message: string;
};

export const initialCustomerFormState: CustomerFormState = {
  status: "idle",
  message: "",
};
