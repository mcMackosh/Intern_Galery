import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { LoginForm } from "./LoginForm";
import { useLoginMutation } from "../../hooks/useLoginMutation";

// Мокаємо хук useLoginMutation
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

  it("рендерить форму з полями email, password та кнопкою", () => {
    render(<LoginForm />);

    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /login/i })).toBeInTheDocument();
  });

  it("показує помилки валідації при некоректному введенні", async () => {
    render(<LoginForm />);
    const loginButton = screen.getByRole("button", { name: /login/i });
    userEvent.click(loginButton);

    await waitFor(() => {
      expect(screen.getByText(/invalid email address/i)).toBeInTheDocument();
      expect(screen.getByText(/password must be at least 8 characters/i)).toBeInTheDocument();
    });
  });

  it("викликає login з правильними даними при сабміті", async () => {
  render(<LoginForm />);
  const emailInput = screen.getByLabelText(/email/i);
  const passwordInput = screen.getByLabelText(/password/i);
  const loginButton = screen.getByRole("button", { name: /login/i });

  // Вводимо дані
  await userEvent.type(emailInput, "test@example.com");
  await userEvent.type(passwordInput, "password123");

  // Сабміт форми
  await userEvent.click(loginButton);

  // Чекаємо, поки login буде викликаний
  await waitFor(() => {
    expect(mockLogin).toHaveBeenCalledTimes(1);
    expect(mockLogin).toHaveBeenCalledWith({
      email: "test@example.com",
      password: "password123",
    });
  });
});

  it("дезейблить кнопку та інпути під час isLoading", () => {
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
