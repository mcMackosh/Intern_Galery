import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { CreateGalleryForm } from "../gallery_create/CreateGalleryForm";
import { useCreateGallery } from "../../hooks/useCreateGallery";

jest.mock("../../hooks/useCreateGallery");
const mockUseCreateGallery = useCreateGallery as jest.MockedFunction<typeof useCreateGallery>;

describe("CreateGalleryForm", () => {
  const createGalleryMock = jest.fn();

  beforeEach(() => {
    createGalleryMock.mockReset();
    mockUseCreateGallery.mockReturnValue({
      createGallery: createGalleryMock,
      isLoading: false,
    });
  });

  it("renders the form with fields and button", () => {
    render(<CreateGalleryForm />);

    expect(screen.getByLabelText(/Gallery Name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Description/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Create/i })).toBeInTheDocument();
  });

  it("shows errors for invalid inputs", async () => {
    render(<CreateGalleryForm />);

    const titleInput = screen.getByLabelText(/Gallery Name/i);
    const descriptionInput = screen.getByLabelText(/Description/i);
    const submitButton = screen.getByRole("button", { name: /Create/i });

    fireEvent.change(titleInput, { target: { value: "A" } });
    fireEvent.change(descriptionInput, { target: { value: "short" } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/Title must be at least 2 characters/i)).toBeInTheDocument();
      expect(screen.getByText(/Description must be at least 10 characters/i)).toBeInTheDocument();
    });
  });

  it("calls createGallery with correct data on submit", async () => {
    render(<CreateGalleryForm />);

    fireEvent.change(screen.getByLabelText(/Gallery Name/i), { target: { value: "My Gallery" } });
    fireEvent.change(screen.getByLabelText(/Description/i), { target: { value: "This is a cool gallery" } });
    fireEvent.click(screen.getByRole("button", { name: /Create/i }));

    await waitFor(() => {
      expect(createGalleryMock).toHaveBeenCalledTimes(1);
      expect(createGalleryMock).toHaveBeenCalledWith(
        { title: "My Gallery", description: "This is a cool gallery" },
        expect.objectContaining({ onSuccess: expect.any(Function) })
      );
    });
  });

  it("calls onSuccess after submit", async () => {
    const onSuccessMock = jest.fn();
    render(<CreateGalleryForm onSuccess={onSuccessMock} />);

    fireEvent.change(screen.getByLabelText(/Gallery Name/i), { target: { value: "My Gallery" } });
    fireEvent.change(screen.getByLabelText(/Description/i), { target: { value: "This is a cool gallery" } });
    fireEvent.click(screen.getByRole("button", { name: /Create/i }));

    await waitFor(() => {
      const onSuccess = createGalleryMock.mock.calls[0][1].onSuccess;
      onSuccess();
      expect(onSuccessMock).toHaveBeenCalledTimes(1);
    });
  });

  it("disables the button during isLoading", () => {
    mockUseCreateGallery.mockReturnValue({
      createGallery: createGalleryMock,
      isLoading: true,
    });

    render(<CreateGalleryForm />);
    const button = screen.getByRole("button", { name: /Creating.../i });
    expect(button).toBeDisabled();
  });

  it("resets the form after successful submit", async () => {
    render(<CreateGalleryForm />);

    const titleInput = screen.getByLabelText(/Gallery Name/i) as HTMLInputElement;
    const descriptionInput = screen.getByLabelText(/Description/i) as HTMLTextAreaElement;

    fireEvent.change(titleInput, { target: { value: "My Gallery" } });
    fireEvent.change(descriptionInput, { target: { value: "This is a cool gallery" } });

    fireEvent.click(screen.getByRole("button", { name: /Create/i }));

    await waitFor(() => {
      const onSuccess = createGalleryMock.mock.calls[0][1].onSuccess;
      onSuccess();
      expect(titleInput.value).toBe("");
      expect(descriptionInput.value).toBe("");
    });
  });

  it("applies red border class to inputs on validation error", async () => {
    render(<CreateGalleryForm />);

    const titleInput = screen.getByLabelText(/Gallery Name/i);
    const descriptionInput = screen.getByLabelText(/Description/i);
    fireEvent.change(titleInput, { target: { value: "A" } });
    fireEvent.change(descriptionInput, { target: { value: "short" } });

    fireEvent.click(screen.getByRole("button", { name: /Create/i }));

    await waitFor(() => {
      expect(titleInput).toHaveClass("border-red-500");
      expect(descriptionInput).toHaveClass("border-red-500");
    });
  });

  it("allows submitting again after successful submit and reset", async () => {
    render(<CreateGalleryForm />);

    const titleInput = screen.getByLabelText(/Gallery Name/i) as HTMLInputElement;
    const descriptionInput = screen.getByLabelText(/Description/i) as HTMLInputElement;

    fireEvent.change(titleInput, { target: { value: "My Gallery" } });
    fireEvent.change(descriptionInput, { target: { value: "This is a cool gallery" } });
    fireEvent.click(screen.getByRole("button", { name: /Create/i }));

    await waitFor(() => {
      const onSuccess = createGalleryMock.mock.calls[0][1].onSuccess;
      onSuccess();
      expect(titleInput.value).toBe("");
      expect(descriptionInput.value).toBe("");
    });

    fireEvent.change(titleInput, { target: { value: "Another Gallery" } });
    fireEvent.change(descriptionInput, { target: { value: "Another description" } });
    fireEvent.click(screen.getByRole("button", { name: /Create/i }));

    await waitFor(() => {
      expect(createGalleryMock).toHaveBeenCalledTimes(2);
      expect(createGalleryMock).toHaveBeenLastCalledWith(
        { title: "Another Gallery", description: "Another description" },
        expect.objectContaining({ onSuccess: expect.any(Function) })
      );
    });
  });

});