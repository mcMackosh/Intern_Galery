import { renderHook, act, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useRegisterMutation } from "./useRegisterMutation";
import authService from "../../../servises/auth.servise";
import { toastMessage } from "@/shared/utils/tost";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

jest.mock("../../../servises/auth.servise");
jest.mock("@/shared/utils/tost");
jest.mock("sonner");
jest.mock("next/navigation", () => ({
    useRouter: jest.fn(),
}));

describe("useRegisterMutation", () => {
    const mockPush = jest.fn();
    let queryClient: QueryClient;

    beforeEach(() => {
        jest.clearAllMocks();
        (useRouter as jest.Mock).mockReturnValue({ push: mockPush });

        queryClient = new QueryClient({
            defaultOptions: {
                mutations: {
                    retry: false,
                },
            },
        });
    });

    const wrapper = ({ children }: { children: React.ReactNode }) => (
        <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );

    const validData = {
        firstName: "John",
        lastName: "Doe",
        email: "john@example.com",
        password: "Password1",
        confirmPassword: "Password1",
    };

    it("should call authService.register on registration", async () => {
        (authService.register as jest.Mock).mockResolvedValueOnce({ success: true });

        const { result } = renderHook(() => useRegisterMutation(), { wrapper });

        act(() => {
            result.current.registration(validData);
        });

        await waitFor(() =>
            expect(authService.register).toHaveBeenCalledWith(validData)
        );
    });

    it("should show success toast and navigate on successful registration", async () => {
        (authService.register as jest.Mock).mockResolvedValueOnce({ success: true });

        const { result } = renderHook(() => useRegisterMutation(), { wrapper });

        act(() => {
            result.current.registration(validData);
        });

        await waitFor(() => {
            expect(toast.success).toHaveBeenCalledWith("Registrer is successful");
            expect(mockPush).toHaveBeenCalledWith("/");
        });
    });

    it("should call toastMessage on registration error", async () => {
        const error = new Error("Failed registration");
        (authService.register as jest.Mock).mockRejectedValueOnce(error);

        const { result } = renderHook(() => useRegisterMutation(), { wrapper });

        act(() => {
            result.current.registration(validData);
        });

        await waitFor(() => {
            expect(toastMessage).toHaveBeenCalledWith(error);
        });
    });

    it("should have isLoading true while mutation is pending", async () => {
        let resolvePromise: any;
        const promise = new Promise((resolve) => (resolvePromise = resolve));
        (authService.register as jest.Mock).mockReturnValue(promise);

        const { result } = renderHook(() => useRegisterMutation(), { wrapper });

        act(() => {
            result.current.registration(validData);
        });

        await waitFor(() => {
            expect(result.current.isLoading).toBe(true);
        });

        act(() => {
            resolvePromise({ success: true });
        });
        await waitFor(() => {
            expect(result.current.isLoading).toBe(false);
        });
    });
});
