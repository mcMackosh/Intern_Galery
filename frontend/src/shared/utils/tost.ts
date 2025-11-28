import axios from "axios";
import { toast } from "sonner";

export function toastMessage(error: unknown) {
    if (axios.isAxiosError(error)) {
        const errorMessage = error.response?.data?.message;

        if (!error.response) {
            toast.error("No server response");
            return;
        }

        if (Array.isArray(errorMessage)) {
            toast.error(errorMessage.join("\p"));
        } else if (typeof errorMessage === "string") {
            toast.error(errorMessage || "An error occurred");
        } else {
            toast.error("An error occurred");
        }
    } else {
        toast.error("Unknown error");
    }
}