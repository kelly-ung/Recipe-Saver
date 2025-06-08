import React from 'react';
import { auth } from './firebase';
import { signInWithPopup, GoogleAuthProvider, signOut } from 'firebase/auth';

// Firebase Authentication component for signing in and out with Google
function Auth() {
  // Function to handle sign-in with Google
  const handleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider); 
    } catch (error) {
      console.error("Error signing in: ", error);
    }
  };

  // Function to handle sign-out
  const handleSignOut = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Error signing out: ", error);
    }
  };
  
  // Render the sign-in or sign-out button based on authentication state
  return (
    <div>
      {auth.currentUser ? (
        <button onClick={handleSignOut}>Sign Out</button>
      ) : (
        <button onClick={handleSignIn}>Sign In with Google</button>
      )}
    </div>
  );
}

export default Auth;