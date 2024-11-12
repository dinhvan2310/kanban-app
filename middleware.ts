import { NextRequest, NextResponse } from "next/server";
import {
    authMiddleware,
    redirectToHome,
    redirectToLogin,
} from "next-firebase-auth-edge";
import { authConfig } from "@/config/Firebase/config";
import { i18n } from "@/config/i18n-config";

import { match as matchLocale } from "@formatjs/intl-localematcher";
import Negotiator from "negotiator";

const PUBLIC_PATHS = ["/register", "/login"];
const PUBLIC_PATHS_LOCALE = i18n.locales.flatMap((locale) =>
    PUBLIC_PATHS.map((path) => `/${locale}${path}`),
);

function getLocale(request: NextRequest): string | undefined {
    const negotiatorHeaders: Record<string, string> = {};
    request.headers.forEach((value, key) => (negotiatorHeaders[key] = value));
    // @ts-expect-error locales are readonly
    const locales: string[] = i18n.locales;
    const languages = new Negotiator({ headers: negotiatorHeaders }).languages(
        locales,
    );
    const locale = matchLocale(languages, locales, i18n.defaultLocale);
    return locale;
}

export async function middleware(request: NextRequest) {
    const pathname = request.nextUrl.pathname;
    const locale = getLocale(request);
    let pathnameIsMissingLocale = false;
    if (!pathname.startsWith("/api")) {
        pathnameIsMissingLocale = i18n.locales.every(
            (locale) =>
                !pathname.startsWith(`/${locale}/`) &&
                pathname !== `/${locale}`,
        );
    }
    return authMiddleware(request, {
        ...authConfig,
        handleValidToken: async ({ token, decodedToken }, headers) => {
            if (PUBLIC_PATHS_LOCALE.includes(request.nextUrl.pathname)) {
                return redirectToHome(request);
            }
            if (pathnameIsMissingLocale) {
                return NextResponse.redirect(
                    new URL(
                        `/${locale}${
                            pathname.startsWith("/") ? "" : "/"
                        }${pathname}`,
                        request.url,
                    ),
                );
            }
            return NextResponse.next({
                headers: headers,
            });
        },
        handleInvalidToken: async (reason) => {
            console.info("Missing or malformed credentials", { reason });
            return redirectToLogin(request, {
                path: `/${locale}/login`,
                publicPaths: PUBLIC_PATHS_LOCALE,
            });
        },
        handleError: async (error) => {
            console.error("Unhandled authentication error", { error });
            return redirectToLogin(request, {
                path: `/${locale}/login`,
                publicPaths: PUBLIC_PATHS_LOCALE,
            });
        },
    });
}

export const config = {
    matcher: ["/api/login", "/api/logout", "/", "/((?!_next|api|.*\\.).*)"],
};
