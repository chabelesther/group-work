interface Project {
  collaborators: string[];
  createdAt: string; // ou Date, si vous préférez gérer les dates comme des objets Date
  description: string;
  id: string;
  owner: {
    email: string;
    uid: string;
  };
  title: string;
  updatedAt: string; // ou Date
}
