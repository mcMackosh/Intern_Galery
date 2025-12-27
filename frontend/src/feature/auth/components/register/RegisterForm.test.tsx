import { act, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { RegisterForm } from "./RegisterForm";
import { useRegisterMutation } from "../../hooks/useRegisterMutation";

jest.mock("../../hooks/useRegisterMutation", () => ({
  useRegisterMutation: jest.fn(),
}));

describe("RegisterForm", () => {
  const mockRegistration = jest.fn();

  beforeEach(() => {
    (useRegisterMutation as jest.Mock).mockReturnValue({
      registration: mockRegistration,
      isLoading: false,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("renders all inputs and the button", () => {
    render(<RegisterForm />);

    expect(screen.getByLabelText(/first name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/last name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^password$/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/confirm password/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /register/i })).toBeInTheDocument();
  });

  it("shows an error if passwords do not match", async () => {
    render(<RegisterForm />);
    const passwordInput = screen.getByLabelText(/^password$/i);
    const confirmPasswordInput = screen.getByLabelText(/confirm password/i);
    const registerButton = screen.getByRole("button", { name: /register/i });

    await userEvent.type(passwordInput, "Password1");
    await userEvent.type(confirmPasswordInput, "Password2");

    await userEvent.click(registerButton);

    expect(await screen.findByText(/passwords must match/i)).toBeInTheDocument();
  });

  it("calls registration with correct data on submit", async () => {
    render(<RegisterForm />);
    const firstNameInput = screen.getByLabelText(/first name/i);
    const lastNameInput = screen.getByLabelText(/last name/i);
    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/^password$/i);
    const confirmPasswordInput = screen.getByLabelText(/confirm password/i);
    const registerButton = screen.getByRole("button", { name: /register/i });

    await userEvent.type(firstNameInput, "John");
    await userEvent.type(lastNameInput, "Doe");
    await userEvent.type(emailInput, "john@example.com");
    await userEvent.type(passwordInput, "Password1");
    await userEvent.type(confirmPasswordInput, "Password1");

    await userEvent.click(registerButton);

    await waitFor(() => {
      expect(mockRegistration).toHaveBeenCalledTimes(1);
      expect(mockRegistration).toHaveBeenCalledWith({
        firstName: "John",
        lastName: "Doe",
        email: "john@example.com",
        password: "Password1",
      });
    });
  });

  it("disables all inputs and the button while isLoading is true", () => {
    (useRegisterMutation as jest.Mock).mockReturnValue({
      registration: mockRegistration,
      isLoading: true,
    });

    render(<RegisterForm />);
    const inputs = [
      screen.getByLabelText(/first name/i),
      screen.getByLabelText(/last name/i),
      screen.getByLabelText(/email/i),
      screen.getByLabelText(/^password$/i),
      screen.getByLabelText(/confirm password/i),
    ];
    const registerButton = screen.getByRole("button", { name: /registering/i });

    inputs.forEach((input) => expect(input).toBeDisabled());
    expect(registerButton).toBeDisabled();
  });
});
