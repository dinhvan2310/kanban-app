'use client';
import { useTheme } from "@/contexts/Theme/ThemeProvider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ConfigProvider, theme } from "antd";
import React, { PropsWithChildren } from "react";

function ConfigProviderApp({children}: PropsWithChildren) {
    const queryClient = new QueryClient({
        defaultOptions: {
            queries: {
                retry: 0
            }
        }
    });
    const {themeApp} = useTheme();
    return (
        <QueryClientProvider client={queryClient}>
            <ConfigProvider
                theme={{
                    algorithm: themeApp === 'light' ? theme.defaultAlgorithm : theme.darkAlgorithm,
                }}
            >
                {children}
            </ConfigProvider>
        </QueryClientProvider>
    )
}

export default ConfigProviderApp;
