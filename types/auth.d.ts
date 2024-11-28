// Interface pour le profil utilisateur étendu
interface UserProfile {
  uid: string;
  email: string;
  displayName?: string;
  photoURL?: string;
  createdAt: number;
  role?: "student" | "professional" | "admin";
  groups?: string[];
}

// Interface pour le contexte d'authentification
interface AuthContextType {
  user: UserProfile | null;
  loading: boolean;
  logout: () => Promise<void>;
  updateUserProfile: (updates: Partial<UserProfile>) => Promise<void>;
}
