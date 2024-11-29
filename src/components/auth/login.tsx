"use client";

import { saveUserToFirestore } from "@/lib/auth/utils";
import { auth } from "@/lib/firebase";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import Cookies from "js-cookie";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { Chrome } from "lucide-react";
import { Button } from "../ui/myButton";

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const searchParams = useSearchParams();
  const router = useRouter();
  // Récupérer le paramètre redirect
  const redirect = searchParams.get("redirect") || "/";
  const showErrorMessage = searchParams.has("redirect");
  const signInWithGoogle = async () => {
    setLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const userProfile = await saveUserToFirestore(result.user);
      // Stocker le token dans les cookies
      if (result.user) {
        const token = await result.user.getIdToken();
        console.log("token", token);
        Cookies.set("session", token, {
          expires: 14, // 14 jours
          secure: process.env.NODE_ENV === "production",
          sameSite: "strict",
        });
      }
      console.log("redirection completed");
      router.push(redirect);
      return userProfile || null;
    } catch (error) {
      console.error("Error signing in with Google:", error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <Card className="w-[400px]">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Welcome to DocCollab</CardTitle>
        </CardHeader>
        {showErrorMessage && (
          <div className="text-red-500 mb-4 text-center">
            Veuillez vous connecter pour accéder à cette page.
          </div>
        )}
        <CardContent>
          <Button
            onClick={signInWithGoogle}
            disabled={loading}
            className="w-full flex items-center justify-center gap-3 border-primary/20 hover:bg-primary/5 transition-colors duration-300"
          >
            {loading ? (
              <span>Connexion en cours...</span>
            ) : (
              <>
                <Chrome className="text-lg" /> Se connecter avec Google
              </>
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
