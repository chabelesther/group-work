"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ImageIcon, SendIcon, XIcon } from "lucide-react";
import Image from "next/image";

interface ChatInputProps {
  onSendMessage: (content: string, imageUrl?: string) => void;
}

export function ChatInput({ onSendMessage }: ChatInputProps) {
  const [message, setMessage] = useState("");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() || imagePreview) {
      try {
        setIsUploading(true);
        let imageUrl;

        if (imagePreview) {
          // Convertir le data URL en File
          const response = await fetch(imagePreview);
          const blob = await response.blob();
          const file = new File([blob], "image.jpg", { type: blob.type });

          // Upload à Cloudinary
          imageUrl = await uploadImageToCloudinary(file);
        }

        onSendMessage(message, imageUrl);

        // Réinitialiser après l'envoi
        setMessage("");
        setImagePreview(null);
      } catch (error) {
        console.error("Error sending message:", error);
      } finally {
        setIsUploading(false);
      }
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImagePreview = () => {
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = ""; // Réinitialiser l'input file
    }
  };

  async function uploadImageToCloudinary(file: File): Promise<string> {
    const formData = new FormData();
    formData.append("file", file);
    formData.append(
      "upload_preset",
      process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!
    );
    formData.append("folder", "chat-images");

    try {
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error("Image upload failed");
      }

      const result = await response.json();
      return result.secure_url;
    } catch (error) {
      console.error("Cloudinary upload error:", error);
      throw error;
    }
  }

  return (
    <form onSubmit={handleSubmit} className="p-4 border-t">
      {imagePreview && (
        <div className="relative flex gap-2 mb-2 max-w-xs">
          <Image
            src={imagePreview}
            alt="Image preview"
            width={150}
            height={150}
            className="rounded-lg object-cover"
          />
          <Button
            type="button"
            variant="destructive"
            size="icon"
            className=" rounded-full"
            onClick={removeImagePreview}
          >
            <XIcon className="w-4 h-4" />
          </Button>
        </div>
      )}
      <div className="flex gap-2">
        <Textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Entrer votre message..."
          className="min-h-[80px]"
        />
        <div className="flex flex-col gap-2">
          <input
            type="file"
            accept="image/*"
            className="hidden"
            ref={fileInputRef}
            onChange={handleImageUpload}
          />
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
          >
            <ImageIcon className="h-4 w-4" />
          </Button>
          <Button
            type="submit"
            size="icon"
            disabled={isUploading || (!message.trim() && !imagePreview)}
          >
            <SendIcon className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </form>
  );
}
