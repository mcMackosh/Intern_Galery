import { renderHook, act, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import authService from "../../../servises/auth.servise";
import { toastMessage } from "@/shared/utils/tost";
import { useRouter } from "next/navigation";
import { useLogoutMutation } from "./useLogout";

jest.mock("../../../servises/auth.servise");
jest.mock("@/shared/utils/tost");
jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

describe("useLogoutMutation", () => {
  const queryClient = new QueryClient();
  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );

  const pushMock = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue({ push: pushMock });
  });

  it("should logout successfully and redirect to /login", async () => {
    (authService.logout as jest.Mock).mockResolvedValue(undefined);

    const { result } = renderHook(() => useLogoutMutation(), { wrapper });

    act(() => {
      result.current.logout();
    });

    await waitFor(() => expect(pushMock).toHaveBeenCalledWith("/login"));

    expect(authService.logout).toHaveBeenCalledTimes(1);

    expect(toastMessage).not.toHaveBeenCalled();
    expect(result.current.isPending).toBe(false);
  });

  it("should call toastMessage on logout error", async () => {
    const error = new Error("Logout failed");
    (authService.logout as jest.Mock).mockRejectedValue(error);
    const { result } = renderHook(() => useLogoutMutation(), { wrapper });

    act(() => {
      result.current.logout();
    });

    await waitFor(() => expect(toastMessage).toHaveBeenCalledWith(error));
    expect(pushMock).not.toHaveBeenCalled();
    expect(authService.logout).toHaveBeenCalledTimes(1);
  });

  it("should have isPending true during logout", async () => {
    let resolveLogout: () => void;

    (authService.logout as jest.Mock).mockImplementation(
      () =>
        new Promise<void>((resolve) => {
          resolveLogout = resolve;
        })
    );

    const { result } = renderHook(() => useLogoutMutation(), { wrapper });

    act(() => {
      result.current.logout();
    });

    await waitFor(() => expect(result.current.isPending).toBe(true));

    act(() => {
      resolveLogout!();
    });

    await waitFor(() => expect(result.current.isPending).toBe(false));
    await waitFor(() => expect(pushMock).toHaveBeenCalledWith("/login"));
  });
});
