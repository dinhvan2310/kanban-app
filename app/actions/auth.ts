"use server";

import {
    clientConfig,
    serverConfig,
} from "@/config/Firebase/config";
import { getTokens } from "next-firebase-auth-edge";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";

export async function decodeTokenAction() {
    const tokens = await getTokens(cookies(), {
        apiKey: clientConfig.apiKey,
        cookieName: serverConfig.cookieName,
        cookieSignatureKeys: serverConfig.cookieSignatureKeys,
        serviceAccount: serverConfig.serviceAccount,
    });

    if (!tokens) {
        notFound();
    }
    return tokens;
}
