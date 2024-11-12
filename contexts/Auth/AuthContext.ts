import { UserCredential, UserInfo } from "firebase/auth";
import { Claims } from "next-firebase-auth-edge/lib/auth/claims";
import { createContext, useContext } from "react";

export interface User extends UserInfo {
    emailVerified: boolean;
    customClaims: Claims;
}

export interface AuthContextValue {
    user: User | null;
    signInWithEmailPassword: (email: string, password: string) => Promise<Response>;
    signUpWithEmailPassword: (email: string, password: string) => Promise<UserCredential>;
    signInWithGoogle: () => Promise<Response>;  
    signInWithFacebook: () => Promise<Response>;
    signInWithGithub: () => Promise<Response>;
    signOut: () => Promise<Response>;
}

export const AuthContext = createContext<AuthContextValue | null>(null);

export const useAuth = () => useContext(AuthContext);
