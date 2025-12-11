import React, { createContext, useContext, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

type Theme = "dark" | "light" | "system";

interface ThemeProviderProps {
    children: React.ReactNode;
    defaultTheme?: Theme;
    storageKey?: string;
    adminStorageKey?: string;
}

interface ThemeProviderState {
    theme: Theme;
    adminTheme: Theme;
    activeTheme: Theme;
    setTheme: (theme: Theme) => void;
    setAdminTheme: (theme: Theme) => void;
}

const initialState: ThemeProviderState = {
    theme: "system",
    adminTheme: "system",
    activeTheme: "system",
    setTheme: () => null,
    setAdminTheme: () => null,
};

const ThemeProviderContext = createContext<ThemeProviderState>(initialState);

export function ThemeProvider({
    children,
    defaultTheme = "system",
    storageKey = "vite-ui-theme",
    adminStorageKey = "vite-admin-theme",
}: ThemeProviderProps) {
    const [theme, setThemeState] = useState<Theme>(
        () => (localStorage.getItem(storageKey) as Theme) || defaultTheme
    );
    const [adminTheme, setAdminThemeState] = useState<Theme>(
        () => (localStorage.getItem(adminStorageKey) as Theme) || defaultTheme
    );

    const location = useLocation();

    useEffect(() => {
        const root = document.documentElement;
        const isAdmin = location.pathname.startsWith("/admin");
        const activeTheme = isAdmin ? adminTheme : theme;

        root.classList.remove("light", "dark");

        if (activeTheme === "system") {
            const systemTheme = window.matchMedia("(prefers-color-scheme: dark)")
                .matches
                ? "dark"
                : "light";

            root.classList.add(systemTheme);
            return;
        }

        root.classList.add(activeTheme);
    }, [theme, adminTheme, location.pathname]);

    const setTheme = (theme: Theme) => {
        localStorage.setItem(storageKey, theme);
        setThemeState(theme);
    };

    const setAdminTheme = (theme: Theme) => {
        localStorage.setItem(adminStorageKey, theme);
        setAdminThemeState(theme);
    };

    const isAdmin = location.pathname.startsWith("/admin");
    const activeTheme = isAdmin ? adminTheme : theme;

    const value = {
        theme,
        adminTheme,
        activeTheme,
        setTheme,
        setAdminTheme,
    };

    return (
        <ThemeProviderContext.Provider value={value}>
            {children}
        </ThemeProviderContext.Provider>
    );
}

export const useTheme = () => {
    const context = useContext(ThemeProviderContext);

    if (context === undefined)
        throw new Error("useTheme must be used within a ThemeProvider");

    return context;
};
