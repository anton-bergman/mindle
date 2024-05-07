"use client";

import firebase from "firebase/compat/app";
import {
  useContext,
  createContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import {
  signOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  GithubAuthProvider,
  getRedirectResult,
  linkWithRedirect,
  signInWithRedirect,
  signInWithPopup,
  linkWithPopup,
  linkWithCredential,
} from "firebase/auth";
import { auth } from "../firebaseConfig";
import { FirebaseError } from "firebase/app";

interface AuthContextType {
  user: firebase.User | null;
  loading: boolean;
  userLoaded: boolean | null;
  signInWithGoogle: () => Promise<void>;
  signInWithGitHub: () => Promise<void>;
  signOutUser: () => Promise<void>;
}

interface AuthProps {
  //children: string | JSX.Element | JSX.Element[] | (() => JSX.Element);
  children: ReactNode;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  signInWithGoogle: () => Promise.resolve(),
  signInWithGitHub: () => Promise.resolve(),
  signOutUser: () => Promise.resolve(),
  userLoaded: null,
});

export const AuthContextProvider = ({ children }: AuthProps) => {
  const [user, setUser] = useState<firebase.User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [userLoaded, setUserLoaded] = useState<boolean | null>(null);

  const initializeUser = async (user: firebase.User): Promise<void> => {
    try {
      const userToken: string = await user.getIdToken();
      const response = await fetch("../api/initialize-user", {
        method: "POST",
        headers: {
          authorization: `Bearer ${userToken}`,
          "Content-type": "application/json",
        },
      });
      if (response.ok) {
        const data = await response.json();
        return;
      } else {
        throw new Error(`Failed to initialize user: ${response.status}`);
      }
    } catch (error) {
      throw new Error(`Error initializing user: ${error}`);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser as firebase.User | null);
      setLoading(false);
    });
    return () => unsubscribe();
  }, [user]);

  useEffect(() => {
    if (user && !loading) {
      // Successfully logged in
      setUserLoaded(true);
      initializeUser(user);
    } else if (!user && !loading) {
      // Access not allowed
      setUserLoaded(false);
    } else {
      setUserLoaded(null);
    }
  }, [user, loading]);

  const signInWithGoogle = async () => {
    const googleAuthProvider = new GoogleAuthProvider();
    const githubAuthProvider = new GithubAuthProvider();

    try {
      const result = await signInWithPopup(auth, googleAuthProvider);
    } catch (error) {
      if (
        error instanceof FirebaseError &&
        error.code === "auth/account-exists-with-different-credential"
      ) {
        const result = await signInWithPopup(auth, githubAuthProvider);
        await linkWithPopup(result.user, googleAuthProvider);
      } else {
        console.error(error);
      }
    }
  };

  const signInWithGitHub = async () => {
    const googleAuthProvider = new GoogleAuthProvider();
    const githubAuthProvider = new GithubAuthProvider();

    try {
      const result = await signInWithPopup(auth, githubAuthProvider);
    } catch (error) {
      if (
        error instanceof FirebaseError &&
        error.code === "auth/account-exists-with-different-credential"
      ) {
        const result = await signInWithPopup(auth, googleAuthProvider);
        await linkWithPopup(result.user, githubAuthProvider);
      } else {
        console.error(error);
      }
    }
  };

  const signOutUser = async () => {
    localStorage.clear();
    await signOut(auth);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        signInWithGoogle,
        signInWithGitHub,
        signOutUser,
        userLoaded,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
