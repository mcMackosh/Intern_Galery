import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { LoginForm } from "./LoginForm";
import { useLoginMutation } from "../../hooks/useLoginMutation";

jest.mock("../../hooks/useLoginMutation", () => ({
  useLoginMutation: jest.fn(),
}));

describe("LoginForm", () => {
  const mockLogin = jest.fn();

  beforeEach(() => {
    (useLoginMutation as jest.Mock).mockReturnValue({
      login: mockLogin,
      isLoading: false,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("renders the form with email, password fields and a button", () => {
    render(<LoginForm />);

    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /login/i })).toBeInTheDocument();
  });

  it("shows validation errors for incorrect input", async () => {
    render(<LoginForm />);
    const loginButton = screen.getByRole("button", { name: /login/i });
    userEvent.click(loginButton);

    await waitFor(() => {
      expect(screen.getByText(/invalid email address/i)).toBeInTheDocument();
      expect(screen.getByText(/password must be at least 8 characters/i)).toBeInTheDocument();
    });
  });

  it("calls login with correct data on submit", async () => {
    render(<LoginForm />);
    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const loginButton = screen.getByRole("button", { name: /login/i });

    await userEvent.type(emailInput, "test@example.com");
    await userEvent.type(passwordInput, "password123");

    await userEvent.click(loginButton);

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledTimes(1);
      expect(mockLogin).toHaveBeenCalledWith({
        email: "test@example.com",
        password: "password123",
      });
    });
  });

  it("disables inputs and button while isLoading is true", () => {
    (useLoginMutation as jest.Mock).mockReturnValue({
      login: mockLogin,
      isLoading: true,
    });

    render(<LoginForm />);
    const emailInput = screen.getByLabelText(/email/i) as HTMLInputElement;
    const passwordInput = screen.getByLabelText(/password/i) as HTMLInputElement;
    const loginButton = screen.getByRole("button", { name: /login/i });

    expect(emailInput.disabled).toBe(true);
    expect(passwordInput.disabled).toBe(true);
    expect(loginButton).toBeDisabled();
  });
});
