"use client";

import { type ChangeEvent, useRef, useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface Props {
  type: "image" | "video";
  accept: string;
  placeholder: string;
  folder: string;
  variant: "dark" | "light";
  onFileChange: (filePath: string) => void;
  value?: string;
}

const ImageUpload = ({
  type,
  accept,
  placeholder,
  variant,
  onFileChange,
  value,
}: Props) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [fileName, setFileName] = useState<string | null>(value ?? null);

  const styles = {
    button:
      variant === "dark"
        ? "bg-dark-300"
        : "bg-light-600 border-gray-100 border",
    placeholder: variant === "dark" ? "text-light-100" : "text-slate-500",
    text: variant === "dark" ? "text-light-100" : "text-dark-400",
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    setFileName(file.name);
    onFileChange(file.name);
  };

  return (
    <div className="space-y-2">
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        className="hidden"
        onChange={handleFileChange}
      />

      <button
        type="button"
        className={cn("upload-btn", styles.button)}
        onClick={() => inputRef.current?.click()}
      >
        <Image
          src="/icons/upload.svg"
          alt="upload-icon"
          width={20}
          height={20}
          className="object-contain"
        />

        <p className={cn("text-base", styles.placeholder)}>{placeholder}</p>

        {fileName && <p className={cn("upload-filename", styles.text)}>{fileName}</p>}
      </button>

      {type === "image" && fileName && (
        <div className="overflow-hidden rounded-md border border-light-100/10">
          <Image
            src={value ?? "/icons/upload.svg"}
            alt={fileName}
            width={500}
            height={300}
            className="h-48 w-full object-cover"
          />
        </div>
      )}
    </div>
  );
};

export default ImageUpload;
