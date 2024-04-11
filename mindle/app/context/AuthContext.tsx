import firebase from "firebase/compat/app";
import {
  useContext,
  createContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import {
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  GithubAuthProvider,
} from "firebase/auth";
import { auth } from "../firebaseConfig";
import { initializeUserDocuments } from "../database";

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
      initializeUserDocuments(user);
    } else if (!user && !loading) {
      // Access not allowed
      setUserLoaded(false);
    } else {
      setUserLoaded(null);
    }
  }, [user, loading]);

  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    await signInWithPopup(auth, provider);
  };

  const signInWithGitHub = async () => {
    const provider = new GithubAuthProvider();
    await signInWithPopup(auth, provider);
  };

  const signOutUser = async () => {
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
