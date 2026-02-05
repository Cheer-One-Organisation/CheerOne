import { useState } from "react";
import { auth } from "../../firebase/firebase.js";
import { useNavigate } from "react-router-dom";
import { GoogleAuthProvider, signInWithPopup} from "firebase/auth";
import { FcGoogle } from 'react-icons/fc'; 
import {Button} from "@/components/ui/button";

const SignIn = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  const handleGoogleSignIn = async () => {
    const provider = new GoogleAuthProvider();  

    try {
      await signInWithPopup(auth, provider);
      navigate("/dashboard");
    } catch (error) {
      console.error("Error signing in with Google:", error);

      let message = "Something went wrong!";

      if (error.code === "auth/invalid-credential") {
        message = "Invalid credentials";
      }

      setError(message);
    }
  };

  
  return (
   
       <section>
            <header className="sticky top-0 z-50 border-b bg-card/80 backdrop-blur-md"></header>
      <h1 className="text-center">Sign In</h1>

      {error && <p style={{ color: "red" }}>{error}</p>}

    <section className="container mx-auto px-4 py-4 text-center">
          <section className="flex items-center gap-4">
      <Button className="bg-white border border-gray-300 text-black" onClick={handleGoogleSignIn}>
         {<FcGoogle size={24} style={{ marginLeft: "12px" }} />}
        Sign in with Google
       
      </Button>
      </section>
      </section>

     
    </section>
  );
};

export default SignIn;