import React, { createContext, useState, useEffect } from 'react';

export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
    // 1. Get the initial theme from local storage or system preference
    const initialTheme = localStorage.getItem('theme') || (
        window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
    );
    const [theme, setTheme] = useState(initialTheme);

    // 2. Use useEffect to apply the theme class to the HTML element
    useEffect(() => {
        document.documentElement.className = theme;
        localStorage.setItem('theme', theme);
    }, [theme]);

    // 3. Create a function to toggle the theme
    const toggleTheme = () => {
        setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
    };

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};