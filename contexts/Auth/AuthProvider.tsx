"use client";

import * as React from "react";
import { AuthContext, User } from "./AuthContext";
import {
    createUserWithEmailAndPassword,
    FacebookAuthProvider,
    GithubAuthProvider,
    GoogleAuthProvider,
    signInWithEmailAndPassword,
    signInWithPopup,
    signOut,
} from "firebase/auth";
import { auth } from "@/lib/firebase/firebase";
import { addUserData } from "@/api/user";
import { NO_IMAGE } from "@/constants/utils";

export interface AuthProviderProps {
    user: User | null;
    children: React.ReactNode;
}

export const AuthProvider: React.FunctionComponent<AuthProviderProps> = ({
    user,
    children,
}) => {
    return (
        <AuthContext.Provider
            value={{
                user,
                signInWithEmailPassword: async (
                    email: string,
                    password: string,
                ) => {
                    const credential = await signInWithEmailAndPassword(
                        auth,
                        email,
                        password,
                    );
                    const idToken = await credential.user.getIdToken();
                    await addUserData(credential.user.uid, email, credential.user.displayName ?? email, credential.user.photoURL ?? NO_IMAGE);
                    return fetch("/api/login", {
                        headers: {
                            Authorization: `Bearer ${idToken}`,
                        },
                    });
                },
                signUpWithEmailPassword: async (
                    email: string,
                    password: string,
                ) => {
                    return createUserWithEmailAndPassword(auth, email, password);
                },
                signInWithGoogle: async () => {
                    const ggProvider = new GoogleAuthProvider();
                    const credential = await signInWithPopup(auth, ggProvider)
                    const idToken = await credential.user.getIdToken();
                    await addUserData(credential.user.uid, credential.user.email ?? '', credential.user.displayName ?? '', credential.user.photoURL ?? '');
                    return fetch("/api/login", {
                        headers: {
                            Authorization: `Bearer ${idToken}`,
                        },
                    });
                },
                signInWithFacebook: async  () => {
                    const fbProvider = new FacebookAuthProvider();
                    const credential = await signInWithPopup(auth, fbProvider)
                    const idToken = await credential.user.getIdToken();
                    await addUserData(credential.user.uid, credential.user.email ?? '', credential.user.displayName ?? '', credential.user.photoURL ?? '');
                    return fetch("/api/login", {
                        headers: {
                            Authorization: `Bearer ${idToken}`,
                        },
                    });
                },
                signInWithGithub: async () => {
                    const githubProvider = new GithubAuthProvider();
                    const credential = await signInWithPopup(auth, githubProvider)
                    const idToken = await credential.user.getIdToken();
                    await addUserData(credential.user.uid, credential.user.email ?? '', credential.user.displayName ?? '', credential.user.photoURL ?? '');
                    return fetch("/api/login", {
                        headers: {
                            Authorization: `Bearer ${idToken}`,
                        },
                    });
                },
                signOut: async () => {
                    await signOut(auth);
                    return fetch("/api/logout");
                },
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};
