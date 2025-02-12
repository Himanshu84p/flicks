"use client";

import React, { useState } from "react";
import { IKUpload } from "imagekitio-next";
import { IKUploadResponse } from "imagekitio-next/dist/types/components/IKUpload/props";
import { Loader2 } from "lucide-react";

const [uploading, setUploading] = useState(false);
const [error, setError] = useState<string | null>(null);

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
  const handleError = (err: { message: string }) => {
    console.log("Error", err);
    setUploading(false);
    setError(null);
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
    console.log("uploading starte", evt);
  };

  //function to validate all the required check for file uploads
  const validateFile = (file: File) => {
    if (fileType === "video") {
      if (!file.type.startsWith("/video")) {
        setError("Please Upload video format");
        setUploading(false);
        return false;
      }
      if (file.size > 200 * 1024 * 1024) {
        setError("Please upload video size less than 200 MB");
        setUploading(false);
        return false;
      }
    } else {
      const fileTypes = ["image/jpeg", "image/jpg", "image/webp"];
      if (!fileTypes.includes(file.type)) {
        setError("Please Upload proper image format(JPEG, JPG, webp)");
        setUploading(false);
        return false;
      }

      if (file.size > 10 * 1024 * 1024) {
        setError("Please Upload image less than 10 MB");
        setUploading(false);
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
        folder={fileType === "video" ? "/video" : "/image"}
        onError={handleError}
        onSuccess={onSuccess}
        onUploadProgress={handleProgress}
        onUploadStart={handleUploadStart}
        transformation={{
          pre: "l-text,i-Imagekit,fs-50,l-end",
          post: [
            {
              type: "transformation",
              value: "w-100",
            },
          ],
        }}
        style={{ display: "none" }} // hide the default input and use the custom upload button
      />
      {uploading && (
        <div className="flex items-center gap-2 p-3">
          <Loader2 />
          <span className="text-center text-green-400">Uploading...</span>
        </div>
      )}
      {error && <div className="flex items-center gap-2 p-3"><p className="text-red-400">{error}</p></div>}
    </div>
  );
}
