import { useCallback, useEffect, useMemo, useRef, useState } from "react";

const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/jpg", "application/pdf"];

export type DocumentKey = "aadhaar" | "land" | "bank" | "photo";

export type UploadStatus = "idle" | "uploading" | "success" | "error";

export interface DocumentUploadState {
  status: UploadStatus;
  file?: File;
  error?: string;
  previewUrl?: string;
  uploadedAt?: Date;
  progress: number;
}

export interface UseDocumentUploadResult {
  documents: Record<DocumentKey, DocumentUploadState>;
  inputRefs: Record<DocumentKey, React.RefObject<HTMLInputElement>>;
  handleCardClick: (key: DocumentKey) => void;
  handleFileChange: (key: DocumentKey, event: React.ChangeEvent<HTMLInputElement>) => void;
  resetError: (key: DocumentKey) => void;
}

/**
 * Shared upload logic for Profile document cards.
 * - Validates file size/type
 * - Simulates upload with progress
 * - Generates & cleans up preview URLs
 */
export function useDocumentUpload(onValidationError?: (message: string) => void): UseDocumentUploadResult {
  const [documents, setDocuments] = useState<Record<DocumentKey, DocumentUploadState>>({
    aadhaar: { status: "idle", progress: 0 },
    land: { status: "idle", progress: 0 },
    bank: { status: "idle", progress: 0 },
    photo: { status: "idle", progress: 0 },
  });

  const inputRefs: Record<DocumentKey, React.RefObject<HTMLInputElement>> = useMemo(
    () => ({
      aadhaar: useRef<HTMLInputElement>(null),
      land: useRef<HTMLInputElement>(null),
      bank: useRef<HTMLInputElement>(null),
      photo: useRef<HTMLInputElement>(null),
    }),
    [],
  );

  // Clean up object URLs on unmount or when file changes
  useEffect(() => {
    return () => {
      Object.values(documents).forEach((doc) => {
        if (doc.previewUrl) {
          URL.revokeObjectURL(doc.previewUrl);
        }
      });
    };
  }, [documents]);

  const validateFile = useCallback(
    (file: File): string | null => {
      if (!ALLOWED_TYPES.includes(file.type)) {
        return "Invalid file type. Allowed: JPG, PNG, PDF.";
      }
      if (file.size > MAX_FILE_SIZE_BYTES) {
        return "File too large (max 5MB).";
      }
      return null;
    },
    [],
  );

  const startUploadSimulation = useCallback((key: DocumentKey, file: File, previewUrl?: string) => {
    // Reset previous URL if present
    setDocuments((prev) => {
      const prevDoc = prev[key];
      if (prevDoc?.previewUrl && prevDoc.previewUrl !== previewUrl) {
        URL.revokeObjectURL(prevDoc.previewUrl);
      }
      return {
        ...prev,
        [key]: {
          status: "uploading",
          file,
          previewUrl,
          error: undefined,
          uploadedAt: undefined,
          progress: 0,
        },
      };
    });

    // Simulate upload with incremental progress
    let progress = 0;
    const interval = setInterval(() => {
      progress += 15 + Math.random() * 10;
      if (progress >= 100) {
        clearInterval(interval);
        setDocuments((prev) => ({
          ...prev,
          [key]: {
            ...prev[key],
            status: "success",
            progress: 100,
            uploadedAt: new Date(),
          },
        }));
      } else {
        setDocuments((prev) => ({
          ...prev,
          [key]: { ...prev[key], progress: Math.min(99, Math.round(progress)) },
        }));
      }
    }, 300);
  }, []);

  const handleFileChange = useCallback(
    (key: DocumentKey, event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];

      // Reset input so selecting the same file again still triggers change
      event.target.value = "";

      if (!file) {
        // User cancelled picker
        return;
      }

      const error = validateFile(file);
      if (error) {
        setDocuments((prev) => ({
          ...prev,
          [key]: {
            ...prev[key],
            status: "error",
            error,
            file: undefined,
            previewUrl: undefined,
            progress: 0,
            uploadedAt: undefined,
          },
        }));
        if (onValidationError) onValidationError(error);
        return;
      }

      const isImage = file.type.startsWith("image/");
      const previewUrl = isImage ? URL.createObjectURL(file) : undefined;

      startUploadSimulation(key, file, previewUrl);
    },
    [onValidationError, startUploadSimulation, validateFile],
  );

  const handleCardClick = useCallback(
    (key: DocumentKey) => {
      const ref = inputRefs[key];
      ref.current?.click();
    },
    [inputRefs],
  );

  const resetError = useCallback((key: DocumentKey) => {
    setDocuments((prev) => ({
      ...prev,
      [key]: { ...prev[key], status: "idle", error: undefined },
    }));
  }, []);

  return {
    documents,
    inputRefs,
    handleCardClick,
    handleFileChange,
    resetError,
  };
}


