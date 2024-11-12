"use client";
import { createContext, PropsWithChildren, useContext } from "react";
import { useState } from "react";

interface ThemeContextType {
    themeApp: "light" | "dark";
    setThemeApp: (theme: "light" | "dark") => void;
}

const ThemeContext = createContext<ThemeContextType | null>(null);

function ThemeProvider({ children }: PropsWithChildren) {
    let localTheme: 'light' | 'dark' = localStorage.getItem("theme") as 'light' | 'dark';
    if (!localTheme) {
        localStorage.setItem("theme", "light");
        localTheme = "light";
    }

    const [themeApp, setThemeApp] = useState<"light" | "dark">(localTheme);
    return (
        <ThemeContext.Provider value={{
            themeApp,
            setThemeApp: (theme) => {
                localStorage.setItem("theme", theme);
                setThemeApp(theme);
            }
        }}>
            {children}
        </ThemeContext.Provider>
    )
}

export default ThemeProvider;

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
}
