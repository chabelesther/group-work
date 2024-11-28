import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../firebase";
import { User } from "firebase/auth";

export const saveUserToFirestore = async (userCredential: User) => {
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

export // Mappage des codes d'erreur Firebase aux traductions en français.
const firebaseErrorMessages: { [key: string]: string } = {
  "auth/user-disabled": "Ce compte a été désactivé.",
  "auth/network-request-failed":
    "Erreur de réseau. Vérifiez votre connexion internet.",
  "auth/too-many-requests": "Trop de tentatives. Veuillez réessayer plus tard.",
  default: "Une erreur s'est produite. Veuillez réessayer.",
};

export // Récupérer le paramètre redirect
const handleErrorMessage = (errorCode: string) => {
  return firebaseErrorMessages[errorCode] || firebaseErrorMessages["default"];
};
