import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import authService from "../../../servises/auth.servise";
import { toastMessage } from "@/shared/utils/tost";
import { toast } from "sonner";
import { useLoginMutation } from "./useLoginMutation";
import { useRouter } from "next/navigation";
import { renderHook, act, waitFor } from "@testing-library/react";

jest.mock("../../../servises/auth.servise");
jest.mock("@/shared/utils/tost");
jest.mock("sonner");
jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

describe("useLoginMutation", () => {
  const queryClient = new QueryClient();
  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );

  const pushMock = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue({ push: pushMock });
  });

  it("successfully login and redirects", async () => {
    const loginData = { email: "test@test.com", password: "123456" };
    (authService.login as jest.Mock).mockResolvedValue({ token: "abc123" });

    const { result } = renderHook(() => useLoginMutation(), { wrapper });

    act(() => {
      result.current.login(loginData);
    });

    await waitFor(() => expect(pushMock).toHaveBeenCalledWith("/gallery"));
    expect(authService.login).toHaveBeenCalledWith(loginData);
    expect(toast.success).toHaveBeenCalledWith("Login is successful");
  });

  it("handles error on failed login", async () => {
    const loginData = { email: "wrong@test.com", password: "wrong" };
    const error = new Error();
    (authService.login as jest.Mock).mockRejectedValue(error);

    const { result } = renderHook(() => useLoginMutation(), { wrapper });

    act(() => {
      result.current.login(loginData);
    });

    await waitFor(() => expect(toastMessage).toHaveBeenCalledWith(error));
    expect(pushMock).not.toHaveBeenCalled();
    expect(authService.login).toHaveBeenCalledWith(loginData);
  });
});
