interface Message {
  id: string;
  content: string;
  sender: string;
  senderEmail: string;
  timestamp: Date;
  imageUrl?: string;
}

interface Project {
  id: string;
  name: string;
  collaborators: string[]; // Array of email addresses
}
