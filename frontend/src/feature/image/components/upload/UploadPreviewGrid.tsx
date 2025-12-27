import Button from "@/shared/ui/Buton";
import { Trash2 } from "lucide-react";

export const UploadPreviewGrid: React.FC<{
  files: File[];
  setFiles: React.Dispatch<React.SetStateAction<File[]>>;
}> = ({ files, setFiles }) => {
  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div
      className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4
                 border-2 border-dashed border-gray-300 rounded-lg p-4"
      data-testid="upload-preview-grid"
    >
      {files.map((file, idx) => (
        <div
          key={idx}
          className="relative group rounded-lg overflow-hidden border"
          data-testid={`upload-preview-item-${idx}`}
        >
          <img
            src={URL.createObjectURL(file)}
            alt={file.name}
            className="object-cover w-full h-40"
            data-testid="upload-preview-image"
          />

          <button
            type="button"
            onClick={() => removeFile(idx)}
            aria-label={`Remove ${file.name}`}
            data-testid={`upload-preview-remove-${idx}`}
            className="absolute top-2 right-2 bg-black/40 text-white text-xs
                       px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition"
          >
            <Trash2
              className="
                h-5 w-5
                cursor-pointer 
                text-gray-400 
                hover:text-red-600 
                transition
                inline-block
              "
            />
          </button>
        </div>
      ))}

      {files.length === 0 && (
        <div
          className="col-span-full text-center text-gray-400 py-10"
          data-testid="upload-preview-empty"
        >
          Your files will be here
        </div>
      )}
    </div>
  );
};
