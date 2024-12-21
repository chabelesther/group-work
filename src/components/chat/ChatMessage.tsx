"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { format } from "date-fns";
import Image from "next/image";

interface ChatMessageProps {
  message: Message;
  isCurrentUser: boolean;
}

export function ChatMessage({ message, isCurrentUser }: ChatMessageProps) {
  const initials = message.sender
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  return (
    <div
      className={`flex gap-3 ${
        isCurrentUser ? "flex-row-reverse" : "flex-row"
      } mb-4`}
    >
      <Avatar className="h-8 w-8">
        <AvatarFallback>{initials}</AvatarFallback>
      </Avatar>
      <div
        className={`flex flex-col ${
          isCurrentUser ? "items-end" : "items-start"
        }`}
      >
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">
            {message.sender}
          </span>
          {message.timestamp && (
            <span className="text-xs text-muted-foreground">
              {format(new Date(message.timestamp), "HH:mm")}
            </span>
          )}
        </div>
        <div
          className={`mt-1 rounded-lg w-[80%] max-sm:w-[90%]  p-3 ${
            isCurrentUser ? "bg-primary text-primary-foreground" : "bg-muted"
          }`}
        >
          {message.content}

          {message.imageUrl !== "no" && (
            <div className="mt-2">
              <Image
                src={message!.imageUrl!}
                alt="Shared image"
                width={200}
                height={200}
                className="rounded-md"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
