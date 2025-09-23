import { useState } from 'react';
import ThemeToggle from '../ThemeToggle';

// Mock theme context for example
const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [theme, setTheme] = useState('light');
  
  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    console.log('Theme toggled to:', newTheme);
    document.documentElement.classList.toggle('dark', newTheme === 'dark');
  };

  return (
    <div style={{ padding: '20px' }}>
      <div>Current theme: {theme}</div>
      {children}
    </div>
  );
};

// Mock the useTheme hook
const mockUseTheme = () => {
  const [theme, setTheme] = useState('light');
  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    console.log('Theme toggled to:', newTheme);
  };
  return { theme, toggleTheme };
};

// Import and redefine the ThemeToggle for the example
import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";

function MockThemeToggle() {
  const { theme, toggleTheme } = mockUseTheme();

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      data-testid="button-theme-toggle"
    >
      {theme === "dark" ? (
        <Sun className="h-4 w-4" />
      ) : (
        <Moon className="h-4 w-4" />
      )}
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}

export default function ThemeToggleExample() {
  return (
    <ThemeProvider>
      <MockThemeToggle />
    </ThemeProvider>
  );
}