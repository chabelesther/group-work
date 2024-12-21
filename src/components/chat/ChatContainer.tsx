import { useEffect, useRef, useState } from "react";
import { ChatMessage } from "./ChatMessage";
import { ChatInput } from "./ChatInput";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  addDoc,
  serverTimestamp,
  where,
} from "firebase/firestore";
import { db } from "@/lib/firebase";

interface ChatContainerProps {
  projectId: string;
  currentUser: UserProfile | null;
}

export function ChatContainer({ projectId, currentUser }: ChatContainerProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const scrollAreaRef = useRef<HTMLDivElement>(null); // Référence du conteneur des  messages
  const lastMessageRef = useRef<HTMLDivElement>(null); // Référence pour le dernier message

  useEffect(() => {
    const messagesRef = collection(db, "projects", projectId, "messages");
    const q = query(
      messagesRef,
      where("projectId", "==", projectId),
      orderBy("timestamp", "asc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const newMessages = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        timestamp: doc.data().timestamp?.toDate(),
      })) as Message[];
      setMessages(newMessages);
    });

    return () => unsubscribe();
  }, [projectId]);

  useEffect(() => {
    // Scroll vers le dernier message
    if (lastMessageRef.current) {
      lastMessageRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]); // Déclenché uniquement lorsque les messages changent

  const handleSendMessage = async (content: string, imageUrl?: string) => {
    try {
      const messagesRef = collection(db, "projects", projectId, "messages");
      await addDoc(messagesRef, {
        content,
        sender: currentUser?.displayName,
        senderEmail: currentUser?.email,
        timestamp: serverTimestamp(),
        projectId,
        imageUrl: imageUrl || "no",
      });
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  return (
    <div className="flex max-w-4xl mx-auto flex-col h-[600px] border rounded-lg">
      <ScrollArea ref={scrollAreaRef} className="flex-1 px-4 overflow-y-auto">
        {messages.map((message, index) => (
          <div
            key={message.id}
            ref={index === messages.length - 1 ? lastMessageRef : null} // Référence pour le dernier message
          >
            <ChatMessage
              message={message}
              isCurrentUser={message.senderEmail === currentUser?.email}
            />
          </div>
        ))}
      </ScrollArea>
      <ChatInput onSendMessage={handleSendMessage} />
    </div>
  );
}
