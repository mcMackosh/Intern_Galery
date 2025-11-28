import { useMutation } from "@tanstack/react-query";
import authService from "../../../servises/auth.servise";
import { toastMessage } from "@/shared/utils/tost";
import { useRouter } from "next/navigation";

export function useLogoutMutation() {
    const router = useRouter();
    const { mutate: logout, isPending } = useMutation({
        mutationKey: ["logout user"],
        mutationFn: async () => authService.logout(),
        onSuccess: () => {
            router.push('/login');
            
        },
        onError: (error: Error) => {
            toastMessage(error);
        },
    })

    return { logout, isPending };
}