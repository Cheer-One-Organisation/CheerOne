import { useState } from "react";
import { auth } from "../../firebase/firebase.js";
import { useNavigate } from "react-router-dom";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { FcGoogle } from "react-icons/fc";
import { Button } from "@/components/ui/button";

import {
  doc,
  collection,
  updateDoc,
  getDocs,
  arrayUnion
} from "firebase/firestore";

import { fsdb } from "../../firebase/firebase";

const SignIn = () => {

  const navigate = useNavigate();
  const [error, setError] = useState("");

  /* ---------------- HANDLE POST SIGNUP ---------------- */

  const handlePostSignup = async (user:any) => {

    const contactLists = await getDocs(collection(fsdb, "ContactList"));

    contactLists.forEach(async (docSnap) => {

      const data = docSnap.data();

      if (!data.invites) return;

      const match = data.invites.find(
        (invite:any) => invite.email === user.email
      );

      if (match) {

        await updateDoc(docSnap.ref, {
          contacts: arrayUnion(user.uid)
        });

      }

    });

  };

  /* ---------------- GOOGLE SIGN IN ---------------- */

  const handleGoogleSignIn = async () => {

    const provider = new GoogleAuthProvider();

    try {

      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      await handlePostSignup(user);

      navigate("/dashboard");

    } catch (error:any) {

      console.error("Error signing in with Google:", error);

      let message = "Something went wrong!";

      if (error.code === "auth/invalid-credential")
        message = "Invalid credentials";

      setError(message);

    }

  };

  return (

    <section className="min-h-screen bg-background flex items-center justify-center">

      <div className="w-full max-w-md p-8 bg-card shadow-lg rounded-2xl">

        <div className="flex flex-col items-center mb-6">

          <h1 className="text-3xl font-bold text-center">
            Cheer One
          </h1>

          <p className="text-muted-foreground mt-2 text-center">
            Sign in to continue connecting with friends
          </p>

        </div>

        {error && (
          <p className="text-red-500 text-sm mb-4 text-center">
            {error}
          </p>
        )}

        <Button
          onClick={handleGoogleSignIn}
          className="flex items-center justify-center gap-3 w-full px-4 py-3 bg-white border border-gray-300 rounded-lg shadow-sm hover:shadow-md transition-all"
        >

          <FcGoogle size={24} />
          <span className="font-medium text-black">
            Sign in with Google
          </span>

        </Button>

        <p className="text-xs text-muted-foreground mt-6 text-center">

          By signing in, you agree to our
          <span className="underline cursor-pointer"> Terms of Service </span>
          and
          <span className="underline cursor-pointer"> Privacy Policy </span>

        </p>

      </div>

    </section>

  );
};

export default SignIn;