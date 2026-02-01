import { useState } from "react";
import { auth } from "../../firebase/firebase.js";
import { useNavigate } from "react-router-dom";
import { GoogleAuthProvider, signInWithPopup} from "firebase/auth";
import { FcGoogle } from 'react-icons/fc'; 

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
    <section className="sign-in-container">
      <h1>Sign In</h1>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <button onClick={handleGoogleSignIn}>
         {<FcGoogle size={24} style={{ marginLeft: "12px" }} />}
        Sign in with Google
       
      </button>

     
    </section>
  );
};

export default SignIn;