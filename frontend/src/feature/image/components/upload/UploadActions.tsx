import Button from "@/shared/ui/Buton";

export const UploadActions: React.FC<{
    onCancel: () => void;
    onUpload: () => void;
    disabled: boolean;
    isLoading: boolean;
}> = ({
    onCancel,
    onUpload,
    disabled,
    isLoading,
}) => (
    <div className="flex justify-end gap-3 pt-4 border-t">
        <Button
            onClick={onCancel}
            className="px-4 py-2 rounded-md border"
            variant="secondary"
        >
            Cancel
        </Button>
        <Button
            disabled={disabled}
            onClick={onUpload}
            className="px-4 py-2 rounded-md bg-black text-white disabled:opacity-50"
        >
            {isLoading ? 'Uploading...' : 'Upload'}
        </Button>
    </div>
);