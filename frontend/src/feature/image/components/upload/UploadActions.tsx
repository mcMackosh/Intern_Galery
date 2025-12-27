import Button from "@/shared/ui/Buton";

export const UploadActions: React.FC<{
    onCancel: () => void;
    onUpload: () => void;
    disabled: boolean;
    isLoading: boolean;
    cancelTestId?: string;
    uploadTestId?: string;
}> = ({
    onCancel,
    onUpload,
    disabled,
    isLoading,
    cancelTestId = "upload-actions-cancel",
    uploadTestId = "upload-actions-upload",
}) => (
    <div
        className="flex justify-end gap-3 pt-4 border-t"
        data-testid="upload-actions"
    >
        <Button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 rounded-md border"
            variant="secondary"
            data-testid={cancelTestId}
        >
            Cancel
        </Button>

        <Button
            type="button"
            disabled={disabled}
            aria-disabled={disabled}
            onClick={onUpload}
            className="px-4 py-2 rounded-md bg-black text-white disabled:opacity-50"
            data-testid={uploadTestId}
        >
            {isLoading ? "Uploading..." : "Upload"}
        </Button>
    </div>
);
