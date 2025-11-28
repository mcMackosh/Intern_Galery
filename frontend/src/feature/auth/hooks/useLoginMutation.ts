import { useMutation } from "@tanstack/react-query";
import authService from "../../../servises/auth.servise";
import { TypeLoginScheme } from "../schemes";
import { toastMessage } from "@/shared/utils/tost";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export function useLoginMutation() {
    const router = useRouter();
    const { mutate: login, isPending: isLoading } = useMutation({
        mutationKey: ["login user"],
        mutationFn: async (values: TypeLoginScheme) => authService.login(values),
        onSuccess: () => {
            toast.success('Login is successful');
            router.push('/');
        },
        onError: (error: Error) => {
            toastMessage(error);
        },
    })

    return { login, isLoading };
}