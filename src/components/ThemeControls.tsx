import type { FunctionComponent, ComponentChild } from 'preact';
import { useState, useEffect, useRef } from 'preact/hooks';

import { SpotlightButton } from '@browser/spotlight-button';

const Button: FunctionComponent<{ onClick?: () => void }> = ({
  onClick,
  children,
}): JSX.Element => {
  const button = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const btn = button.current;
    if (!btn) return;
    if (!SpotlightButton.isActive(btn)) new SpotlightButton(btn);
    return () => {
      SpotlightButton.instances.get(btn)?.disconnect();
    };
  }, []);

  return (
    <button ref={button} class="spotlight-button -my-2 p-2" onClick={onClick}>
      {children}
    </button>
  );
};

type ColorScheme = 'light' | 'dark';
const isColorScheme = (s: string | null | undefined): s is ColorScheme =>
  s === 'light' || s === 'dark';

const loadTheme = (): number | null => {
  const saved = window.localStorage.getItem('theme');
  return (saved && parseInt(saved)) || null;
};
const saveTheme = (n: number): void => {
  window.localStorage.setItem('theme', n.toString());
};

const loadColorScheme = (): ColorScheme | null => {
  const saved = window.localStorage.getItem('colorScheme');
  return isColorScheme(saved) ? saved : null;
};
const saveColorScheme = (scheme: ColorScheme): void => {
  window.localStorage.setItem('colorScheme', scheme);
};

interface ThemeControlsProps {
  themes: number;
  class?: string;
  iconTheme?: ComponentChild;
  iconLight?: ComponentChild;
  iconDark?: ComponentChild;
}

const ThemeControls: FunctionComponent<ThemeControlsProps> = ({
  themes: maxThemes,
  class: className,
  iconTheme,
  iconLight,
  iconDark,
}) => {
  const [theme, setTheme] = useState(0);
  const [colorScheme, setColorScheme] = useState<ColorScheme | null>(null);
  const [isManualColorScheme, setIsManualColorScheme] = useState(false);

  const nextTheme = (): void =>
    setTheme((current) => {
      let next = current + 1;
      return next < maxThemes ? next : 0;
    });

  const toggleColorScheme = (current: ColorScheme): void => {
    setIsManualColorScheme(true);
    setColorScheme(current === 'light' ? 'dark' : 'light');
  };

  useEffect(() => {
    const savedTheme = loadTheme();
    if (savedTheme) setTheme(savedTheme);

    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const useDefaultColorScheme = (): void => {
      const saved = loadColorScheme();
      if (saved) {
        setIsManualColorScheme(true);
        setColorScheme(saved);
        mq.removeEventListener('change', useDefaultColorScheme);
      } else {
        setColorScheme(mq.matches ? 'dark' : 'light');
      }
    };
    mq.addEventListener('change', useDefaultColorScheme);
    useDefaultColorScheme();

    return () => {
      mq.removeEventListener('change', useDefaultColorScheme);
    };
  }, []);

  useEffect(() => {
    document.documentElement.dataset.theme = theme.toString();
    saveTheme(theme);
  }, [theme]);

  useEffect(() => {
    if (!colorScheme) return;
    document.documentElement.dataset.colorScheme = colorScheme;
    if (isManualColorScheme) saveColorScheme(colorScheme);
  }, [colorScheme]);

  return (
    <div class={`flex ${className ?? ''}`}>
      <Button onClick={nextTheme}>{iconTheme}</Button>
      {colorScheme && (
        <Button onClick={() => toggleColorScheme(colorScheme)}>
          {colorScheme === 'light' ? iconLight : iconDark}
        </Button>
      )}
    </div>
  );
};

export default ThemeControls;
export { Button };
