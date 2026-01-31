import { useState } from "react";
import { auth } from "../../firebase/firebase.js";
import { useNavigate } from "react-router-dom";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { FcGoogle } from 'react-icons/fc'; 

const SignIn = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  const handleGoogleSignIn = async () => {
    const provider = new GoogleAuthProvider();  

    try {
      await signInWithPopup(auth, provider);
      navigate("/group-chats");
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
    <div className="sign-in-container">
      <h1>Sign In</h1>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <button onClick={handleGoogleSignIn}>
        Sign in with Google
        {<FcGoogle size={24} style={{ marginLeft: "12px" }} />}
      </button>

      {/* You can add email/password fields later if needed */}
    </div>
  );
};

export default SignIn;