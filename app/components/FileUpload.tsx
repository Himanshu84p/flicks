"use client";

import React, { useState } from "react";
import { IKUpload } from "imagekitio-next";
import { IKUploadResponse } from "imagekitio-next/dist/types/components/IKUpload/props";
import { Loader2 } from "lucide-react";

export interface IFileUploadOptions {
  //onSuccess and onProgress is for returning the response to the state
  onSuccess: (res: IKUploadResponse) => void;
  onProgress: (res: number) => void;
  fileType?: "image" | "video";
}

export default function FileUpload({
  onSuccess,
  onProgress,
  fileType = "image",
}: IFileUploadOptions) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const handleError = (err: { message: string }) => {
    console.log("Error", err);
    setUploading(false);
    setError(err.message);
  };

  const handleSuccess = (res: IKUploadResponse) => {
    console.log("Success", res);
    setError(null);
    setUploading(false);
    onSuccess(res);
  };

  const handleUploadStart = () => {
    setUploading(true);
    setError(null);
  };

  const handleProgress = (evt: ProgressEvent) => {
    if (evt.lengthComputable && onProgress) {
      const percentComplete = (evt.loaded / evt.total) * 100;
      onProgress(Math.round(percentComplete));
    }
  };

  //function to validate all the required check for file uploads
  const validateFile = (file: File) => {
    if (fileType === "video") {
      console.log(file.type);
      if (!file.type.startsWith("video/")) {
        setError("Please Upload video format");
        return false;
      }
      if (file.size > 100 * 1024 * 1024) {
        setError("Please upload video size less than 200 MB");
        return false;
      }
    } else {
      const fileTypes = ["image/jpeg", "image/jpg", "image/webp"];
      if (!fileTypes.includes(file.type)) {
        setError("Please Upload proper image format(JPEG, JPG, webp)");
        return false;
      }

      if (file.size > 10 * 1024 * 1024) {
        setError("Please Upload image less than 10 MB");
        return false;
      }
    }
    return true;
  };

  return (
    <div className="App">
      <IKUpload
        fileName="test-upload"
        useUniqueFileName={true}
        validateFile={validateFile}
        accept={fileType === "video" ? "video/*" : "image/*"}
        folder={fileType === "video" ? "/video" : "/image"}
        onError={handleError}
        onSuccess={handleSuccess}
        onUploadProgress={handleProgress}
        onUploadStart={handleUploadStart}
        className="file-input file-input-primary"
      />
      {uploading && (
        <div className="flex items-center gap-2 p-3">
          <Loader2 className="w-4 h-4 animate-spin" />
          <span className="text-center text-green-400">Uploading...</span>
        </div>
      )}
      {error && (
        <div className="flex items-center gap-2 p-3">
          <p className="text-red-400">{error}</p>
        </div>
      )}
    </div>
  );
}
