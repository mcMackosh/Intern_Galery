import { useMutation } from "@tanstack/react-query";
import authService from "../../../servises/auth.servise";
import { toastMessage } from "@/shared/utils/tost";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { TypeRegisterSchema } from "../schemes";

export function useRegisterMutation() {
    const router = useRouter();
    const { mutate: registration, isPending: isLoading } = useMutation({
        mutationKey: ["register user"],
        mutationFn: async (values: TypeRegisterSchema) => authService.register(values),
        onSuccess: () => {
            toast.success('Registrer is successful');
            router.push('/gallery');
        },
        onError: (error: Error) => {
            toastMessage(error);
        },
    })

    return { registration, isLoading };
}