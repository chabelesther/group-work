"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { signOut, onAuthStateChanged, User } from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import Cookies from "js-cookie";
import { auth, db } from "@/lib/firebase";

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  logout: async () => {},
  updateUserProfile: async () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  // Enregistrer l'utilisateur dans Firestore
  const saveUserToFirestore = async (userCredential: User) => {
    if (!userCredential) return null;

    const userRef = doc(db, "users", userCredential.uid);

    try {
      // Vérifier si l'utilisateur existe déjà
      const userDoc = await getDoc(userRef);

      const userProfile: UserProfile = {
        uid: userCredential.uid,
        email: userCredential.email || "",
        displayName: userCredential.displayName || "",
        photoURL: userCredential.photoURL || "",
        createdAt: userDoc.exists() ? userDoc.data().createdAt : Date.now(),
        role: userDoc.exists() ? userDoc.data().role || "student" : "student",
        groups: userDoc.exists() ? userDoc.data().groups || [] : [],
      };

      // Mettre à jour ou créer le document
      await setDoc(userRef, userProfile, { merge: true });

      return userProfile;
    } catch (error) {
      console.error("Erreur lors de l'enregistrement de l'utilisateur", error);
      throw error;
    }
  };

  // Déconnexion
  const logout = async () => {
    try {
      await signOut(auth);
      // Supprimer le cookie de session
      Cookies.remove("session");
      setUser(null);
    } catch (error) {
      console.error("Erreur de déconnexion", error);
    }
  };

  // Mettre à jour le profil utilisateur
  const updateUserProfile = async (updates: Partial<UserProfile>) => {
    if (!user) throw new Error("Aucun utilisateur connecté");

    try {
      const userRef = doc(db, "users", user.uid);
      await setDoc(userRef, updates, { merge: true });

      // Mettre à jour l'état local
      setUser((prev) => (prev ? { ...prev, ...updates } : null));
    } catch (error) {
      console.error("Erreur lors de la mise à jour du profil", error);
      throw error;
    }
  };

  // Écouter les changements d'état de l'authentification
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        try {
          // Récupérer le profil utilisateur depuis Firestore
          const userRef = doc(db, "users", currentUser.uid);
          const userDoc = await getDoc(userRef);

          if (userDoc.exists()) {
            setUser(userDoc.data() as UserProfile);
          } else {
            // Créer un nouveau profil si nécessaire
            const newProfile = await saveUserToFirestore(currentUser);
            setUser(newProfile);
          }
        } catch (error) {
          console.error("Erreur de récupération du profil", error);
          setUser(null);
        }
      } else {
        setUser(null);
      }

      setLoading(false);
    });

    // Nettoyer l'abonnement
    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        logout,
        updateUserProfile,
      }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
};

// Hook personnalisé pour utiliser le contexte d'authentification
export const useAuth = () => {
  return useContext(AuthContext);
};
