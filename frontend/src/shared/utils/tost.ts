import axios from "axios";
import { toast } from "sonner";

export function toastMessage(error: unknown) {
  if (axios.isAxiosError(error)) {
    if (!error.response) {
      toast.error("No server response");
      return;
    }

    const errorMessage = error.response.data?.message;

    if (Array.isArray(errorMessage)) {
      errorMessage.forEach((msg) => {
        toast.error(msg || "An error occurred");
      });
    } else if (typeof errorMessage === "string") {
      toast.error(errorMessage || "An error occurred");
    } else {
      toast.error("An error occurred");
    }
  } else {
    toast.error("Unknown error");
  }
}
