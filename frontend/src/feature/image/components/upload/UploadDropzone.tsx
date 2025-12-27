import React from 'react';

export const UploadDropzone: React.FC<{
    files: File[];
    setFiles: React.Dispatch<React.SetStateAction<File[]>>;
    'data-testid'?: string;
}> = ({ files, setFiles, 'data-testid': dataTestId = 'upload-dropzone' }) => {

    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        const files = e.target.files;
        if (!files) return;

        const newFiles = Array.from(files).map(
            file => new File([file], file.name, { type: file.type })
        );

        setFiles(prev => [...prev, ...newFiles]);
        e.target.value = '';
    };

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();

        const droppedFiles = Array.from(e.dataTransfer.files);
        const imageFiles = droppedFiles.filter(file =>
            file.type.startsWith('image/')
        );

        if (imageFiles.length) {
            setFiles(prev => [...prev, ...imageFiles]);
        }
    };

    return (
        <div
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            className="w-full"
            data-testid={dataTestId}
        >
            <label
                className="flex flex-col items-center justify-center border-2 border-dashed rounded-xl p-6 cursor-pointer hover:bg-gray-100 transition"
                data-testid="upload-dropzone-label"
            >
                <input
                    type="file"
                    multiple
                    accept="image/*"
                    className="hidden"
                    onChange={onChange}
                    aria-label="Upload images"
                    data-testid="upload-dropzone-input"
                />
                <p
                    className="text-sm text-gray-500"
                    data-testid="upload-dropzone-text"
                >
                    Click or drag images here
                </p>
            </label>
        </div>
    );
};
